import {
  rootServer,
  RootApiException,
  MessageType,
  ChannelMessage,
  ChannelMessageEvent,
  ChannelMessageCreatedEvent,
  ChannelMessageCreateRequest,
  CommunityMember,
  CommunityMemberGetRequest,
  CommunityRole,
  CommunityRoleGuid,
  CommunityRoleGetRequest,
  UserGuid,
} from "@rootsdk/server-bot";

export function initializeRole(): void {
  rootServer.community.channelMessages.on(ChannelMessageEvent.ChannelMessageCreated, onMessage);
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  try {
    if (evt.messageType === MessageType.System) return;

    const { botName, target } = parseInput(evt.messageContent);

    if (botName !== "/role") return;

    let reply: string = "(RoleBot) Unknown command";

    switch (target) {
      case "me":
        const member: CommunityMember = await getMember(evt.userId);
        reply =
          "(RoleBot) " +
          member.nickname +
          " has roles: " +
          (await getMemberRoleNames(member)).join(" ");
        break;

      case "community":
        reply =
          "(RoleBot) the community has roles: " +
          (await getCommunityRoleNames()).join(" ");
        break;
    }

    const request: ChannelMessageCreateRequest = {
      channelId: evt.channelId,
      content: reply,
    };

    const cm: ChannelMessage =
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

function parseInput(input: string): { botName: string; target: string } {
  const match = input.match(/^(\S*)\s*(.*)$/);

  if (!match) {
    return { botName: "", target: "" };
  }

  const [, botName, target] = match;

  return { botName, target };
}

async function getMember(userId: UserGuid): Promise<CommunityMember> {
  const request: CommunityMemberGetRequest = { userId: userId };

  const user: CommunityMember = await rootServer.community.communityMembers.get(
    request
  );

  return user;
}

async function getRoleName(roleId: CommunityRoleGuid): Promise<string> {
  const request: CommunityRoleGetRequest = { id: roleId };

  const role: CommunityRole = await rootServer.community.communityRoles.get(
    request
  );

  return role.name;
}

async function getMemberRoleNames(user: CommunityMember): Promise<string[]> {
  const roleIds: CommunityRoleGuid[] = user.communityRoleIds ?? [];

  const roleNames: string[] = await Promise.all(roleIds.map(getRoleName));

  return roleNames;
}

async function getCommunityRoleNames(): Promise<string[]> {
  const roles: CommunityRole[] =
    await rootServer.community.communityRoles.list();

  return roles?.map((role) => role.name) ?? [];
}
