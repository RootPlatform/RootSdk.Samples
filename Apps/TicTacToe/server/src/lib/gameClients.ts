import { Client } from "@rootsdk/server-app";

/**
 * Tracks which clients are associated with which games.
 * Used to scope broadcasts to only game participants and spectators.
 */
class GameClientTracker {
  // Map of gameId -> Map of userId -> Client
  private gameClients: Map<string, Map<string, Client>> = new Map();
  // Map of userId -> gameId (for quick lookup)
  private clientGames: Map<string, string> = new Map();

  /**
   * Register a client as a participant in a game
   */
  public addPlayer(gameId: string, client: Client): void {
    if (!this.gameClients.has(gameId)) {
      this.gameClients.set(gameId, new Map());
    }
    this.gameClients.get(gameId)!.set(client.userId, client);
    this.clientGames.set(client.userId, gameId);
  }

  /**
   * Register a client as a spectator of a game
   */
  public addSpectator(gameId: string, client: Client): void {
    if (!this.gameClients.has(gameId)) {
      this.gameClients.set(gameId, new Map());
    }
    this.gameClients.get(gameId)!.set(client.userId, client);
    this.clientGames.set(client.userId, gameId);
  }

  /**
   * Remove a client from their current game
   */
  public removeClient(userId: string): void {
    const gameId = this.clientGames.get(userId);
    if (gameId) {
      const gameClientMap = this.gameClients.get(gameId);
      if (gameClientMap) {
        gameClientMap.delete(userId);
        // Clean up empty game entries
        if (gameClientMap.size === 0) {
          this.gameClients.delete(gameId);
        }
      }
      this.clientGames.delete(userId);
    }
  }

  /**
   * Get all clients associated with a game (players + spectators)
   */
  public getGameClients(gameId: string): Client[] {
    const clientMap = this.gameClients.get(gameId);
    if (!clientMap) {
      return [];
    }
    return Array.from(clientMap.values());
  }

  /**
   * Get the game ID for a client
   */
  public getClientGame(userId: string): string | undefined {
    return this.clientGames.get(userId);
  }

  /**
   * Clean up a game (remove all clients when game ends)
   */
  public cleanupGame(gameId: string): void {
    const clientMap = this.gameClients.get(gameId);
    if (clientMap) {
      for (const userId of clientMap.keys()) {
        this.clientGames.delete(userId);
      }
      this.gameClients.delete(gameId);
    }
  }
}

export const gameClientTracker = new GameClientTracker();
