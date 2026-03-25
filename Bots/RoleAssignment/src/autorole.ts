import {
  rootServer,
  RootApiException,
  ErrorCodeType,
  RootBotStartState,
  MessageType,
  ChannelMessageEvent,
  ChannelMessageCreatedEvent,
  CommunityMemberRoleAddRequest,
  CommunityRoleGuid,
  UserGuid,
} from "@rootsdk/server-bot";

// Resolved once at startup from the start state snapshot
let participantRoleId: CommunityRoleGuid | undefined;

export function initializeAutorole(state: RootBotStartState): void {
  // Resolve the role at startup from the start state snapshot instead of
  // making an API call every time a member hits the message threshold.
  const roleName = "Participant";
  for (const [roleId, role] of state.communityRoles) {
    if (role.name === roleName) {
      participantRoleId = roleId;
      break;
    }
  }

  if (!participantRoleId) {
    console.error(`Role "${roleName}" not found — auto-role assignment will be disabled`);
  }

  rootServer.community.channelMessages.on(ChannelMessageEvent.ChannelMessageCreated, onMessage);
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  try {
    if (evt.messageType === MessageType.System)
      return;

    if (!participantRoleId)
      return;

    const count: number = await rootServer.dataStore.appData.update(
      evt.userId,
      (val: number) => val + 1,
      0
    );

    // Assign the role once after the member posts their 5th message
    if (count === 5) {
      await assignRole(evt.userId, participantRoleId);
    }
  } catch (xcpt: unknown) {
    if (xcpt instanceof RootApiException) {
      switch (xcpt.errorCode) {
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

async function assignRole(userId: UserGuid, roleId: CommunityRoleGuid): Promise<void> {
  const request: CommunityMemberRoleAddRequest = {
    communityRoleId: roleId,
    userIds: [userId],
  };

  await rootServer.community.communityMemberRoles.add(request);
}
