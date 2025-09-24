import {
  rootServer,
  Channel,
  ChannelGetRequest,
  ChannelWebRtcEvent,
  ChannelWebRtcUserDetachEvent,
  ChannelGuid,
  ChannelWebRtcListRequest,
  ChannelWebRtcListResponse,
  ChannelEditRequest
} from "@rootsdk/server-bot";

export function initialize(): void {
  rootServer.community.channelWebRtcs.on(ChannelWebRtcEvent.ChannelWebRtcUserDetach, onDetach);
}

async function onDetach(evt: ChannelWebRtcUserDetachEvent): Promise<void> {
  const channelId: ChannelGuid = evt.channelId;

  if (!(await isEmpty(channelId)))
    return;

  const channel: Channel = await getChannel(channelId);

  await updateChannelDescription(channel, "");
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
