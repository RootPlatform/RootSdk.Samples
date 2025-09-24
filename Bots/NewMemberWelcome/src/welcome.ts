import {
  rootServer,
  Community,
  CommunityMember,
  CommunityEvent,
  CommunityJoinedEvent,
  CommunityMemberGetRequest,
  ChannelMessageCreateRequest,
} from "@rootsdk/server-bot";

// Subscribe to be notified when new members join the community
export function initializeWelcome(): void {
  rootServer.community.communities.on(CommunityEvent.CommunityJoined, onJoined);
}

async function onJoined(evt: CommunityJoinedEvent): Promise<void> {
  // Retrieve information about the current community
  const community: Community = await rootServer.community.communities.get();

  // Verify the community has set a system-message channel (called default channel in code)	
  if (!community.defaultChannelId)
    return;

  // Get the nickname of the new member
  const memberRequest: CommunityMemberGetRequest = { userId: evt.userId };
  const member: CommunityMember = await rootServer.community.communityMembers.get(memberRequest);
  const nickname: string = member.nickname;

  // Write a message to the community's system-message channel
  const messageRequest: ChannelMessageCreateRequest = { channelId: community.defaultChannelId, content: nickname + " joined"};
  await rootServer.community.channelMessages.create(messageRequest);
}