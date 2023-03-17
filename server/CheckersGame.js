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
      //const forward = (player === BLACK_PIECE) ? 1 : -1;

      //if (this.canCapture(fromRow, fromCol, toRow, toCol, player, opponent)) {
        //return true;
      //}

      if (Math.abs(toRow - fromRow) === 1 || Math.abs(toCol - fromCol) === 1) {
        return true;
      }
    } else {
      const forward = (player === BLACK_PIECE) ? 1 : -1;
      // ????????????????????????????????????????????
      // 3 4 2 3
      
      //console.log(toRow - fromRow)
      //console.log(Math.abs(toCol - fromCol))

      if (toRow - fromRow === forward && Math.abs(toCol - fromCol) === 1) {
        return true;
      }
    }

    if (this.canCapture(fromRow, fromCol, toRow, toCol, player, opponent)) {
      return true;
    }

    //if (this.isMultiJump(fromRow, fromCol, toRow, toCol, player, opponent)) {
      //console.log('mullllllllllti jumppppppppp')
      //return true;
    //}

    return false;
  }

  canCapture(fromRow, fromCol, toRow, toCol, player, opponent) {
    if (this.isOutOfBounds(toRow, toCol)) return false;

    /*const jumpRow = fromRow + 2 * (toRow - fromRow);
    const jumpCol = fromCol + 2 * (toCol - fromCol);

    if (jumpRow < 0 || jumpRow >= BOARD_SIZE || jumpCol < 0 || jumpCol >= BOARD_SIZE) {
      console.log(' OUT OF BOUNDS!!!!!!')
      return false;
    }*/

    const forward = (player === BLACK_PIECE) ? 1 : -1;

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

  isMultiJump(fromRow, fromCol, toRow, toCol, player, opponent) {
    for (let i = -2; i <= 2; i += 4) {
      for (let j = -2; j <= 2; j += 4) {
        const jumpRow = fromRow + i;
        const jumpCol = fromCol + j;
        if (
          this.isValidMove(fromRow, fromCol, jumpRow, jumpCol) && 
          this.canCapture(fromRow, fromCol, jumpRow, jumpCol, player, opponent) &&
          this.isValidMove(jumpRow, jumpCol, toRow, toCol)) {
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

    // ?????????????
    /*if (this.canCapture(toRow, toCol, toRow + 2, toCol + 2, player, opponent)) {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      this.setPiece(fromRow + 1, fromCol + 1, EMPTY_SQUARE);
    } else if (this.canCapture(toRow, toCol, toRow + 2, toCol - 2, player, opponent)) {
      console.log('bbbbbbbbbbbbbbbbbbbbbbbbbb')
      
      this.setPiece(fromRow + 1, fromCol - 1, EMPTY_SQUARE);
    } else if (this.canCapture(toRow, toCol, toRow - 2, toCol + 2, player, opponent)) {
      console.log('ccccccccccccccccccccccccccccc')

      this.setPiece(fromRow - 1, fromCol + 1, EMPTY_SQUARE);
    } else if (this.canCapture(toRow, toCol, toRow - 2, toCol - 2, player, opponent)) {
      console.log('dddddddddddddddddddddddddddddd')

      this.setPiece(fromRow - 1, fromCol - 1, EMPTY_SQUARE);
    }*/

    /*if (!queen && this.isMultiJump(toRow, toCol, toRow + 2, toCol + 2, player, opponent)) {
      return true;
    }*/
    
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
    } //else if (this.getValidMoves().length === 0) {
      // if there are no valid moves for the current player, the other player wins
      //return (this.turn === BLACK_PIECE) ? RED_PIECE : BLACK_PIECE;
    //}
    
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