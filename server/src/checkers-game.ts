import { 
  INITIAL_BOARD_STATE,
  BOARD_SIZE, 
  EMPTY_SQUARE, 
  BLACK_PIECE, 
  RED_PIECE, 
  BLACK_KING, 
  RED_KING,
} from './constants';

export class CheckersGame {
  private board: number[][];
  private turn: number;

  constructor() {
    this.board = INITIAL_BOARD_STATE.map(row => row.slice()); // Deep copy
    this.turn = BLACK_PIECE;
  }

  getPiece(row: number, col: number) {
    return this.board[row][col];
  }

  setPiece(row: number, col: number, piece: number) {
    this.board[row][col] = piece;
  }

  isOutOfBounds(row: number, col: number) {
    return row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE;
  }

  isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    if (this.isOutOfBounds(toRow, toCol)) return false;

    const piece = this.getPiece(fromRow, fromCol);
    const targetPiece = this.getPiece(toRow, toCol);
    if (targetPiece !== EMPTY_SQUARE) {
      return false;
    }

    const king = piece === BLACK_KING || piece === RED_KING;
    const player = piece === BLACK_PIECE || piece === BLACK_KING ? BLACK_PIECE : RED_PIECE;
    const opponent = player === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    const rowDistance = toRow - fromRow;
    const colDistance = toCol - fromCol;

    // For kings, allow moving any number of diagonal squares
    if (king && Math.abs(rowDistance) === Math.abs(colDistance)) {
      // Check for possible captures first
      const path = this.findCapturePath(fromRow, fromCol, toRow, toCol, player, opponent, king);
      if (path !== null) {
        return true; // Valid king capture move
      }

      // Ensure no pieces are between the from and to positions for normal moves
      const directionRow = rowDistance > 0 ? 1 : -1;
      const directionCol = colDistance > 0 ? 1 : -1;
      let currentRow = fromRow + directionRow;
      let currentCol = fromCol + directionCol;

      while (currentRow !== toRow && currentCol !== toCol) {
        if (this.getPiece(currentRow, currentCol) !== EMPTY_SQUARE) {
          return false; // Blocked by another piece
        }
        currentRow += directionRow;
        currentCol += directionCol;
      }

      if (this.turn !== player) {
        return false;
      }

      return true; // Valid king move
    }

    // Normal piece move (non-king, one square diagonally forward)
    if (Math.abs(rowDistance) === 1 && Math.abs(colDistance) === 1) {
      if (this.turn !== player) {
        return false;
      }
      if (!king) {
        const forwardDirection = player === BLACK_PIECE ? 1 : -1;
        if (rowDistance !== forwardDirection) {
          return false;
        }
      }
      return true;
    }

    // Check for capture move
    const path = this.findCapturePath(fromRow, fromCol, toRow, toCol, player, opponent, king);
    if (path !== null) {
      return true;
    }

