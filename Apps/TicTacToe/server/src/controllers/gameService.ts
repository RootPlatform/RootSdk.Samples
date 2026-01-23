import { Client, RootServerException, rootServer } from "@rootsdk/server-app";
import { GameServiceBase } from "@tictactoe/gen-server";
import { TicTacToeError } from "@tictactoe/shared";
import { gameManager, GameStatus } from "../lib/gameManager";
import { gameClientTracker } from "../lib/gameClients";
import { playerStatsRepository } from "../repositories/playerStatsRepository";
import { GameMapper } from "../utilities";
import {
  CreateAIGameRequest,
  CreateAIGameResponse,
  MakeMoveRequest,
  MakeMoveResponse,
  GetGameRequest,
  GetGameResponse,
  ForfeitRequest,
  ForfeitResponse,
  RequestRematchRequest,
  RequestRematchResponse,
  GameUpdatedEvent,
  GameEndedEvent,
} from "@tictactoe/gen-shared";

async function getNickname(client: Client): Promise<string> {
  try {
    const member = await rootServer.community.communityMembers.get({ userId: client.userId });
    return member.nickname || client.userId.toString();
  } catch {
    return client.userId.toString();
  }
}

export class GameService extends GameServiceBase {
  async createAIGame(request: CreateAIGameRequest, client: Client): Promise<CreateAIGameResponse> {
    const nickname: string = await getNickname(client);
    const stats = await playerStatsRepository.getOrCreate(client.userId, nickname);

    // Update display name if it changed
    if (stats.display_name !== nickname) {
      await playerStatsRepository.updateDisplayName(client.userId, nickname);
    }

    const game = gameManager.createAIGame(client.userId, nickname);

    // Register player for scoped broadcasts
    gameClientTracker.addPlayer(game.gameId, client);

    return {
      game: GameMapper.toProto(game),
    };
  }

  async makeMove(request: MakeMoveRequest, client: Client): Promise<MakeMoveResponse> {
    const result = await gameManager.makeMove(request.gameId, client.userId, request.position);

    if (!result.success || !result.game) {
      return {
        game: result.game ? GameMapper.toProto(result.game) : undefined,
        success: false,
        errorMessage: result.error || "Unknown error",
      };
    }

    const protoGame = GameMapper.toProto(result.game);

    // Get clients for this game only (excluding the triggering client)
    const gameClients = gameClientTracker
      .getGameClients(request.gameId)
      .filter((c) => c.userId !== client.userId);

    // Broadcast update to game participants only
    const event: GameUpdatedEvent = { game: protoGame };
    if (gameClients.length > 0) {
      this.broadcastGameUpdated(event, gameClients);
    }

    // If game ended, broadcast end event and cleanup
    if (result.game.status > GameStatus.IN_PROGRESS) {
      const endEvent: GameEndedEvent = { game: protoGame };
      if (gameClients.length > 0) {
        this.broadcastGameEnded(endEvent, gameClients);
      }
      gameClientTracker.cleanupGame(request.gameId);
    }

    return {
      game: protoGame,
      success: true,
      errorMessage: "",
    };
  }

  async getGame(request: GetGameRequest, client: Client): Promise<GetGameResponse> {
    const game = gameManager.getGame(request.gameId);

    if (!game) {
      throw new RootServerException(TicTacToeError.NOT_FOUND, "Game not found");
    }

    return {
      game: GameMapper.toProto(game),
    };
  }

  async forfeit(request: ForfeitRequest, client: Client): Promise<ForfeitResponse> {
    const game = await gameManager.forfeit(request.gameId, client.userId);

    if (!game) {
      throw new RootServerException(TicTacToeError.NOT_FOUND, "Game not found");
    }

    const protoGame = GameMapper.toProto(game);

    // Get clients for this game only (excluding the forfeiting client)
    const gameClients = gameClientTracker
      .getGameClients(request.gameId)
      .filter((c) => c.userId !== client.userId);

    // Broadcast game ended to game participants only
    const endEvent: GameEndedEvent = { game: protoGame };
    if (gameClients.length > 0) {
      this.broadcastGameEnded(endEvent, gameClients);
    }
    gameClientTracker.cleanupGame(request.gameId);

    return {
      game: protoGame,
    };
  }

  async requestRematch(request: RequestRematchRequest, client: Client): Promise<RequestRematchResponse> {
    const oldGame = gameManager.getGame(request.gameId);

    if (!oldGame) {
      return { success: false };
    }

    // Only allow rematch for finished games
    if (oldGame.status <= GameStatus.IN_PROGRESS) {
      return { success: false };
    }

    // Create new game with swapped positions
    if (oldGame.isAiGame) {
      const nickname: string = await getNickname(client);
      await playerStatsRepository.getOrCreate(client.userId, nickname);
      const newGame = gameManager.createAIGame(client.userId, nickname);

      // Register player for scoped broadcasts
      gameClientTracker.addPlayer(newGame.gameId, client);

      return {
        newGame: GameMapper.toProto(newGame),
        success: true,
      };
    }

    // For PvP, would need both players to agree - simplified for now
    return { success: false };
  }
}

export const gameService = new GameService();
