const BOARD_SIZE = 8;
const EMPTY_SQUARE = 0;
const BLACK_PIECE = 1;
const RED_PIECE = 2;
const BLACK_QUEEN = 3;
const RED_QUEEN = 4;

const INITIAL_BOARD_STATE = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];

class CheckersGame {
  constructor() {
    this.board = INITIAL_BOARD_STATE;
    this.turn = BLACK_PIECE;
  }

  getPiece(row, col) {
    return this.board[row][col];
  }

  setPiece(row, col, piece) {
    this.board[row][col] = piece;
  }

  isOutOfBounds(row, col) {
    return row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (this.isOutOfBounds(toRow, toCol)) return false;

    // get the moved piece
    const piece = this.getPiece(fromRow, fromCol);
    // check if piece is a queen
    const queen = (piece === BLACK_QUEEN || piece === RED_QUEEN);
    // get player
    const player = (piece === BLACK_PIECE || piece === BLACK_QUEEN) ? BLACK_PIECE : RED_PIECE;
    // get opponent
    const opponent = (piece === BLACK_PIECE || piece === BLACK_QUEEN) ? RED_PIECE : BLACK_PIECE;
    
    // check if selected destination squate is empty
    // else invalid move

    if (this.getPiece(toRow, toCol) !== EMPTY_SQUARE) {
      return false;
    }

    if (queen) {
      if (this.canQueenCapture(fromRow, fromCol, toRow, toCol, player, opponent)) {
        if (this.isMultiJump(toRow, toCol, player, opponent)) {
          this.turn = (this.turn === BLACK_PIECE) ? RED_PIECE : BLACK_PIECE;
        }
        
        return true;
      }

      return false;
    } else {
      const forward = (player === BLACK_PIECE) ? 1 : -1;

      const rowDistance = Math.abs(toRow - fromRow);
      const colDistance = Math.abs(toCol - fromCol);
  
      if (rowDistance !== colDistance) {
        return false;
      }

      if (toRow - fromRow === forward && Math.abs(toCol - fromCol) === 1) {
        return true;
      }
    }

    if (this.canCapture(fromRow, fromCol, toRow, toCol, player, opponent)) {
      if (this.isMultiJump(toRow, toCol, player, opponent)) {
        this.turn = (this.turn === BLACK_PIECE) ? RED_PIECE : BLACK_PIECE;
      }

      return true;
    }

    return false;
  }

  canCapture(fromRow, fromCol, toRow, toCol, player, opponent) {
    if (this.isOutOfBounds(toRow, toCol)) return false;

    if (this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + ((toCol - fromCol) / 2)) === EMPTY_SQUARE) {
      return false;
    }

    const middlePiece = this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + ((toCol - fromCol) / 2));

    if (middlePiece !== opponent && middlePiece !== opponent + 2) {
      return false;
    }

    this.setPiece(fromRow + (toRow - fromRow) / 2, fromCol + ((toCol - fromCol) / 2), EMPTY_SQUARE);

    return true;
  }

  canQueenCapture(fromRow, fromCol, toRow, toCol, player, opponent) {
    if (this.isOutOfBounds(toRow, toCol)) return false;

    const rowDistance = Math.abs(toRow - fromRow);
    const colDistance = Math.abs(toCol - fromCol);

    if (rowDistance !== colDistance) {
      return false;
    }

     // Check if there are any pieces in the way
    const rowDirection = toRow > fromRow ? 1 : -1;
    const colDirection = toCol > fromCol ? 1 : -1;
    
    let i;
    let row;
    let col;
    for (i = 1; i < rowDistance - 1; i++) {
      row = fromRow + i * rowDirection;
      col = fromCol + i * colDirection;
      
      if (this.getPiece(row, col) !== EMPTY_SQUARE) {
        return false;
      }
    }

    row = fromRow + i * rowDirection;
    col = fromCol + i * colDirection;
    
    const capturedPiece = this.getPiece(row, col);

    if (capturedPiece !== EMPTY_SQUARE) {
      if (capturedPiece !== opponent && capturedPiece !== opponent + 2) {
        return false;
      }
  
      this.setPiece(row, col, EMPTY_SQUARE);
    }

    return true;
  }

  multiCanCapture(fromRow, fromCol, toRow, toCol, player, opponent) {
    if (this.isOutOfBounds(toRow, toCol)) return false;

    if (this.getPiece(toRow, toCol) !== EMPTY_SQUARE) {
      return false;
    }

    if (this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + ((toCol - fromCol) / 2)) === EMPTY_SQUARE) {
      return false;
    }

    const middlePiece = this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + ((toCol - fromCol) / 2));

    if (middlePiece !== opponent && middlePiece !== opponent + 2) {
      return false;
    }

    return true;
  }

  isMultiJump(fromRow, fromCol, player, opponent) {
    for (let i = -2; i <= 2; i += 4) {
      for (let j = -2; j <= 2; j += 4) {
        const jumpRow = fromRow + i;
        const jumpCol = fromCol + j;
        
        if (this.multiCanCapture(fromRow, fromCol, jumpRow, jumpCol, player, opponent)) {
          return true;
        }
      }
    }

    return false;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    const queen = (piece === BLACK_QUEEN || piece === RED_QUEEN);
    const player = (piece === BLACK_PIECE || piece === BLACK_QUEEN) ? BLACK_PIECE : RED_PIECE;
    const opponent = (piece === BLACK_PIECE || piece === BLACK_QUEEN) ? RED_PIECE : BLACK_PIECE;

    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    this.setPiece(toRow, toCol, piece);
    this.setPiece(fromRow, fromCol, EMPTY_SQUARE);

    // make queen
    if (toRow === (player === BLACK_PIECE ? BOARD_SIZE - 1 : 0) && !queen) {
      this.setPiece(toRow, toCol, player === BLACK_PIECE ? BLACK_QUEEN : RED_QUEEN);
    }

    this.turn = (this.turn === BLACK_PIECE) ? RED_PIECE : BLACK_PIECE;

    return true;
  }
  
  getWinner() {
    let blackCount = 0;
    let redCount = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const piece = this.getPiece(i, j);

        if (piece === BLACK_PIECE || piece === BLACK_QUEEN) {
          blackCount++;
        } else if (piece === RED_PIECE || piece === RED_QUEEN) {
          redCount++;
        }
      }
    }

    if (blackCount === 0) {
      return RED_PIECE;
    } else if (redCount === 0) {
      return BLACK_PIECE;
    }
    
    return null;
  }

  getBoard() {
    return this.board;
  }

  getTurn() {
    return this.turn;
  }
}

module.exports = { CheckersGame };