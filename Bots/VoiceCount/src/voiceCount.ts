import {
  rootServer,
  Channel,
  ChannelGetRequest,
  ChannelWebRtcEvent,
  ChannelWebRtcUserAttachEvent,
  ChannelWebRtcUserDetachEvent,
  ChannelGuid,
  ChannelWebRtcListRequest,
  ChannelWebRtcListResponse,
  ChannelEditRequest
} from "@rootsdk/server-bot";

const IDLE_CLEAR_DELAY_MS = 2 * 60 * 1000;
const COUNT_SUFFIX = /\s*\[\s*\d+\s*\]$/;

// Pending clears debounce only matters when there's a user-provided base description
// to preserve. Channels with no base description clear immediately.
const pendingClears = new Map<ChannelGuid, NodeJS.Timeout>();

export function initialize(): void {
  rootServer.community.channelWebRtcs.on(ChannelWebRtcEvent.ChannelWebRtcUserAttach, onAttach);
  rootServer.community.channelWebRtcs.on(ChannelWebRtcEvent.ChannelWebRtcUserDetach, onDetach);
}

async function onAttach(evt: ChannelWebRtcUserAttachEvent): Promise<void> {
  try {
    await refreshChannel(evt.channelId);
  } catch (err) {
    console.error("VoiceCount: onAttach failed", err);
  }
}

async function onDetach(evt: ChannelWebRtcUserDetachEvent): Promise<void> {
  try {
    await refreshChannel(evt.channelId);
  } catch (err) {
    console.error("VoiceCount: onDetach failed", err);
  }
}

async function refreshChannel(channelId: ChannelGuid): Promise<void> {
  cancelPendingClear(channelId);

  const channel: Channel = await getChannel(channelId);
  const current: string = channel.description ?? "";
  const count: number = await getCount(channelId);
  const base: string = stripCount(current);

  if (count > 0) {
    const next: string = base.length > 0 ? `${base} [ ${count} ]` : `[ ${count} ]`;
    if (next !== current)
      await updateChannelDescription(channel, next);
    return;
  }

  // count === 0
  if (base.length === 0) {
    // No user-provided description — clear immediately, no debounce needed.
    if (current !== "")
      await updateChannelDescription(channel, "");
    return;
  }

  // User-provided description — strip the count immediately so the base shows alone,
  // then schedule a 2-minute wipe of the description if the channel stays idle.
  if (current !== base)
    await updateChannelDescription(channel, base);
  schedulePendingClear(channelId);
}

function schedulePendingClear(channelId: ChannelGuid): void {
  const timer = setTimeout(() => {
    pendingClears.delete(channelId);
    runIdleClear(channelId).catch(err => console.error("VoiceCount: idle clear failed", err));
  }, IDLE_CLEAR_DELAY_MS);
  pendingClears.set(channelId, timer);
}

function cancelPendingClear(channelId: ChannelGuid): void {
  const existing = pendingClears.get(channelId);
  if (!existing)
    return;
  clearTimeout(existing);
  pendingClears.delete(channelId);
}

async function runIdleClear(channelId: ChannelGuid): Promise<void> {
  const count: number = await getCount(channelId);
  if (count > 0) {
    await refreshChannel(channelId);
    return;
  }

  const channel: Channel = await getChannel(channelId);
  if ((channel.description ?? "") === "")
    return;

  await updateChannelDescription(channel, "");
}

function stripCount(description: string): string {
  return description.replace(COUNT_SUFFIX, "");
}

async function getCount(channelId: ChannelGuid): Promise<number> {
  const request: ChannelWebRtcListRequest = { channelId: channelId };
  const response: ChannelWebRtcListResponse = await rootServer.community.channelWebRtcs.list(request);
  return response.members ? response.members.length : 0;
}

async function getChannel(channelId: ChannelGuid): Promise<Channel> {
  const request: ChannelGetRequest = { id: channelId };
  return await rootServer.community.channels.get(request);
}

async function updateChannelDescription(channel: Channel, updatedDescription: string): Promise<void> {
  const request: ChannelEditRequest = {
    id: channel.id,
    name: channel.name,
    description: updatedDescription,
    updateIcon: false,
    useChannelGroupPermission: channel.useChannelGroupPermission
  };

  await rootServer.community.channels.edit(request);
}
