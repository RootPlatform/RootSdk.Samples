import { rootClient } from "@rootsdk/client-app";
import {
  gameServiceClient,
  GameServiceClientEvent,
  matchmakingServiceClient,
  MatchmakingServiceClientEvent,
  spectatorServiceClient,
  SpectatorServiceClientEvent,
  leaderboardServiceClient,
} from "@tictactoe/gen-client";

// Re-export service clients and event types
export {
  gameServiceClient,
  GameServiceClientEvent,
  matchmakingServiceClient,
  MatchmakingServiceClientEvent,
  spectatorServiceClient,
  SpectatorServiceClientEvent,
  leaderboardServiceClient,
};

// Re-export rootClient for user info
export { rootClient };

// Helper to get current user ID
export function getCurrentUserId(): string {
  return rootClient.users.getCurrentUserId() || "anonymous";
}
