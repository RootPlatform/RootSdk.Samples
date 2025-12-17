import {
  Client,
  rootServer,
  RootApiException,
  CommunityAppLogType,
  CommunityAppLogCreateRequest,
  CommunityAppLogCreateResponse
} from "@rootsdk/server-app";

import { CommunityLogServiceBase } from "@CommunityLogStressTest/gen-server";
import { CreateCommunityLogMessageRequest, CreateCommunityLogMessageResponse, Severity } from "@CommunityLogStressTest/gen-shared";

export class CommunityLogService extends CommunityLogServiceBase {
  async create(request: CreateCommunityLogMessageRequest, client: Client): Promise<CreateCommunityLogMessageResponse> {

    await writeCommunityLog(request.message, toCommunityAppLogType(request.severity));

    const response: CreateCommunityLogMessageResponse = { };

    return response;
  }
}

/**
 * Writes a single log entry to the community log.
 * @param message The message text to log
 * @param severity The severity level of the message
 */
async function writeCommunityLog(message: string, severity: CommunityAppLogType): Promise<void> {
  const request: CommunityAppLogCreateRequest = { communityAppLogType: severity, message };

  console.log("Writing log:", request.communityAppLogType, request.message);

  try {
    const response: CommunityAppLogCreateResponse = await rootServer.dataStore.logs.community.create(request);
  } catch (error: unknown) {
    if (error instanceof RootApiException) {
      console.error("Root API exception:", error.errorCode, error.message);
    } else {
      console.error("Unexpected error writing to community log:", error);
    }
  }
}

/**
 * Converts a Severity value to a CommunityAppLogType.
 * @param severity The Severity enum value
 * @returns The corresponding CommunityAppLogType
 */
export function toCommunityAppLogType(severity: Severity): CommunityAppLogType {
  switch (severity) {
    case Severity.INFO : return CommunityAppLogType.Info;
    case Severity.WARN : return CommunityAppLogType.Warn;
    case Severity.ERROR: return CommunityAppLogType.Error;
    case Severity.FATAL: return CommunityAppLogType.Fatal;
    default: return CommunityAppLogType.Info;
  }
}

export const communityLogService = new CommunityLogService();
