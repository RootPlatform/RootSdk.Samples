import React, { useEffect, useState } from "react";
import { leaderboardServiceClient } from "../../lib/client";
import { PlayerStats } from "@tictactoe/gen-shared";

const LEADERBOARD_LIMIT: number = 10;
const PERCENT: number = 100;

interface LeaderboardViewProps {
  onBack: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onBack }) => {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async (): Promise<void> => {
    try {
      const response = await leaderboardServiceClient.getLeaderboard({
        limit: LEADERBOARD_LIMIT,
        offset: 0,
      });
      setPlayers(response.players || []);
    } catch (error: unknown) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWinRate = (stats: PlayerStats): number => {
    const total: number = stats.totalGames || 0;
    if (total === 0) return 0;
    return Math.round((stats.wins / total) * PERCENT);
  };

  const maxGames: number = Math.max(
    ...players.map((p: PlayerStats): number => p.totalGames || 1),
    1
  );

  const renderPlayerRow = (player: PlayerStats, index: number): React.ReactNode => {
    const winRate: number = getWinRate(player);
    const total: number = player.totalGames || 0;
    const barWidth: number = total > 0 ? (total / maxGames) * PERCENT : 0;
    const winsPercent: number = total > 0 ? (player.wins / total) * PERCENT : 0;
    const lossesPercent: number = total > 0 ? (player.losses / total) * PERCENT : 0;
    const drawsPercent: number = total > 0 ? (player.draws / total) * PERCENT : 0;

    return (
      <div key={player.userId} className="leaderboard-row">
        <div className="lb-rank">{index + 1}</div>
        <div className="lb-player">
          <div className="lb-name">{player.displayName}</div>
          <div className="lb-games">{total} games</div>
        </div>
        <div className="lb-stats">
          <div className="lb-bar-container" style={{ width: `${barWidth}%` }}>
            <div className="lb-bar wins" style={{ width: `${winsPercent}%` }}>
              {player.wins > 0 && <span>{player.wins}</span>}
            </div>
            <div className="lb-bar losses" style={{ width: `${lossesPercent}%` }}>
              {player.losses > 0 && <span>{player.losses}</span>}
            </div>
            <div className="lb-bar draws" style={{ width: `${drawsPercent}%` }}>
              {player.draws > 0 && <span>{player.draws}</span>}
            </div>
          </div>
        </div>
        <div className="lb-winrate">{winRate}%</div>
      </div>
    );
  };

  return (
    <div className="leaderboard-view">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        Back
      </button>

      <h2 className="view-title">Leaderboard</h2>

      {loading ? (
        <div className="loading-state">
          <div className="queue-spinner"></div>
          <div>Loading...</div>
        </div>
      ) : players.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-text">No players yet</div>
          <div className="empty-state-hint">Play some games to appear here!</div>
        </div>
      ) : (
        <div className="leaderboard-content">
          <div className="leaderboard-list">
            {players.map((player: PlayerStats, index: number) =>
              renderPlayerRow(player, index)
            )}
          </div>

          <div className="leaderboard-legend">
            <div className="legend-item">
              <span className="legend-color wins"></span>Wins
            </div>
            <div className="legend-item">
              <span className="legend-color losses"></span>Losses
            </div>
            <div className="legend-item">
              <span className="legend-color draws"></span>Draws
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
