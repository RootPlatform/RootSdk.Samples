export enum CellState {
  EMPTY = 0,
  X = 1,
  O = 2,
}

export enum GameStatus {
  WAITING = 0,
  IN_PROGRESS = 1,
  X_WINS = 2,
  O_WINS = 3,
  DRAW = 4,
  ABANDONED = 5,
}

export interface WinCheckResult {
  winner: CellState | null;
  line: number[] | null;
}

export const WIN_PATTERNS: readonly number[][] = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

export const BOARD_SIZE: number = 9;
export const DEFAULT_VIEWBOX: string = "0 0 24 24";

export function checkWinner(board: CellState[]): WinCheckResult {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c]: number[] = pattern;
    const cellA: CellState = board[a];
    const cellB: CellState = board[b];
    const cellC: CellState = board[c];

    const isOccupied: boolean = cellA !== CellState.EMPTY;
    const allMatch: boolean = cellA === cellB && cellB === cellC;

    if (isOccupied && allMatch) {
      return { winner: cellA, line: pattern };
    }
  }
  return { winner: null, line: null };
}

export function isDraw(board: CellState[]): boolean {
  const isBoardFull: boolean = board.every(
    (cell: CellState): boolean => cell !== CellState.EMPTY
  );
  const hasNoWinner: boolean = checkWinner(board).winner === null;
  return isBoardFull && hasNoWinner;
}

export function isGameOver(status: GameStatus): boolean {
  return status >= GameStatus.X_WINS;
}

export function getStatusText(
  status: GameStatus,
  winnerId: string,
  currentUserId: string
): string {
  switch (status) {
    case GameStatus.WAITING:
      return "Waiting for opponent...";
    case GameStatus.IN_PROGRESS:
      return "Game in progress";
    case GameStatus.X_WINS:
      return winnerId === currentUserId ? "You won!" : "X wins!";
    case GameStatus.O_WINS:
      return winnerId === currentUserId ? "You won!" : "O wins!";
    case GameStatus.DRAW:
      return "It's a draw!";
    case GameStatus.ABANDONED:
      return "Game abandoned";
    default:
      return "";
  }
}

export function getCellSymbol(cell: CellState): string {
  switch (cell) {
    case CellState.X:
      return "X";
    case CellState.O:
      return "O";
    default:
      return "";
  }
}

export const MarkerIcons: { readonly X: string; readonly O: string } = {
  // X: two thick rotated rectangles forming a bold cross
  X: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="10.5" y="1" width="3" height="22" rx="0" fill="currentColor" transform="rotate(45 12 12)"/>
    <rect x="10.5" y="1" width="3" height="22" rx="0" fill="currentColor" transform="rotate(-45 12 12)"/>
  </svg>`,
  // O: thick stroke ring
  O: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="3.5"/>
  </svg>`,
};
