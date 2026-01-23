import React from "react";
import { GameBoard } from "../game/GameBoard";
import { PlayerMarkerIcon } from "../../components/PlayerMarkerIcon";
import { CellState, GameStatus, isGameOver } from "../../core/GameLogic";
import { Game } from "@tictactoe/gen-shared";

interface SpectatorGameViewProps {
  game: Game;
  onBack: () => void;
}

export const SpectatorGameView: React.FC<SpectatorGameViewProps> = ({
  game,
  onBack,
}) => {
  const gameOver: boolean = isGameOver(game.status);

  const getStatusText = (): string => {
    if (game.status === GameStatus.IN_PROGRESS) {
      const currentPlayerName: string = game.currentTurn === CellState.X
        ? game.playerX?.displayName || "Player X"
        : game.playerO?.displayName || "Player O";
      return `${currentPlayerName}'s turn`;
    }
    if (game.status === GameStatus.X_WINS) {
      return `${game.playerX?.displayName} wins!`;
    }
    if (game.status === GameStatus.O_WINS) {
      return `${game.playerO?.displayName} wins!`;
    }
    if (game.status === GameStatus.DRAW) {
      return "It's a draw!";
    }
    return "Game ended";
  };

  const getPlayerCardClass = (marker: "X" | "O"): string => {
    const isX: boolean = marker === "X";
    const cellState: CellState = isX ? CellState.X : CellState.O;
    const player = isX ? game.playerX : game.playerO;

    const classes: string[] = ["player-card"];

    const isActive: boolean = game.currentTurn === cellState && !gameOver;
    if (isActive) {
      classes.push("active");
      classes.push(isX ? "x-turn" : "o-turn");
    }

    const isWinner: boolean = gameOver && game.winnerId === player?.userId;
    if (isWinner) {
      classes.push("winner");
      classes.push(isX ? "x-winner" : "o-winner");
    }

    return classes.join(" ");
  };

  const handleCellClick = (): void => {
    // Spectators cannot make moves
  };

  const board: CellState[] = game.board.length === 9
    ? (game.board as CellState[])
    : Array(9).fill(CellState.EMPTY);

  return (
    <div className="spectator-game-view">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        Back
      </button>

      <div className="spectator-badge">Spectating</div>

      <div className="game-view">
        <div className="game-players">
          <div className={getPlayerCardClass("X")}>
            <PlayerMarkerIcon marker="X" />
            <div className="player-name">
              {game.playerX?.displayName || "Player X"}
            </div>
          </div>
          <div className="player-vs">vs</div>
          <div className={getPlayerCardClass("O")}>
            <PlayerMarkerIcon marker="O" />
            <div className="player-name">
              {game.playerO?.displayName || "Player O"}
            </div>
          </div>
        </div>

        <GameBoard
          board={board}
          winningLine={game.winningLine || null}
          disabled={true}
          onCellClick={handleCellClick}
        />

        {gameOver && (
          <div className="game-result">
            <div className="game-result-text">{getStatusText()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
