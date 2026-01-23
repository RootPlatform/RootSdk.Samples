import { Client } from "@rootsdk/server-app";
import { SpectatorServiceBase } from "@tictactoe/gen-server";
import { gameManager } from "../lib/gameManager";
import { gameClientTracker } from "../lib/gameClients";
import { GameMapper } from "../utilities";
import {
  ListActiveGamesRequest,
  ListActiveGamesResponse,
  ActiveGameSummary,
  WatchGameRequest,
  WatchGameResponse,
  StopWatchingRequest,
  StopWatchingResponse,
  SpectatorGameUpdateEvent,
} from "@tictactoe/gen-shared";

export class SpectatorService extends SpectatorServiceBase {
  async listActiveGames(request: ListActiveGamesRequest, client: Client): Promise<ListActiveGamesResponse> {
    const activeGames = gameManager.getActiveGames();

    const gameSummaries: ActiveGameSummary[] = activeGames.map((game) => ({
      gameId: game.gameId,
      playerXName: game.playerX.displayName,
      playerOName: game.playerO?.displayName || "",
      moveCount: game.moves.length,
      status: GameMapper.statusToProto(game.status),
    }));

    return {
      games: gameSummaries,
    };
  }

  async watchGame(request: WatchGameRequest, client: Client): Promise<WatchGameResponse> {
    const game = gameManager.getGame(request.gameId);

    if (!game) {
      return {
        success: false,
      };
    }

    // Add spectator to game manager and client tracker
    gameManager.addSpectator(request.gameId, client.userId);
    gameClientTracker.addSpectator(request.gameId, client);

    return {
      game: GameMapper.toProto(game),
      success: true,
    };
  }

  async stopWatching(request: StopWatchingRequest, client: Client): Promise<StopWatchingResponse> {
    gameManager.removeSpectator(request.gameId, client.userId);
    gameClientTracker.removeClient(client.userId);

    return {
      success: true,
    };
  }

  // Helper method to broadcast updates to spectators
  public broadcastToSpectators(gameId: string, triggeringClient: Client): void {
    const game = gameManager.getGame(gameId);
    if (!game) return;

    const event: SpectatorGameUpdateEvent = {
      game: GameMapper.toProto(game),
    };

    // Broadcast to game participants (excluding the triggering client)
    const gameClients = gameClientTracker
      .getGameClients(gameId)
      .filter((c) => c.userId !== triggeringClient.userId);

    if (gameClients.length > 0) {
      this.broadcastSpectatorGameUpdate(event, gameClients);
    }
  }
}

export const spectatorService = new SpectatorService();
