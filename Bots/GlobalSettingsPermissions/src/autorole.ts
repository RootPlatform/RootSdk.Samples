import {
  rootServer,
  RootApiException,
  MessageType,
  ChannelMessageEvent,
  ChannelMessageCreatedEvent,
  CommunityMemberRoleAddRequest,
  CommunityRole,
  CommunityRoleGuid,
  UserGuid,
} from "@rootsdk/server-bot";

// Subscribe to be notified of new messages (in all channels)
export function initializeAutorole(): void {
  rootServer.community.channelMessages.on(ChannelMessageEvent.ChannelMessageCreated, onMessage);
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  try {
    if (evt.messageType === MessageType.System)
      return;

    // Increment the persisted number of messages sent by this user
    const count: number = await rootServer.dataStore.appData.update(
      evt.userId,
      (val: number) => val + 1,
      0
    );

    // After posting 5 messages, the user is given a new role
    if (count == 5) {
      const roleId: CommunityRoleGuid = await getRoleId();

      await assignRole(evt.userId, roleId);
    }
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

// Get the roleId for the hardcoded "Participant" role
async function getRoleId(): Promise<CommunityRoleGuid> {
  const name: string = "Participant";

  const roles: CommunityRole[] =
    await rootServer.community.communityRoles.list();

  const targetRole = roles.find((role) => role.name === name);

  if (!targetRole) {
    throw new Error(`Role "${name}" not found`);
  }

  return targetRole.id;
}

// Assign the role indicated by 'roleId' to the specified user
async function assignRole(userId: UserGuid, roleId: CommunityRoleGuid): Promise<void> {
  const request: CommunityMemberRoleAddRequest = {
    communityRoleId: roleId,
    userIds: [userId],
  };

  await rootServer.community.communityMemberRoles.add(request);
}
