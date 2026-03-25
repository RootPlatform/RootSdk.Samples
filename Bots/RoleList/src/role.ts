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
  CommunityRole,
  CommunityRoleGuid,
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

async function getMemberRoleNames(user: CommunityMember): Promise<string[]> {
  const roleIds: CommunityRoleGuid[] = user.communityRoleIds ?? [];

  // Fetch all roles once instead of one API call per role
  const roles: CommunityRole[] =
    await rootServer.community.communityRoles.list();

  return roleIds
    .map((id) => roles.find((r) => r.id === id)?.name)
    .filter((name): name is string => !!name);
}

async function getCommunityRoleNames(): Promise<string[]> {
  const roles: CommunityRole[] =
    await rootServer.community.communityRoles.list();

  return roles?.map((role) => role.name) ?? [];
}
