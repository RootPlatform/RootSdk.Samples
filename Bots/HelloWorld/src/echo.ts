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
} from "@rootsdk/server-bot";

export function initializeEcho(): void {
  rootServer.community.channelMessages.on(ChannelMessageEvent.ChannelMessageCreated, onMessage);
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  try {
    if (evt.messageType === MessageType.System)
      return;

    const prefix: string = "/echo ";

    if (!evt.messageContent?.startsWith(prefix))
      return;

    const nickname: string = await getNickname(evt.userId);

    const reply: string =
      "(EchoBot) " +
      nickname +
      " said " +
      evt.messageContent?.substring(prefix.length).trim();

    const request: ChannelMessageCreateRequest = {
      channelId: evt.channelId,
      content: reply,
    };

    await rootServer.community.channelMessages.create(request);
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

async function getNickname(userId: UserGuid): Promise<string> {
  const request: CommunityMemberGetRequest = { userId: userId };

  const user: CommunityMember = await rootServer.community.communityMembers.get(request);

  return user.nickname;
}
