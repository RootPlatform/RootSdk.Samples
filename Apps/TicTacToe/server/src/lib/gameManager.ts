import { v4 as uuidv4 } from "uuid";
import { getAIMove, CellState } from "./aiPlayer";
import { playerStatsRepository, matchHistoryRepository } from "../repositories/playerStatsRepository";

export interface Player {
  userId: string;
  displayName: string;
  marker: CellState;
}

export interface Move {
  playerId: string;
  position: number;
  timestamp: Date;
}

export enum GameStatus {
  WAITING = 0,
  IN_PROGRESS = 1,
  X_WINS = 2,
  O_WINS = 3,
  DRAW = 4,
  ABANDONED = 5,
}

export interface GameState {
  gameId: string;
  playerX: Player;
  playerO: Player | null;
  board: CellState[];
  currentTurn: CellState;
  status: GameStatus;
  moves: Move[];
  winnerId: string | null;
  winningLine: number[] | null;
  isAiGame: boolean;
  createdAt: Date;
  spectators: Set<string>;
}

const WIN_PATTERNS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Anti-diagonal
];

const AI_USER_ID = "ai-player";
const AI_DISPLAY_NAME = "Computer";

class GameManager {
  private games: Map<string, GameState> = new Map();
  private playerGames: Map<string, string> = new Map(); // userId -> gameId

  public createAIGame(userId: string, displayName: string): GameState {
    // Check if player is already in a game
    const existingGameId = this.playerGames.get(userId);
    if (existingGameId) {
      const existingGame = this.games.get(existingGameId);
      if (existingGame && existingGame.status <= GameStatus.IN_PROGRESS) {
        return existingGame;
      }
    }

    const gameId = uuidv4();
    const game: GameState = {
      gameId,
      playerX: {
        userId,
        displayName,
        marker: CellState.X,
      },
      playerO: {
        userId: AI_USER_ID,
        displayName: AI_DISPLAY_NAME,
        marker: CellState.O,
      },
      board: Array(9).fill(CellState.EMPTY),
      currentTurn: CellState.X,
      status: GameStatus.IN_PROGRESS,
      moves: [],
      winnerId: null,
      winningLine: null,
      isAiGame: true,
      createdAt: new Date(),
      spectators: new Set(),
    };

    this.games.set(gameId, game);
    this.playerGames.set(userId, gameId);

    return game;
  }

  public createPvPGame(playerXId: string, playerXName: string, playerOId: string, playerOName: string): GameState {
    const gameId = uuidv4();
    const game: GameState = {
      gameId,
      playerX: {
        userId: playerXId,
        displayName: playerXName,
        marker: CellState.X,
      },
      playerO: {
        userId: playerOId,
        displayName: playerOName,
        marker: CellState.O,
      },
      board: Array(9).fill(CellState.EMPTY),
      currentTurn: CellState.X,
      status: GameStatus.IN_PROGRESS,
      moves: [],
      winnerId: null,
      winningLine: null,
      isAiGame: false,
      createdAt: new Date(),
      spectators: new Set(),
    };

    this.games.set(gameId, game);
    this.playerGames.set(playerXId, gameId);
    this.playerGames.set(playerOId, gameId);

    return game;
  }

  public getGame(gameId: string): GameState | null {
    return this.games.get(gameId) || null;
  }

  public getPlayerCurrentGame(userId: string): GameState | null {
    const gameId = this.playerGames.get(userId);
    if (!gameId) return null;

    const game = this.games.get(gameId);
    if (!game) return null;

    // Only return active games
    if (game.status <= GameStatus.IN_PROGRESS) {
      return game;
    }

    return null;
  }

