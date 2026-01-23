// AI Player using Minimax algorithm with some randomness for fun gameplay

export enum CellState {
  EMPTY = 0,
  X = 1,
  O = 2,
}

export function getAIMove(board: CellState[], aiMarker: CellState): number {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) {
    return -1;
  }

  // 70% chance of optimal move, 30% random for more fun gameplay
  if (Math.random() < 0.7) {
    return getBestMove(board, aiMarker);
  } else {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
}

function getAvailableMoves(board: CellState[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === CellState.EMPTY) {
      moves.push(i);
    }
  }
  return moves;
}

function getBestMove(board: CellState[], aiMarker: CellState): number {
  const humanMarker = aiMarker === CellState.X ? CellState.O : CellState.X;
  let bestScore = -Infinity;
  let bestMove = -1;

  const availableMoves = getAvailableMoves(board);

  for (const move of availableMoves) {
    board[move] = aiMarker;
    const score = minimax(board, 0, false, aiMarker, humanMarker, -Infinity, Infinity);
    board[move] = CellState.EMPTY;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(
  board: CellState[],
  depth: number,
  isMaximizing: boolean,
  aiMarker: CellState,
  humanMarker: CellState,
  alpha: number,
  beta: number
): number {
  const winner = checkWinner(board);

  if (winner === aiMarker) return 10 - depth;
  if (winner === humanMarker) return depth - 10;
  if (getAvailableMoves(board).length === 0) return 0;

  // Limit depth for faster response (3 moves ahead is enough for tic-tac-toe)
  if (depth >= 6) return 0;

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = aiMarker;
      const score = minimax(board, depth + 1, false, aiMarker, humanMarker, alpha, beta);
      board[move] = CellState.EMPTY;
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of getAvailableMoves(board)) {
      board[move] = humanMarker;
      const score = minimax(board, depth + 1, true, aiMarker, humanMarker, alpha, beta);
      board[move] = CellState.EMPTY;
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minScore;
  }
}

function checkWinner(board: CellState[]): CellState | null {
  const winPatterns = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal
    [2, 4, 6], // Anti-diagonal
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== CellState.EMPTY && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  return null;
}
