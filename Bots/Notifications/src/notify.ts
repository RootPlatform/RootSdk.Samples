import {
  rootServer,
  RootApiException,
  MessageType,
  ChannelMessageEvent,
  ChannelMessageCreatedEvent,
  CommunityMember,
  CommunityMemberGetRequest,
  UserGuid,
} from "@rootsdk/server-bot";

// The platform rejects the whole request if either field is too long,
// so trim before sending rather than after failing.
const TITLE_MAX_LENGTH: number = 50;
const DESCRIPTION_MAX_LENGTH: number = 150;

const COMMAND: string = "/notifyme ";

export function initializeNotify(): void {
  rootServer.community.channelMessages.on(
    ChannelMessageEvent.ChannelMessageCreated,
    onMessage
  );
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  try {
    if (evt.messageType === MessageType.System) return;

    if (!evt.messageContent?.startsWith(COMMAND)) return;

    const text: string = evt.messageContent.substring(COMMAND.length).trim();

    if (text.length === 0) return;

    const nickname: string = await getMemberNickname(evt.userId);

    await sendNotification(`Reminder for ${nickname}`, text, [evt.userId]);
  } catch (xcpt: unknown) {
    logError(xcpt);
  }
}

/**
 * Sends a notification, and never lets a notification failure break the
 * action that triggered it. Notifications are best effort.
 */
async function sendNotification(
  title: string,
  description: string,
  userIds: UserGuid[]
): Promise<void> {
  // Resolving to nobody is not an error: send() returns without sending
  // anything and raises nothing. Log the count so a notification that
  // reached no one is visible rather than silent.
  if (userIds.length === 0) {
    console.log("Notify: no recipients resolved, nothing sent");
    return;
  }

  console.log(`Notify: sending to ${userIds.length} recipient(s)`);

  try {
    await rootServer.community.notifications.send({
      title: truncate(title, TITLE_MAX_LENGTH),
      description: truncate(description, DESCRIPTION_MAX_LENGTH),
      userIds: userIds,
    });
  } catch (xcpt: unknown) {
    logError(xcpt);
  }
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;

  return value.substring(0, maxLength - 1) + "…";
}

async function getMemberNickname(userId: UserGuid): Promise<string> {
  const request: CommunityMemberGetRequest = { userId: userId };

  const user: CommunityMember = await rootServer.community.communityMembers.get(
    request
  );

  return user.nickname;
}

function logError(xcpt: unknown): void {
  if (xcpt instanceof RootApiException) {
    console.error("RootApiException:", xcpt.errorCode);
  } else if (xcpt instanceof Error) {
    console.error("Unexpected error:", xcpt.message);
  } else {
    console.error("Unknown error:", xcpt);
  }
}
