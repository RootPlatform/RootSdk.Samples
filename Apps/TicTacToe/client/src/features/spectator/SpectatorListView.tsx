import React, { useEffect, useState } from "react";
import { spectatorServiceClient } from "../../lib/client";
import { ActiveGameSummary } from "@tictactoe/gen-shared";

const REFRESH_INTERVAL_MS: number = 5000;

interface SpectatorListViewProps {
  onWatchGame: (gameId: string) => void;
  onBack: () => void;
}

export const SpectatorListView: React.FC<SpectatorListViewProps> = ({
  onWatchGame,
  onBack,
}) => {
  const [games, setGames] = useState<ActiveGameSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadGames();
    const interval: ReturnType<typeof setInterval> = setInterval(loadGames, REFRESH_INTERVAL_MS);
    return (): void => clearInterval(interval);
  }, []);

  const loadGames = async (): Promise<void> => {
    try {
      const response = await spectatorServiceClient.listActiveGames({});
      setGames(response.games || []);
    } catch (error: unknown) {
      console.error("Failed to load active games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId: string): void => {
    onWatchGame(gameId);
  };

  return (
    <div className="spectator-list-view">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        Back
      </button>

      <h2 className="view-title">Active Games</h2>

      {loading ? (
        <div className="no-games">Loading...</div>
      ) : games.length === 0 ? (
        <div className="no-games">No active games to watch</div>
      ) : (
        <div className="spectator-list">
          {games.map((game: ActiveGameSummary) => (
            <div
              key={game.gameId}
              className="spectator-item"
              onClick={() => handleGameClick(game.gameId)}
            >
              <div className="match-players">
                {game.playerXName} vs {game.playerOName}
              </div>
              <div className="match-moves">{game.moveCount} moves</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
