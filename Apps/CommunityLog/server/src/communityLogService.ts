import {
  Client,
  rootServer,
  RootServerException,
  RootApiException,
  CommunityAppLogType,
  CommunityAppLogCreateRequest,
} from "@rootsdk/server-app";

import { CommunityLogServiceBase } from "@CommunityLogStressTest/gen-server";
import { CreateCommunityLogMessageRequest, CreateCommunityLogMessageResponse, Severity } from "@CommunityLogStressTest/gen-shared";

export class CommunityLogService extends CommunityLogServiceBase {
  async create(request: CreateCommunityLogMessageRequest, client: Client): Promise<CreateCommunityLogMessageResponse> {
    await writeCommunityLog(request.message, toCommunityAppLogType(request.severity));

    return {};
  }
}

// Wraps the SDK call so that any RootApiException is surfaced to the
// calling client as a RootServerException rather than silently swallowed.
async function writeCommunityLog(message: string, severity: CommunityAppLogType): Promise<void> {
  const request: CommunityAppLogCreateRequest = { communityAppLogType: severity, message };

  try {
    await rootServer.dataStore.logs.community.create(request);
  } catch (error: unknown) {
    if (error instanceof RootApiException) {
      throw new RootServerException(1, "Failed to write community log: " + error.message);
    }
    throw error;
  }
}

// Maps the proto Severity enum to the SDK's CommunityAppLogType enum
function toCommunityAppLogType(severity: Severity): CommunityAppLogType {
  switch (severity) {
    case Severity.INFO : return CommunityAppLogType.Info;
    case Severity.WARN : return CommunityAppLogType.Warn;
    case Severity.ERROR: return CommunityAppLogType.Error;
    case Severity.FATAL: return CommunityAppLogType.Fatal;
    default: return CommunityAppLogType.Info;
  }
}

export const communityLogService = new CommunityLogService();
