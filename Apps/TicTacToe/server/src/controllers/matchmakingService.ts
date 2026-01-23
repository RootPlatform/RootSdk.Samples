import { Client, rootServer } from "@rootsdk/server-app";
import { MatchmakingServiceBase } from "@tictactoe/gen-server";
import { matchmakingQueue } from "../lib/matchmaking";
import { gameClientTracker } from "../lib/gameClients";
import { playerStatsRepository } from "../repositories/playerStatsRepository";
import { GameMapper } from "../utilities";
import {
  JoinQueueRequest,
  JoinQueueResponse,
  LeaveQueueRequest,
  LeaveQueueResponse,
  GetQueueStatusRequest,
  GetQueueStatusResponse,
  MatchFoundEvent,
  QueueUpdatedEvent,
} from "@tictactoe/gen-shared";
import { GameState } from "../lib/gameManager";

async function getNickname(client: Client): Promise<string> {
  try {
    const member = await rootServer.community.communityMembers.get({ userId: client.userId });
    return member.nickname || client.userId.toString();
  } catch {
    return client.userId.toString();
  }
}

// Store client references for broadcasting
const clientsByUserId: Map<string, Client> = new Map();

export class MatchmakingService extends MatchmakingServiceBase {
  constructor() {
    super();

    // Set up matchmaking callbacks
    matchmakingQueue.setMatchFoundCallback((game: GameState, playerIds: string[]) => {
      this.handleMatchFound(game, playerIds);
    });

    matchmakingQueue.setQueueUpdatedCallback((userId: string, position: number, total: number) => {
      this.handleQueueUpdated(userId, position, total);
    });

    // Start matchmaking loop
    matchmakingQueue.start();
  }

  private handleMatchFound(game: GameState, playerIds: string[]): void {
    const event: MatchFoundEvent = {
      game: GameMapper.toProto(game),
    };

    // Register players with game tracker and broadcast match found
    for (const playerId of playerIds) {
      const client = clientsByUserId.get(playerId);
      if (client) {
        // Register player for scoped game broadcasts
        gameClientTracker.addPlayer(game.gameId, client);
        // Send directly to this specific client
        this.broadcastMatchFound(event, [client]);
        // Remove from matchmaking tracking after match found
        clientsByUserId.delete(playerId);
      }
    }
  }

  private handleQueueUpdated(userId: string, position: number, total: number): void {
    const event: QueueUpdatedEvent = {
      position,
      totalInQueue: total,
    };

    const client = clientsByUserId.get(userId);
    if (client) {
      this.broadcastQueueUpdated(event, [client]);
    }
  }

  async joinQueue(request: JoinQueueRequest, client: Client): Promise<JoinQueueResponse> {
    // Track this client for broadcasting
    clientsByUserId.set(client.userId, client);

    const nickname: string = await getNickname(client);
    const stats = await playerStatsRepository.getOrCreate(client.userId, nickname);

    // Update display name if it changed
    if (stats.display_name !== nickname) {
      await playerStatsRepository.updateDisplayName(client.userId, nickname);
    }

    const result = await matchmakingQueue.joinQueue(client.userId, nickname);

    // If a match was found immediately, register player and return the game
    if (result.game) {
      gameClientTracker.addPlayer(result.game.gameId, client);
      // Remove from matchmaking tracking
      clientsByUserId.delete(client.userId);
      return {
        success: result.success,
        position: 0,
        errorMessage: "",
        game: GameMapper.toProto(result.game),
      };
    }

    return {
      success: result.success,
      position: result.position,
      errorMessage: result.error || "",
    };
  }

  async leaveQueue(request: LeaveQueueRequest, client: Client): Promise<LeaveQueueResponse> {
    const success = matchmakingQueue.leaveQueue(client.userId);

    // Remove from tracking
    clientsByUserId.delete(client.userId);

    return {
      success,
    };
  }

  async getQueueStatus(request: GetQueueStatusRequest, client: Client): Promise<GetQueueStatusResponse> {
    const status = matchmakingQueue.getQueueStatus(client.userId);

    return {
      inQueue: status.inQueue,
      position: status.position,
      totalInQueue: status.total,
    };
  }
}

export const matchmakingService = new MatchmakingService();
