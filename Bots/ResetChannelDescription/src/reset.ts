import {
  rootServer,
  RootApiException,
  ErrorCodeType,
  Channel,
  ChannelGetRequest,
  ChannelWebRtcEvent,
  ChannelWebRtcUserDetachEvent,
  ChannelGuid,
  ChannelWebRtcListRequest,
  ChannelWebRtcListResponse,
  ChannelEditRequest,
} from "@rootsdk/server-bot";

export function initializeReset(): void {
  rootServer.community.channelWebRtcs.on(ChannelWebRtcEvent.ChannelWebRtcUserDetach, onDetach);
}

// When the last participant leaves a voice channel, clear its description
// so it resets for the next session.
async function onDetach(evt: ChannelWebRtcUserDetachEvent): Promise<void> {
  try {
    const channelId: ChannelGuid = evt.channelId;

    if (!(await isEmpty(channelId)))
      return;

    const channel: Channel = await getChannel(channelId);

    await updateChannelDescription(channel, "");
  } catch (xcpt: unknown) {
    if (xcpt instanceof RootApiException) {
      switch (xcpt.errorCode) {
        case ErrorCodeType.NotFound:
          console.error("Channel not found — it may have been deleted");
          break;
        case ErrorCodeType.TooManyRequests:
          console.error("Rate limited — commands max ~5 req/s");
          break;
        default:
          console.error("RootApiException:", xcpt.errorCode);
      }
    } else if (xcpt instanceof Error) {
      console.error("Unexpected error:", xcpt.message);
    }
  }
}

async function getChannel(channelId: ChannelGuid): Promise<Channel> {
  const request: ChannelGetRequest = { id: channelId };

  const channel: Channel = await rootServer.community.channels.get(request);

  return channel;
}

async function updateChannelDescription(channel: Channel, updatedDescription: string): Promise<void> {
  const request: ChannelEditRequest =
    { 
      id: channel.id,
      name: channel.name,
      description: updatedDescription,
      updateIcon: false,
      useChannelGroupPermission: channel.useChannelGroupPermission
    };

  await rootServer.community.channels.edit(request);
}

async function isEmpty(channelId: ChannelGuid) : Promise<boolean> {
  const request: ChannelWebRtcListRequest = { channelId: channelId };

  const response: ChannelWebRtcListResponse = await rootServer.community.channelWebRtcs.list(request);

  if (!response.members)
    return true;

  return (response.members.length === 0);
}
