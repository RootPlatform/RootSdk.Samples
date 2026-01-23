import React from "react";
import { GameBoard } from "./GameBoard";
import { PlayerMarkerIcon } from "../../components/PlayerMarkerIcon";
import { CellState, GameStatus, isGameOver } from "../../core/GameLogic";
import { Game } from "@tictactoe/gen-shared";

interface GameViewProps {
  game: Game;
  currentUserId: string;
  onMove: (position: number) => void;
  onRematch: () => void;
  onLeave: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  game,
  currentUserId,
  onMove,
  onRematch,
  onLeave,
}) => {
  const isPlayerX: boolean = game.playerX?.userId === currentUserId;
  const playerMarker: CellState = isPlayerX ? CellState.X : CellState.O;
  const isMyTurn: boolean = game.currentTurn === playerMarker;
  const gameOver: boolean = isGameOver(game.status);
  const didWin: boolean = game.winnerId === currentUserId;
  const isDraw: boolean = game.status === GameStatus.DRAW;

  const getResultText = (): string => {
    if (didWin) return "You won!";
    if (isDraw) return "Draw";
    if (game.status === GameStatus.ABANDONED) return "Opponent left";
    return "You lost";
  };

  const getResultClass = (): string => {
    if (didWin) return isPlayerX ? "win x-win" : "win o-win";
    if (isDraw) return "draw";
    return "lose";
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

  const board: CellState[] = game.board.length === 9
    ? (game.board as CellState[])
    : Array(9).fill(CellState.EMPTY);

  return (
    <div className="game-view">
      <div className="game-players">
        <div className={getPlayerCardClass("X")}>
          <PlayerMarkerIcon marker="X" />
          <div className="player-name">
            {game.playerX?.displayName || "Player X"}
            {isPlayerX && " (You)"}
          </div>
        </div>
        <div className="player-vs">vs</div>
        <div className={getPlayerCardClass("O")}>
          <PlayerMarkerIcon marker="O" />
          <div className="player-name">
            {game.playerO?.displayName || "Player O"}
            {!isPlayerX && " (You)"}
          </div>
        </div>
      </div>

      <GameBoard
        board={board}
        winningLine={game.winningLine || null}
        disabled={!isMyTurn || gameOver}
        onCellClick={onMove}
      />

      {gameOver ? (
        <div className="game-result">
          <div className={`game-result-text ${getResultClass()}`}>
            {getResultText()}
          </div>
          <div className="game-actions">
            {game.isAiGame && (
              <button className="btn btn-primary" onClick={onRematch}>
                Play Again
              </button>
            )}
            <button className={game.isAiGame ? "btn btn-secondary" : "btn btn-primary"} onClick={onLeave}>
              Back to Lobby
            </button>
          </div>
        </div>
      ) : (
        <button className="btn btn-secondary btn-forfeit" onClick={onLeave}>
          Forfeit
        </button>
      )}
    </div>
  );
};
