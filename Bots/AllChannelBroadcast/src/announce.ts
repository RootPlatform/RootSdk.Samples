import {
  rootServer,
  RootApiException,
  MessageType,
  ChannelMessageEvent,
  ChannelMessageCreatedEvent,
  ChannelMessageCreateRequest,
  CommunityMember,
  CommunityMemberGetRequest,
  UserGuid,
  Channel,
  ChannelGuid,
  ChannelType,
  ChannelGroup,
  ChannelListRequest,
} from "@rootsdk/server-bot";

export function initializeAnnounce(): void {
  rootServer.community.channelMessages.on(ChannelMessageEvent.ChannelMessageCreated, onMessage);
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  try {
    if (evt.messageType === MessageType.System) return;

    const command: string = "/announce ";

    if (!evt.messageContent?.startsWith(command)) return;

    const nickname: string = await getMemberNickname(evt.userId);
    const mention = "[@" + nickname + "](root://user/" + evt.userId + ")";
    const announcement: string =
      "(Announce) " +
      mention +
      " said " +
      evt.messageContent?.substring(command.length).trim();

    const channelGuids: ChannelGuid[] = await getChannelGuids(ChannelType.Text);

    await sendMessage(announcement, channelGuids);
  } catch (xcpt: unknown) {
    if (xcpt instanceof RootApiException) {
      console.error("RootApiException:", xcpt.errorCode);
    } else if (xcpt instanceof Error) {
      console.error("Unexpected error:", xcpt.message);
    } else {
      console.error("Unknown error:", xcpt);
    }
  }
}

async function getChannelGuids(type: ChannelType): Promise<ChannelGuid[]> {
  const channelIds: ChannelGuid[] = [];

  const channelGroups: ChannelGroup[] =
    await rootServer.community.channelGroups.list();

  for (const channelGroup of channelGroups) {
    const request: ChannelListRequest = { channelGroupId: channelGroup.id };

    const channels: Channel[] = await rootServer.community.channels.list(
      request
    );

    for (const channel of channels) {
      if (channel.channelType === type) channelIds.push(channel.id);
    }
  }

  return channelIds;
}

async function sendMessage(
  reply: string,
  channels: ChannelGuid[]
): Promise<void> {
  for (const channelGuid of channels) {
    const request: ChannelMessageCreateRequest = {
      channelId: channelGuid,
      content: reply,
    };

    await rootServer.community.channelMessages.create(request);
  }
}

async function getMemberNickname(userId: UserGuid): Promise<string> {
  const request: CommunityMemberGetRequest = { userId: userId };

  const user: CommunityMember = await rootServer.community.communityMembers.get(
    request
  );

  return user.nickname;
}