  public async makeMove(
    gameId: string,
    userId: string,
    position: number
  ): Promise<{ success: boolean; game: GameState | null; error?: string }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, game: null, error: "Game not found" };
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      return { success: false, game, error: "Game is already over" };
    }

    // Validate it's the player's turn
    const isPlayerX = game.playerX.userId === userId;
    const isPlayerO = game.playerO?.userId === userId;

    if (!isPlayerX && !isPlayerO) {
      return { success: false, game, error: "You are not a player in this game" };
    }

    const playerMarker = isPlayerX ? CellState.X : CellState.O;
    if (game.currentTurn !== playerMarker) {
      return { success: false, game, error: "Not your turn" };
    }

    // Validate position
    if (position < 0 || position > 8) {
      return { success: false, game, error: "Invalid position" };
    }

    if (game.board[position] !== CellState.EMPTY) {
      return { success: false, game, error: "Cell is already occupied" };
    }

    // Make the move
    game.board[position] = playerMarker;
    game.moves.push({
      playerId: userId,
      position,
      timestamp: new Date(),
    });

    // Check for winner
    const winResult = this.checkWinner(game.board);
    if (winResult) {
      game.status = playerMarker === CellState.X ? GameStatus.X_WINS : GameStatus.O_WINS;
      game.winnerId = userId;
      game.winningLine = winResult;
      await this.recordGameResult(game);
    } else if (game.board.every((cell) => cell !== CellState.EMPTY)) {
      // Draw
      game.status = GameStatus.DRAW;
      await this.recordGameResult(game);
    } else {
      // Switch turn
      game.currentTurn = game.currentTurn === CellState.X ? CellState.O : CellState.X;

      // If AI game and now AI's turn, make AI move
      if (game.isAiGame && game.currentTurn === CellState.O) {
        await this.makeAIMove(game);
      }
    }

    return { success: true, game };
  }

  private async makeAIMove(game: GameState): Promise<void> {
    const aiPosition = getAIMove(game.board, CellState.O);

    if (aiPosition === -1) return;

    game.board[aiPosition] = CellState.O;
    game.moves.push({
      playerId: AI_USER_ID,
      position: aiPosition,
      timestamp: new Date(),
    });

    // Check for winner
    const winResult = this.checkWinner(game.board);
    if (winResult) {
      game.status = GameStatus.O_WINS;
      game.winnerId = AI_USER_ID;
      game.winningLine = winResult;
      await this.recordGameResult(game);
    } else if (game.board.every((cell) => cell !== CellState.EMPTY)) {
      game.status = GameStatus.DRAW;
      await this.recordGameResult(game);
    } else {
      game.currentTurn = CellState.X;
    }
  }

  private checkWinner(board: CellState[]): number[] | null {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (board[a] !== CellState.EMPTY && board[a] === board[b] && board[b] === board[c]) {
        return pattern;
      }
    }
    return null;
  }

  private async recordGameResult(game: GameState): Promise<void> {
    // Record match history
    const movesForHistory = game.moves.map((m) => ({
      playerId: m.playerId,
      position: m.position,
    }));

    await matchHistoryRepository.create(
      game.playerX.userId,
      game.playerO?.userId || null,
      game.winnerId,
      game.isAiGame,
      movesForHistory
    );

    // Update player stats
    if (game.isAiGame) {
      // AI games: only update human player's stats
      if (game.status === GameStatus.X_WINS) {
        await playerStatsRepository.recordWin(game.playerX.userId);
      } else if (game.status === GameStatus.O_WINS) {
        await playerStatsRepository.recordLoss(game.playerX.userId);
      } else if (game.status === GameStatus.DRAW) {
        await playerStatsRepository.recordDraw(game.playerX.userId);
      }
    } else if (game.playerO) {
      // PvP games: update both players' stats
      if (game.status === GameStatus.X_WINS) {
        await playerStatsRepository.recordWin(game.playerX.userId);
        await playerStatsRepository.recordLoss(game.playerO.userId);
      } else if (game.status === GameStatus.O_WINS) {
        await playerStatsRepository.recordLoss(game.playerX.userId);
        await playerStatsRepository.recordWin(game.playerO.userId);
      } else if (game.status === GameStatus.DRAW) {
        await playerStatsRepository.recordDraw(game.playerX.userId);
        await playerStatsRepository.recordDraw(game.playerO.userId);
      }
    }

    // Clean up player-game mappings for finished games
    this.playerGames.delete(game.playerX.userId);
    if (game.playerO && game.playerO.userId !== AI_USER_ID) {
      this.playerGames.delete(game.playerO.userId);
    }
  }

  public async forfeit(gameId: string, userId: string): Promise<GameState | null> {
    const game = this.games.get(gameId);
    if (!game) return null;

    if (game.status !== GameStatus.IN_PROGRESS) return game;

    const isPlayerX = game.playerX.userId === userId;
    const isPlayerO = game.playerO?.userId === userId;

    if (!isPlayerX && !isPlayerO) return null;

    game.status = GameStatus.ABANDONED;
    game.winnerId = isPlayerX ? game.playerO?.userId || null : game.playerX.userId;

    await this.recordGameResult(game);

    return game;
  }

  public getActiveGames(): GameState[] {
    return Array.from(this.games.values()).filter(
      (game) => game.status === GameStatus.IN_PROGRESS && !game.isAiGame
    );
  }

  public addSpectator(gameId: string, userId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;
    game.spectators.add(userId);
    return true;
  }

  public removeSpectator(gameId: string, userId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;
    game.spectators.delete(userId);
    return true;
  }

  public getSpectators(gameId: string): string[] {
    const game = this.games.get(gameId);
    if (!game) return [];
    return Array.from(game.spectators);
  }
}

export const gameManager = new GameManager();
