import {
  rootServer,
  RootApiException,
  ErrorCodeType,
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
      switch (xcpt.errorCode) {
        case ErrorCodeType.NoPermissionToCreate:
          console.error("Missing createMessage permission in root-manifest.json");
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

async function getNickname(userId: UserGuid): Promise<string> {
  const request: CommunityMemberGetRequest = { userId: userId };

  const user: CommunityMember = await rootServer.community.communityMembers.get(request);

  return user.nickname;
}
