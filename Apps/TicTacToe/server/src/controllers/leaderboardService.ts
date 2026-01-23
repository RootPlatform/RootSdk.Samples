import { Client } from "@rootsdk/server-app";
import { LeaderboardServiceBase } from "@tictactoe/gen-server";
import { playerStatsRepository } from "../repositories/playerStatsRepository";
import { PlayerStatsMapper } from "../utilities";
import {
  GetLeaderboardRequest,
  GetLeaderboardResponse,
  GetPlayerStatsRequest,
  GetPlayerStatsResponse,
} from "@tictactoe/gen-shared";

export class LeaderboardService extends LeaderboardServiceBase {
  async getLeaderboard(request: GetLeaderboardRequest, client: Client): Promise<GetLeaderboardResponse> {
    const limit = request.limit || 20;
    const offset = request.offset || 0;

    const players = await playerStatsRepository.getLeaderboard(limit, offset);
    const totalCount = await playerStatsRepository.getTotalCount();

    return {
      players: players.map((p) => PlayerStatsMapper.toProto(p)),
      totalCount,
    };
  }

  async getPlayerStats(request: GetPlayerStatsRequest, client: Client): Promise<GetPlayerStatsResponse> {
    const userId = request.userId || client.userId;

    let stats = await playerStatsRepository.getByUserId(userId);

    // If no stats exist and requesting own stats, create them
    if (!stats && userId === client.userId) {
      stats = await playerStatsRepository.getOrCreate(userId, userId);
    }

    if (!stats) {
      return {
        stats: undefined,
        rank: 0,
      };
    }

    const rank = await playerStatsRepository.getRank(userId);

    return {
      stats: PlayerStatsMapper.toProto(stats),
      rank,
    };
  }
}

export const leaderboardService = new LeaderboardService();