    return false;
  }

  findCapturePath(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    player: number,
    opponent: number,
    isKing: boolean
  ): Array<[number, number]> | null {
    const visited = new Set<string>();

    const dfs = (
      currentRow: number,
      currentCol: number,
      board: number[][],
      path: Array<[number, number]>,
      firstCapture: boolean
    ): Array<[number, number]> | null => {
      path.push([currentRow, currentCol]);

      if (currentRow === toRow && currentCol === toCol && path.length > 1) {
        return path.slice(); // Found a valid capture path
      }

      const directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];

      for (const [dRow, dCol] of directions) {
        if (isKing) {
          if (firstCapture) {
            // For the first capture, the king can look along the diagonal
            let nextRow = currentRow + dRow;
            let nextCol = currentCol + dCol;

            while (!this.isOutOfBounds(nextRow, nextCol)) {
              const currentPiece = board[nextRow][nextCol];
              if (currentPiece === EMPTY_SQUARE) {
                nextRow += dRow;
                nextCol += dCol;
              } else if (currentPiece === opponent || currentPiece === opponent + 2) {
                // Found an opponent piece to capture
                const landingRow = nextRow + dRow;
                const landingCol = nextCol + dCol;

                // Check if landing square is empty and within bounds
                if (
                  !this.isOutOfBounds(landingRow, landingCol) &&
                  board[landingRow][landingCol] === EMPTY_SQUARE
                ) {
                  const key = `${landingRow},${landingCol}`;
                  if (!visited.has(key)) {
                    visited.add(key);

                    // Copy board
                    const newBoard = board.map((r) => r.slice());
                    // Remove captured piece
                    newBoard[nextRow][nextCol] = EMPTY_SQUARE;
                    // Move king
                    newBoard[landingRow][landingCol] = newBoard[currentRow][currentCol];
                    newBoard[currentRow][currentCol] = EMPTY_SQUARE;

                    const newPath = path.slice();
                    const result = dfs(landingRow, landingCol, newBoard, newPath, false); // Now it's not the first capture
                    if (result) {
                      return result;
                    }

                    visited.delete(key);
                  }
                }
                break; // Can't capture multiple pieces in one direction without landing
              } else {
                // Blocked by own piece
                break;
              }
            }
          } else {
            // For subsequent captures, the king can only capture adjacent opponent pieces
            const midRow = currentRow + dRow;
            const midCol = currentCol + dCol;
            const landingRow = currentRow + 2 * dRow;
            const landingCol = currentCol + 2 * dCol;

            if (!this.isOutOfBounds(landingRow, landingCol)) {
              const midPiece = board[midRow][midCol];
              const landingPiece = board[landingRow][landingCol];

              if ((midPiece === opponent || midPiece === opponent + 2) && landingPiece === EMPTY_SQUARE) {
                const key = `${landingRow},${landingCol}`;
                if (!visited.has(key)) {
                  visited.add(key);

                  // Copy board
                  const newBoard = board.map((r) => r.slice());
                  // Remove captured piece
                  newBoard[midRow][midCol] = EMPTY_SQUARE;
                  // Move king
                  newBoard[landingRow][landingCol] = newBoard[currentRow][currentCol];
                  newBoard[currentRow][currentCol] = EMPTY_SQUARE;

                  const newPath = path.slice();
                  const result = dfs(landingRow, landingCol, newBoard, newPath, false); // Still not first capture
                  if (result) {
                    return result;
                  }

                  visited.delete(key);
                }
              }
            }
          }
        } else {
          // For regular pieces
          const midRow = currentRow + dRow;
          const midCol = currentCol + dCol;
          const landingRow = currentRow + 2 * dRow;
          const landingCol = currentCol + 2 * dCol;

          if (!this.isOutOfBounds(landingRow, landingCol)) {
            const midPiece = board[midRow][midCol];
            const landingPiece = board[landingRow][landingCol];

            if (
              (midPiece === opponent || midPiece === opponent + 2) &&
              landingPiece === EMPTY_SQUARE
            ) {
              // Enforce forward capture for the first capture
              if (firstCapture) {
                const dRowCapture = landingRow - currentRow;
                const forwardDirection = player === BLACK_PIECE ? 2 : -2;
                if (dRowCapture !== forwardDirection) {
                  continue; // Skip this capture as it's not forward
                }
              }

              const key = `${landingRow},${landingCol}`;
              if (!visited.has(key)) {
                visited.add(key);

                // Copy board
                const newBoard = board.map((r) => r.slice());
                // Remove captured piece
                newBoard[midRow][midCol] = EMPTY_SQUARE;
                // Move piece
                newBoard[landingRow][landingCol] = newBoard[currentRow][currentCol];
                newBoard[currentRow][currentCol] = EMPTY_SQUARE;

                const newPath = path.slice();
                const result = dfs(
                  landingRow,
                  landingCol,
                  newBoard,
                  newPath,
                  false // After first capture
                );
                if (result) {
                  return result;
                }

                visited.delete(key);
              }
            }
          }
        }
      }

      return null;
    };

    const initialBoard = this.board.map((r) => r.slice());
    return dfs(fromRow, fromCol, initialBoard, [], true); // Start with firstCapture = true
  }

  makeMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    const piece = this.getPiece(fromRow, fromCol);
    const king = piece === BLACK_KING || piece === RED_KING;
    const player = piece === BLACK_PIECE || piece === BLACK_KING ? BLACK_PIECE : RED_PIECE;
    const opponent = player === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    const rowDistance = Math.abs(toRow - fromRow);
    const colDistance = Math.abs(toCol - fromCol);

    if (rowDistance === 1 && colDistance === 1) {
      // Simple move
      this.setPiece(toRow, toCol, piece);
      this.setPiece(fromRow, fromCol, EMPTY_SQUARE);
    } else {
      // Capture move
      const path = this.findCapturePath(fromRow, fromCol, toRow, toCol, player, opponent, king);
      if (path !== null) {
        // Move the piece along the path and capture pieces
        for (let i = 1; i < path.length; i++) {
          const [prevRow, prevCol] = path[i - 1];
          const [currentRow, currentCol] = path[i];
          const dRow = currentRow - prevRow;
          const dCol = currentCol - prevCol;

          const stepRow = dRow > 0 ? 1 : -1;
          const stepCol = dCol > 0 ? 1 : -1;

          let midRow = prevRow + stepRow;
          let midCol = prevCol + stepCol;
          let captured = false;

          while (midRow !== currentRow && midCol !== currentCol) {
            const midPiece = this.getPiece(midRow, midCol);
            if (midPiece === opponent || midPiece === opponent + 2) {
              this.setPiece(midRow, midCol, EMPTY_SQUARE); // Remove captured piece
              captured = true;
              break; // Stop after removing one piece
            } else if (midPiece !== EMPTY_SQUARE) {
              // Move blocked by another piece
              return false;
            }
            midRow += stepRow;
            midCol += stepCol;
          }

          // Ensure a piece was captured; if not, the move is invalid
          if (!captured) {
            return false;
          }

          // Move the piece to the next position
          this.setPiece(currentRow, currentCol, piece);
          this.setPiece(prevRow, prevCol, EMPTY_SQUARE);
        }
      } else if (king && Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol)) {
        // King moving multiple squares without capturing
        this.setPiece(toRow, toCol, piece);
        this.setPiece(fromRow, fromCol, EMPTY_SQUARE);
      } else {
        // Invalid move
        return false;
      }
    }

    // Crown the piece if it reaches the last row
    if (
      !king &&
      ((player === BLACK_PIECE && toRow === BOARD_SIZE - 1) ||
        (player === RED_PIECE && toRow === 0))
    ) {
      this.setPiece(toRow, toCol, player === BLACK_PIECE ? BLACK_KING : RED_KING);
    }

    // Switch turn
    this.turn = this.turn === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    return true;
  }

  hasValidMoves(player: number): boolean {
    const opponent = player === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.getPiece(row, col);

        if (piece === player || piece === player + 2) { // Regular or King
          const isKing = piece === BLACK_KING || piece === RED_KING;

          // Check all possible directions
          const directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ];

          for (const [dRow, dCol] of directions) {
            const toRow = row + dRow;
            const toCol = col + dCol;

            // Simple move
            if (
              !this.isOutOfBounds(toRow, toCol) &&
              this.getPiece(toRow, toCol) === EMPTY_SQUARE
            ) {
              // For normal pieces, ensure movement is forward
              if (!isKing) {
                const forwardDirection = player === BLACK_PIECE ? 1 : -1;
                if (dRow !== forwardDirection) {
                  continue;
                }
              }
              return true; // Found a valid simple move
            }

            // Capture move
            const captureRow = row + 2 * dRow;
            const captureCol = col + 2 * dCol;

            if (
              !this.isOutOfBounds(captureRow, captureCol) &&
              this.getPiece(captureRow, captureCol) === EMPTY_SQUARE
            ) {
              const midRow = row + dRow;
              const midCol = col + dCol;
              const midPiece = this.getPiece(midRow, midCol);

              if (
                midPiece === opponent ||
                midPiece === opponent + 2 // Opponent's piece or king
              ) {
                // For normal pieces, ensure capture is forward
                if (!isKing) {
                  const forwardDirection = player === BLACK_PIECE ? 1 : -1;
                  if (dRow !== forwardDirection) {
                    continue;
                  }
                }
                return true; // Found a valid capture move
              }
            }
          }
        }
      }
    }

    return false; // No valid moves found
  }

  getValidMovesForPiece(row: number, col: number): Array<{ toRow: number; toCol: number }> {
    if (this.isOutOfBounds(row, col)) return [];
  
    const piece = this.getPiece(row, col);
    if (piece === EMPTY_SQUARE) return [];
  
    const isKing = piece === BLACK_KING || piece === RED_KING;
    const player = piece === BLACK_PIECE || piece === BLACK_KING ? BLACK_PIECE : RED_PIECE;
  
    // Ensure it's the player's turn
    if (this.turn !== player) return [];
  
    const validMoves: Array<{ toRow: number; toCol: number }> = [];
  
    // Iterate over all possible destination squares
    for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
      for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
        // Skip the current position
        if (toRow === row && toCol === col) continue;
  
        // Use isValidMove to check if moving to (toRow, toCol) is valid
        if (this.isValidMove(row, col, toRow, toCol)) {
          validMoves.push({ toRow, toCol });
        }
      }
    }
  
    return validMoves;
  }
  

  getWinner() {
    let blackCount = 0;
    let redCount = 0;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const piece = this.getPiece(i, j);

        if (piece === BLACK_PIECE || piece === BLACK_KING) {
          blackCount++;
        } else if (piece === RED_PIECE || piece === RED_KING) {
          redCount++;
        }
      }
    }

    // Check if either player has no pieces left
    if (blackCount === 0) {
      return RED_PIECE; // Red wins
    } else if (redCount === 0) {
      return BLACK_PIECE; // Black wins
    }

    // Check if the next player has any valid moves
    const nextPlayer = this.turn;
    if (!this.hasValidMoves(nextPlayer)) {
      console.log(`Player ${nextPlayer} has no valid moves.`);
      return 3; // Draw
    }

    return null; // Game continues
  }

  getPlayersCapturedPiecesCount() {
      let blackCount = 0;
      let redCount = 0;
  
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          const piece = this.getPiece(i, j);
  
          if (piece === BLACK_PIECE || piece === BLACK_KING) {
            blackCount++;
          } else if (piece === RED_PIECE || piece === RED_KING) {
            redCount++;
          }
        }
      }
      
      const capturedPieces = {
        black: 12 - blackCount,
        red: 12 - redCount
      }
      
      return capturedPieces;
  }

  getBoard() {
    return this.board;
  }

  getTurn() {
    return this.turn;
  }
}
