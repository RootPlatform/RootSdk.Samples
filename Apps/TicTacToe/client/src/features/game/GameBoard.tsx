import React from "react";
import { CellState, MarkerIcons } from "../../core/GameLogic";

interface GameBoardProps {
  board: CellState[];
  winningLine: number[] | null;
  disabled: boolean;
  onCellClick: (position: number) => void;
}

interface MarkerIconProps {
  cell: CellState;
}

const MarkerIcon: React.FC<MarkerIconProps> = ({ cell }) => {
  if (cell === CellState.EMPTY) {
    return null;
  }

  const svg: string = cell === CellState.X ? MarkerIcons.X : MarkerIcons.O;
  const viewBoxMatch: RegExpMatchArray | null = svg.match(/viewBox="([^"]+)"/);
  const viewBox: string = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
  const innerMatch: RegExpMatchArray | null = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent: string = innerMatch ? innerMatch[1] : "";

  return (
    <svg
      viewBox={viewBox}
      className="cell-icon"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: innerContent }}
    />
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winningLine,
  disabled,
  onCellClick,
}) => {
  const isWinningCell = (index: number): boolean => {
    return winningLine !== null && winningLine.includes(index);
  };

  const getCellClass = (cell: CellState, index: number): string => {
    const classes: string[] = ["cell"];

    if (cell === CellState.X) {
      classes.push("x", "occupied");
    } else if (cell === CellState.O) {
      classes.push("o", "occupied");
    }

    if (isWinningCell(index)) {
      classes.push("winning");
    }
    if (disabled) {
      classes.push("disabled");
    }

    return classes.join(" ");
  };

  const handleCellClick = (index: number): void => {
    onCellClick(index);
  };

  return (
    <div className="game-board">
      {board.map((cell: CellState, index: number) => (
        <button
          key={index}
          className={getCellClass(cell, index)}
          onClick={() => handleCellClick(index)}
          disabled={disabled || cell !== CellState.EMPTY}
        >
          <MarkerIcon cell={cell} />
        </button>
      ))}
    </div>
  );
};
