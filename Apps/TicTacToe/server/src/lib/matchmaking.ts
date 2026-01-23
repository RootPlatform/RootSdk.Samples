import { gameManager, GameState } from "./gameManager";
import { playerStatsRepository } from "../repositories/playerStatsRepository";

export interface QueueEntry {
  userId: string;
  displayName: string;
  joinedAt: Date;
}

type MatchFoundCallback = (game: GameState, playerIds: string[]) => void;
type QueueUpdatedCallback = (userId: string, position: number, total: number) => void;

class MatchmakingQueue {
  private queue: QueueEntry[] = [];
  private onMatchFound: MatchFoundCallback | null = null;
  private onQueueUpdated: QueueUpdatedCallback | null = null;
  private matchmakingInterval: NodeJS.Timeout | null = null;
  // Track games created during joinQueue so we can return them in the response
  private pendingMatches: Map<string, GameState> = new Map();

  public setMatchFoundCallback(callback: MatchFoundCallback): void {
    this.onMatchFound = callback;
  }

  public setQueueUpdatedCallback(callback: QueueUpdatedCallback): void {
    this.onQueueUpdated = callback;
  }

  public start(): void {
    // Check for matches every 2 seconds
    this.matchmakingInterval = setInterval(() => {
      this.processQueue();
    }, 2000);
  }

  public stop(): void {
    if (this.matchmakingInterval) {
      clearInterval(this.matchmakingInterval);
      this.matchmakingInterval = null;
    }
  }

  public async joinQueue(userId: string, displayName: string): Promise<{ success: boolean; position: number; error?: string; game?: GameState }> {
    // Check if already in queue
    if (this.queue.some((entry) => entry.userId === userId)) {
      const position = this.getPosition(userId);
      return { success: false, position, error: "Already in queue" };
    }

    // Check if already in an active game
    const activeGame = gameManager.getPlayerCurrentGame(userId);
    if (activeGame) {
      return { success: false, position: 0, error: "Already in a game" };
    }

    // Ensure player has stats record
    await playerStatsRepository.getOrCreate(userId, displayName);

    const entry: QueueEntry = {
      userId,
      displayName,
      joinedAt: new Date(),
    };

    this.queue.push(entry);
    const position = this.queue.length;

    // Notify all players in queue about updated positions
    this.notifyQueueUpdates();

    // Immediately check if we can make a match
    if (this.queue.length >= 2) {
      this.processQueue();
    }

    // Check if a match was found for this player during processQueue
    const game = this.pendingMatches.get(userId);
    if (game) {
      this.pendingMatches.delete(userId);
      return { success: true, position: 0, game };
    }

    return { success: true, position };
  }

  public leaveQueue(userId: string): boolean {
    const index = this.queue.findIndex((entry) => entry.userId === userId);
    if (index === -1) return false;

    this.queue.splice(index, 1);
    this.notifyQueueUpdates();
    return true;
  }

  public isInQueue(userId: string): boolean {
    return this.queue.some((entry) => entry.userId === userId);
  }

  public getPosition(userId: string): number {
    const index = this.queue.findIndex((entry) => entry.userId === userId);
    return index === -1 ? 0 : index + 1;
  }

  public getTotalInQueue(): number {
    return this.queue.length;
  }

  public getQueueStatus(userId: string): { inQueue: boolean; position: number; total: number } {
    return {
      inQueue: this.isInQueue(userId),
      position: this.getPosition(userId),
      total: this.queue.length,
    };
  }

  private processQueue(): void {
    // Simple first-come-first-served matching
    while (this.queue.length >= 2) {
      const player1 = this.queue.shift()!;
      const player2 = this.queue.shift()!;

      const game = gameManager.createPvPGame(
        player1.userId,
        player1.displayName,
        player2.userId,
        player2.displayName
      );

      // Store the game for both players so joinQueue can return it
      this.pendingMatches.set(player1.userId, game);
      this.pendingMatches.set(player2.userId, game);

      if (this.onMatchFound) {
        this.onMatchFound(game, [player1.userId, player2.userId]);
      }
    }

    // Notify remaining players about their new positions
    this.notifyQueueUpdates();
  }

  private notifyQueueUpdates(): void {
    if (!this.onQueueUpdated) return;

    const total = this.queue.length;
    this.queue.forEach((entry, index) => {
      this.onQueueUpdated!(entry.userId, index + 1, total);
    });
  }
}

export const matchmakingQueue = new MatchmakingQueue();
