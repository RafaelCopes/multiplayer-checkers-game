const BOARD_SIZE = 8;
const EMPTY_SQUARE = 0;
const BLACK_PIECE = 1;
const WHITE_PIECE = 2;
const BLACK_KING = 3;
const WHITE_KING = 4;

const INITIAL_BOARD_STATE = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0]
];

class Checkers {
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

  isValidMove(fromRow, fromCol, toRow, toCol) {
    // get the moved piece
    const piece = this.getPiece(fromRow, fromCol);
    // check if piece is a king
    const king = (piece === BLACK_KING || piece === WHITE_KING);
    // get player
    const player = (piece === BLACK_PIECE || piece === BLACK_KING) ? BLACK_PIECE : WHITE_PIECE;
    // get opponent
    const opponent = (piece === BLACK_PIECE || piece === BLACK_KING) ? WHITE_PIECE : BLACK_PIECE;
    
    // check if selected destination squate is empty
    // else invalid move
    console.log('\n\n\n\n')
    console.log('piece: '  + piece)
    console.log('player: ' + player)
    console.log('opponent: ' + opponent)

    if (this.getPiece(toRow, toCol) !== EMPTY_SQUARE) {
      return false;
    }

    if (king) {
      if (Math.abs(toRow - fromRow) !== 2 || Math.abs(toCol - fromCol) !== 2) {
        return false;
      }
    } else {
      const forward = (player === BLACK_PIECE) ? 1 : -1;
      // ????????????????????????????????????????????
      if (!this.canCapture(fromRow, fromCol, toRow, toCol, player, opponent)) {
        if (toRow - fromRow !== forward || Math.abs(toCol - fromCol) !== 1) {
          return false;
        }
      }
    }

    if (this.isMultiJump(fromRow, fromCol, toRow, toCol, player, opponent)) {
      console.log('mullllllllllti jumppppppppp')
      return true;
    }

    return false;
  }

  canCapture(fromRow, fromCol, toRow, toCol, player, opponent) {
    /*const jumpRow = fromRow + 2 * (toRow - fromRow);
    const jumpCol = fromCol + 2 * (toCol - fromCol);

    if (jumpRow < 0 || jumpRow >= BOARD_SIZE || jumpCol < 0 || jumpCol >= BOARD_SIZE) {
      console.log(' OUT OF BOUNDS!!!!!!')
      return false;
    }*/
    console.log('-------------');
    console.log(fromRow);
    console.log(fromCol);
    console.log(toRow);
    console.log(toCol);
    console.log(player);
    console.log(opponent);
    console.log(fromRow + (toRow - fromRow) / 2, fromCol + (toCol - fromCol) / 2);

    const forward = (player === BLACK_PIECE) ? 1 : -1;
    console.log(forward);
    console.log(this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + (toCol - fromCol) / 2))
    console.log(fromCol + ((toCol - fromCol) / 2))
    console.log('------------');


    if (this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + (toCol - fromCol) / 2) === EMPTY_SQUARE) {
      console.log('enter')
      
      return false;
    }
    console.log('not enter')
    const middlePiece = this.getPiece(fromRow + (toRow - fromRow) / 2, fromCol + (toCol - fromCol) / 2);

    console.log('middle piece: ' + middlePiece)

    if (middlePiece !== opponent && middlePiece !== opponent + 1) {
      return false;
    }

    this.setPiece(fromRow + (toRow - fromRow) / 2, fromCol + ((toCol - fromCol) / 2), EMPTY_SQUARE);

    return true;
  }

  isMultiJump(fromRow, fromCol, toRow, toCol, player, opponent) {
    console.log('------multijump-------');
    console.log(fromRow)
    console.log(fromCol)
    console.log(toRow)
    console.log(toCol)
    console.log(player)
    console.log(opponent)

    console.log('jumps::::::::')

    for (let i = -2; i <= 2; i += 4) {
      for (let j = -2; j <= 2; j += 4) {
        console.log(fromRow + i);
        console.log(fromCol + j);
      }
    }

    console.log('------multijump-------');
    
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
    const king = (piece === BLACK_KING || piece === WHITE_KING);
    const player = (piece === BLACK_PIECE || piece === BLACK_KING) ? BLACK_PIECE : WHITE_PIECE;
    const opponent = (piece === BLACK_PIECE || piece === BLACK_KING) ? WHITE_PIECE : BLACK_PIECE;

    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }
    console.log("0000000000000000000000000")
    this.setPiece(toRow, toCol, piece);
    this.setPiece(fromRow, fromCol, EMPTY_SQUARE);

    // make king
    if (toRow === (player === BLACK_PIECE ? BOARD_SIZE - 1 : 0) && !king) {
      this.setPiece(toRow, toCol, player === BLACK_PIECE ? BLACK_KING : WHITE_KING);
    }

    console.log('1111111111111111111111111111')
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

    /*if (!king && this.isMultiJump(toRow, toCol, toRow + 2, toCol + 2, player, opponent)) {
      return true;
    }*/
    
    this.turn = (this.turn === BLACK_PIECE) ? WHITE_PIECE : BLACK_PIECE;

    return true;
  }
  
  /*getWinner() {
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
    } else if (this.getValidMoves().length === 0) {
      // if there are no valid moves for the current player, the other player wins
      return (this.turn === BLACK_PIECE) ? WHITE_PIECE : BLACK_PIECE;
    }
    
    return null;

  }*/

  getBoard() {
    return this.board;
  }

  getTurn() {
    return this.turn;
  }
}

/*const game = new Checkers();
game.makeMove(2, 1, 3, 0);
game.makeMove(5, 2, 4, 1);
game.makeMove(2, 7, 3, 6);
game.makeMove(3, 0, 5, 2);
game.makeMove(6, 3, 4, 1);
game.makeMove(3, 6, 4, 7);
game.makeMove(4, 1, 3, 2);
game.makeMove(2, 3, 4, 1);
game.makeMove(5, 0, 3, 2);
game.makeMove(1, 4, 2, 3);
game.makeMove(2, 3, 4, 1);
game.makeMove(6, 1, 5, 2);
game.makeMove(4, 1, 6, 3);
game.makeMove(5, 4, 4, 5);
game.makeMove(7, 2, 5, 4);
game.makeMove(4, 5, 3, 6);
game.makeMove(1, 2, 2, 3);
game.makeMove(2, 3, 3, 4);
game.makeMove(5, 6, 4, 5);
game.makeMove(0, 1, 1, 2);
game.makeMove(1, 0, 2, 1);
//game.makeMove(4, 5, 2, 3);
game.makeMove(4, 5, 0, 1);

console.log(game.getTurn())
console.log(game.getBoard().join("\n"));

/*
[
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0]
];
*/

const game = new Checkers();
game.makeMove(2, 5, 3, 4);
//game.makeMove(5, 6, 4, 5);
//game.makeMove(3, 4, 5, 6);
console.log(game.getBoard().join("\n"));


module.exports = {Checkers};

/*

0,1,0,1,0,1,0,1
1,0,1,0,0,0,1,0
0,0,0,0,0,1,0,0
0,0,0,0,0,0,0,0
0,0,0,0,0,2,0,1
0,0,0,0,2,0,2,0
0,0,0,0,0,2,0,2
2,0,0,0,2,0,2,0





0,0,0,1,0,1,0,1
0,0,1,0,0,0,1,0
0,1,0,0,0,1,0,0
0,0,0,0,1,0,2,0
0,0,0,0,0,2,0,1
0,0,0,0,2,0,0,0
0,0,0,0,0,2,0,2
2,0,0,0,2,0,2,0


*/