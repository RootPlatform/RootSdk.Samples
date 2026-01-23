import { Timestamp } from "@tictactoe/gen-shared";
import { GameState, GameStatus, Player, Move } from "./lib/gameManager";
import { PlayerStatsModel } from "./repositories/playerStatsRepository";
import {
  Game,
  CellState,
  GameStatus as ProtoGameStatus,
  Player as ProtoPlayer,
  Move as ProtoMove,
  PlayerStats,
} from "@tictactoe/gen-shared";

export class GameMapper {
  static toProto(game: GameState): Game {
    return {
      gameId: game.gameId,
      playerX: this.playerToProto(game.playerX),
      playerO: game.playerO ? this.playerToProto(game.playerO) : undefined,
      board: game.board.map((cell) => cell as CellState),
      currentTurn: game.currentTurn as CellState,
      status: this.statusToProto(game.status),
      moves: game.moves.map((move) => this.moveToProto(move)),
      winnerId: game.winnerId || "",
      winningLine: game.winningLine || [],
      isAiGame: game.isAiGame,
      createdAt: Timestamp.fromDate(game.createdAt),
    };
  }

  static playerToProto(player: Player): ProtoPlayer {
    return {
      userId: player.userId,
      displayName: player.displayName,
      marker: player.marker as CellState,
    };
  }

  static moveToProto(move: Move): ProtoMove {
    return {
      playerId: move.playerId,
      position: move.position,
      timestamp: Timestamp.fromDate(move.timestamp),
    };
  }

  static statusToProto(status: GameStatus): ProtoGameStatus {
    switch (status) {
      case GameStatus.WAITING:
        return ProtoGameStatus.WAITING;
      case GameStatus.IN_PROGRESS:
        return ProtoGameStatus.IN_PROGRESS;
      case GameStatus.X_WINS:
        return ProtoGameStatus.X_WINS;
      case GameStatus.O_WINS:
        return ProtoGameStatus.O_WINS;
      case GameStatus.DRAW:
        return ProtoGameStatus.DRAW;
      case GameStatus.ABANDONED:
        return ProtoGameStatus.ABANDONED;
      default:
        return ProtoGameStatus.WAITING;
    }
  }
}

export class PlayerStatsMapper {
  static toProto(stats: PlayerStatsModel): PlayerStats {
    return {
      userId: stats.user_id,
      displayName: stats.display_name,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      totalGames: stats.wins + stats.losses + stats.draws,
      createdAt: Timestamp.fromDate(new Date(stats.created_at)),
      updatedAt: Timestamp.fromDate(new Date(stats.updated_at)),
    };
  }
}
