import {
  rootServer,
  RootApiException,
  ErrorCodeType,
  RootGuidUtils,
  RootGuidType,
  Community,
  CommunityMember,
  CommunityEvent,
  CommunityJoinedEvent,
  CommunityMemberGetRequest,
  ChannelMessageCreateRequest,
} from "@rootsdk/server-bot";

export function initializeWelcome(): void {
  rootServer.community.communities.on(CommunityEvent.CommunityJoined, onJoined);
}

async function onJoined(evt: CommunityJoinedEvent): Promise<void> {
  try {
    // Only welcome human members, not bots or apps
    if (RootGuidUtils.toRootGuidType(evt.userId) !== RootGuidType.Person)
      return;

    const community: Community = await rootServer.community.communities.get();

    // The system-message channel must be configured by a community admin
    if (!community.defaultChannelId)
      return;

    const memberRequest: CommunityMemberGetRequest = { userId: evt.userId };
    const member: CommunityMember = await rootServer.community.communityMembers.get(memberRequest);

    const messageRequest: ChannelMessageCreateRequest = {
      channelId: community.defaultChannelId,
      content: member.nickname + " joined",
    };
    await rootServer.community.channelMessages.create(messageRequest);
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