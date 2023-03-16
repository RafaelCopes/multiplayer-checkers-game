const BOARD_SIZE = 8;
const EMPTY_SQUARE = 0;
const BLACK_PIECE = 1;
const BLACK_KING = 3;
const WHITE_PIECE = 2;
const WHITE_KING = 4;

const INITIAL_BOARD = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0]
];

class CheckersTest {
  constructor() {
    this.board = INITIAL_BOARD;
    this.turn = BLACK_PIECE;
  }

  isOutOfBounds(row, col) {
    return row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE;
  }

  getPiece(row, col) {
    return this.board[row][col];
  }

  setPiece(row, col, piece) {
    this.board[row][col] = piece;
  }

  getBoard() {
    return this.board;
  }

  getTurn() {
    return this.turn;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (this.isOutOfBounds(toRow, toCol)) return false;
    
    const piece = this.getPiece(fromRow, fromCol);
    const king = (piece === BLACK_KING || piece === WHITE_KING);
    const player = (piece === BLACK_PIECE || piece === BLACK_KING) ? BLACK_PIECE : WHITE_PIECE;
    const opponent = (piece === BLACK_PIECE || piece === BLACK_KING) ? WHITE_PIECE : BLACK_PIECE;

    if (this.getPiece(toRow, toCol) !== EMPTY_SQUARE) {
      return false;
    }

    if (king) {
      if (Math.abs(toRow - fromRow) === 1 || Math.abs(toCol - fromCol) === 1) {
        return true;
      }
    } else {
      const forward = (player === BLACK_PIECE) ? 1 : -1;
      if (toRow - fromRow === forward || Math.abs(toCol - fromCol) === 1) {
        return true;
      }
    }

    if (this.canCapture(fromRow, fromCol, toRow, toCol, player, opponent)) {
      return true;
    }

    if (this.isMultiJump(fromRow, fromCol, toRow, toCol, player, opponent)) {
      return true;
    }

    return false;
  }

  canCapture(fromRow, fromCol, toRow, toCol, player, opponent) {
    if (this.isOutOfBounds(toRow, toCol)) return false;
    
    if (this.getPiece(toRow, toCol) !== EMPTY_SQUARE) {
      return false;
    }

    // fromRow + (toRow - fromRow) / 2
    const jumpRow = fromRow + (toRow - fromRow) / 2;
    // fromCol + (toCol - fromCol) / 2
    //const jumpCol = fromCol + (toCol - fromCol) / 2;
    const jumpCol = fromCol + (toCol - fromCol) / 2;

    if (this.getPiece(jumpRow, jumpCol) === EMPTY_SQUARE) { 
      return false;
    }

    // fromCol + (toCol - fromCol) / 2
    const middlePiece = this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + (toCol - fromCol) / 2);
    
    // middlePiece !== opponent && middlePiece !== opponent + 2
    if (middlePiece !== opponent && middlePiece !== opponent + 1) {
      return false;
    }

    return true;
  }

  isMultiJump(fromRow, fromCol, toRow, toCol, player, opponent) {
    const forward = (player === BLACK_PIECE) ? 1 : -1;

    for (let i = -2; i <= 2; i += 4) {
      for (let j = -2; j <= 2; j += 4) {
        const jumpRow = fromRow + i;
        const jumpCol = fromCol + j;
        if (
          this.isValidMove(fromRow, fromCol, jumpRow, jumpCol) && 
          this.canCapture(fromRow, fromCol, jumpRow, jumpCol, player, opponent) && 
          this.isValidMove(jumpRow, jumpCol, toRow, toCol)
        ) {
          return true;
        }
      }
    } 
    
    return false;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    const king = (piece === BLACK_KING || piece === WHITE_KING);
    const player = (piece === BLACK_PIECE || piece === BLACK_KING) ? BLACK_PIECE : WHITE_PIECE;
    const opponent = (piece === BLACK_PIECE || piece === BLACK_KING) ? WHITE_PIECE : BLACK_PIECE;

    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    if (this.canCapture(fromRow, fromCol, fromRow + 2, fromCol + 2, player, opponent)) {
      this.setPiece(fromRow + 1, fromCol + 1, EMPTY_SQUARE);
    } else if (this.canCapture(fromRow, fromCol, fromRow + 2, fromCol - 2, player, opponent)) {
      this.setPiece(fromRow + 1, fromCol - 1, EMPTY_SQUARE);
    } else if (this.canCapture(fromRow, fromCol, fromRow - 2, fromCol + 2, player, opponent)) {
      this.setPiece(fromRow - 1, fromCol + 1, EMPTY_SQUARE);
    } else if (this.canCapture(fromRow, fromCol, fromRow - 2, fromCol - 2, player, opponent)) {
      this.setPiece(fromRow - 1, fromCol - 1, EMPTY_SQUARE);
    }

    this.setPiece(toRow, toCol, piece);
    this.setPiece(fromRow, fromCol, EMPTY_SQUARE);
    
    if (toRow === (player === BLACK_PIECE ? BOARD_SIZE - 1 : 0) && !king) {
      this.setPiece(toRow, toCol, player === BLACK_PIECE ? BLACK_KING : WHITE_KING);
    }
    
    if (!king && this.isMultiJump(toRow, toCol, toRow + 2, toCol + 2, player, opponent)) {
      return true;
    }
    
    this.turn = (this.turn === BLACK_PIECE) ? WHITE_PIECE : BLACK_PIECE;
    
    return true;
  } 
  
  getWinner() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const piece = this.getPiece(i, j);

        if (piece === BLACK_PIECE || piece === BLACK_KING) {
          blackCount++;
        } else if (piece === WHITE_PIECE || piece === WHITE_KING) {
          whiteCount++;
        }
      }
    }
  
    if (blackCount === 0) {
      return WHITE_PIECE;
    } else if (whiteCount === 0) {
      return BLACK_PIECE;
    }
  
    return null;
  }
}  
/*    
const game = new CheckersTest();
game.makeMove(2, 1, 3, 2);
game.makeMove(5, 0, 4, 1);
game.makeMove(3, 2, 5, 0);
console.log(game.getBoard().join("\n"));
*/

module.exports = { CheckersTest };
