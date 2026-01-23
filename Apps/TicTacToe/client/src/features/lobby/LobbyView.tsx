import React from "react";

interface LobbyViewProps {
  onPlayAI: () => void;
  onPlayOnline: () => void;
  onSpectate: () => void;
  onLeaderboard: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  onPlayAI,
  onPlayOnline,
  onSpectate,
  onLeaderboard,
}) => {
  return (
    <div className="lobby">
      <div className="lobby-primary">
        <button className="lobby-card" onClick={onPlayOnline}>
          <span className="lobby-card-icon">vs</span>
          <div className="lobby-card-text">
            <span className="lobby-card-title">Play Online</span>
            <span className="lobby-card-desc">Challenge a real opponent</span>
          </div>
        </button>
        <button className="lobby-card" onClick={onPlayAI}>
          <span className="lobby-card-icon">AI</span>
          <div className="lobby-card-text">
            <span className="lobby-card-title">Play Computer</span>
            <span className="lobby-card-desc">Practice against the AI</span>
          </div>
        </button>
      </div>
      <div className="lobby-secondary">
        <button className="lobby-link" onClick={onSpectate}>
          Watch Games
        </button>
        <span className="lobby-divider" />
        <button className="lobby-link" onClick={onLeaderboard}>
          Leaderboard
        </button>
      </div>
    </div>
  );
};
