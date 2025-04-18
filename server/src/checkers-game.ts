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
    const player =
      piece === BLACK_PIECE || piece === BLACK_KING ? BLACK_PIECE : RED_PIECE;
    const opponent = player === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    const rowDistance = toRow - fromRow;
    const colDistance = toCol - fromCol;

    // Para reis, permite mover qualquer número de quadrados diagonais
    if (king && Math.abs(rowDistance) === Math.abs(colDistance)) {
      // Verifica primeiro possíveis capturas
      const path = this.findCapturePath(
        fromRow,
        fromCol,
        toRow,
        toCol,
        player,
        opponent,
        king
      );
      if (path !== null) {
        return true; // Valid king capture move
      }

      // Garante que não haja peças entre as posições de origem e destino para movimentos normais
      const directionRow = rowDistance > 0 ? 1 : -1;
      const directionCol = colDistance > 0 ? 1 : -1;
      let currentRow = fromRow + directionRow;
      let currentCol = fromCol + directionCol;

      while (currentRow !== toRow && currentCol !== toCol) {
        if (this.getPiece(currentRow, currentCol) !== EMPTY_SQUARE) {
          return false; // Bloqueado por outra peça
        }
        currentRow += directionRow;
        currentCol += directionCol;
      }

      if (this.turn !== player) {
        return false;
      }

      return true; // Movimento válido de rei
    }

    // Movimento de peça normal (não rei, um quadrado diagonalmente para frente)
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

    // Verifica movimento de captura
    const path = this.findCapturePath(
      fromRow,
      fromCol,
      toRow,
      toCol,
      player,
      opponent,
      king
    );
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
        return path.slice(); // Encontrou um caminho de captura válido
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
            // Para a primeira captura, o rei pode olhar ao longo da diagonal
            let nextRow = currentRow + dRow;
            let nextCol = currentCol + dCol;

            while (!this.isOutOfBounds(nextRow, nextCol)) {
              const currentPiece = board[nextRow][nextCol];
              if (currentPiece === EMPTY_SQUARE) {
                nextRow += dRow;
                nextCol += dCol;
              } else if (
                currentPiece === opponent ||
                currentPiece === opponent + 2
              ) {
                // Encontrou uma peça oponente para capturar
                const landingRow = nextRow + dRow;
                const landingCol = nextCol + dCol;

                // Verifica se a posição de destino está vazia e dentro dos limites
                if (
                  !this.isOutOfBounds(landingRow, landingCol) &&
                  board[landingRow][landingCol] === EMPTY_SQUARE
                ) {
                  const key = `${landingRow},${landingCol}`;
                  if (!visited.has(key)) {
                    visited.add(key);

                    // Copia o tabuleiro
                    const newBoard = board.map(r => r.slice());
                    // Remove a peça capturada
                    newBoard[nextRow][nextCol] = EMPTY_SQUARE;
                    // Move o rei
                    newBoard[landingRow][landingCol] =
                      newBoard[currentRow][currentCol];
                    newBoard[currentRow][currentCol] = EMPTY_SQUARE;

                    const newPath = path.slice();
                    const result = dfs(
                      landingRow,
                      landingCol,
                      newBoard,
                      newPath,
                      false
                    ); // Não é a primeira captura
                    if (result) {
                      return result;
                    }

                    visited.delete(key);
                  }
                }
                break; // Não pode capturar múltiplas peças em uma direção sem pular
              } else {
                // Bloqueado por sua própria peça
                break;
              }
            }
          } else {
            // Para novas capturas na sequência, o rei só pode capturar peças oponentes adjacentes
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
                const key = `${landingRow},${landingCol}`;
                if (!visited.has(key)) {
                  visited.add(key);

                  // Copia o tabuleiro
                  const newBoard = board.map(r => r.slice());
                  // Remove a peça capturada
                  newBoard[midRow][midCol] = EMPTY_SQUARE;
                  // Move o rei
                  newBoard[landingRow][landingCol] =
                    newBoard[currentRow][currentCol];
                  newBoard[currentRow][currentCol] = EMPTY_SQUARE;

                  const newPath = path.slice();
                  const result = dfs(
                    landingRow,
                    landingCol,
                    newBoard,
                    newPath,
                    false
                  ); // Ainda não é a primeira captura
                  if (result) {
                    return result;
                  }

                  visited.delete(key);
                }
              }
            }
          }
        } else {
          // Para peças normais
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
              // Impedir captura para a frente para a primeira captura
              if (firstCapture) {
                const dRowCapture = landingRow - currentRow;
                const forwardDirection = player === BLACK_PIECE ? 2 : -2;
                if (dRowCapture !== forwardDirection) {
                  continue; // Pular esta captura como não é para a frente
                }
              }

              const key = `${landingRow},${landingCol}`;
              if (!visited.has(key)) {
                visited.add(key);

                // Copia o tabuleiro
                const newBoard = board.map(r => r.slice());
                // Remove a peça capturada
                newBoard[midRow][midCol] = EMPTY_SQUARE;
                // Move a peça
                newBoard[landingRow][landingCol] =
                  newBoard[currentRow][currentCol];
                newBoard[currentRow][currentCol] = EMPTY_SQUARE;

                const newPath = path.slice();
                const result = dfs(
                  landingRow,
                  landingCol,
                  newBoard,
                  newPath,
                  false // Depois da primeira captura
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

    const initialBoard = this.board.map(r => r.slice());
    return dfs(fromRow, fromCol, initialBoard, [], true); // firstCapture = true
  }

  makeMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    const piece = this.getPiece(fromRow, fromCol);
    const king = piece === BLACK_KING || piece === RED_KING;
    const player =
      piece === BLACK_PIECE || piece === BLACK_KING ? BLACK_PIECE : RED_PIECE;
    const opponent = player === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    const rowDistance = Math.abs(toRow - fromRow);
    const colDistance = Math.abs(toCol - fromCol);

    if (rowDistance === 1 && colDistance === 1) {
      // Movimento simples
      this.setPiece(toRow, toCol, piece);
      this.setPiece(fromRow, fromCol, EMPTY_SQUARE);
    } else {
      // Movimento de captura
      const path = this.findCapturePath(
        fromRow,
        fromCol,
        toRow,
        toCol,
        player,
        opponent,
        king
      );
      if (path !== null) {
        // Move a peça ao longo do caminho e captura peças
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
              this.setPiece(midRow, midCol, EMPTY_SQUARE); // Remove a peça capturada
              captured = true;
              break; // Parar após remover uma peça
            } else if (midPiece !== EMPTY_SQUARE) {
              // Movimento bloqueado por outra peça
              return false;
            }
            midRow += stepRow;
            midCol += stepCol;
          }

          // Certifique-se de que uma peça foi capturada; se não, o movimento é inválido
          if (!captured) {
            return false;
          }

          // Move a peça para a próxima posição
          this.setPiece(currentRow, currentCol, piece);
          this.setPiece(prevRow, prevCol, EMPTY_SQUARE);
        }
      } else if (
        king &&
        Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol)
      ) {
        // Rei movendo vários quadrados sem capturar
        this.setPiece(toRow, toCol, piece);
        this.setPiece(fromRow, fromCol, EMPTY_SQUARE);
      } else {
        // Movimento inválido
        return false;
      }
    }

    // Coroa a peça se chegar à última linha
    if (
      !king &&
      ((player === BLACK_PIECE && toRow === BOARD_SIZE - 1) ||
        (player === RED_PIECE && toRow === 0))
    ) {
      this.setPiece(
        toRow,
        toCol,
        player === BLACK_PIECE ? BLACK_KING : RED_KING
      );
    }

    // Troca de turno
    this.turn = this.turn === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    return true;
  }

  hasValidMoves(player: number): boolean {
    const opponent = player === BLACK_PIECE ? RED_PIECE : BLACK_PIECE;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.getPiece(row, col);

        if (piece === player || piece === player + 2) {
          // Peça regular ou Rei
          const isKing = piece === BLACK_KING || piece === RED_KING;

          // Verifica todas as direções possíveis
          const directions = [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ];

          for (const [dRow, dCol] of directions) {
            const toRow = row + dRow;
            const toCol = col + dCol;

            // Movimento simples
            if (
              !this.isOutOfBounds(toRow, toCol) &&
              this.getPiece(toRow, toCol) === EMPTY_SQUARE
            ) {
              // Para peças normais, certifica de que o movimento é para a frente
              if (!isKing) {
                const forwardDirection = player === BLACK_PIECE ? 1 : -1;
                if (dRow !== forwardDirection) {
                  continue;
                }
              }
              return true; // Encontrou um movimento válido simples
            }

            // Movimento de captura
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
                midPiece === opponent + 2 // Peça oponente ou rei
              ) {
                // Para peças normais, certifica de que a captura é para a frente
                if (!isKing) {
                  const forwardDirection = player === BLACK_PIECE ? 1 : -1;
                  if (dRow !== forwardDirection) {
                    continue;
                  }
                }
                return true; // Encontrou um movimento de captura válido
              }
            }
          }
        }
      }
    }

    return false; // Nenhum movimento válido encontrado
  }

  getValidMovesForPiece(
    row: number,
    col: number
  ): Array<{ toRow: number; toCol: number }> {
    if (this.isOutOfBounds(row, col)) return [];

    const piece = this.getPiece(row, col);
    if (piece === EMPTY_SQUARE) return [];

    const isKing = piece === BLACK_KING || piece === RED_KING;
    const player =
      piece === BLACK_PIECE || piece === BLACK_KING ? BLACK_PIECE : RED_PIECE;

    // Certifica de que é a vez do jogador
    if (this.turn !== player) return [];

    const validMoves: Array<{ toRow: number; toCol: number }> = [];

    // Itera sobre todas as posições de destino possíveis
    for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
      for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
        // Pula a posição atual
        if (toRow === row && toCol === col) continue;

        // Verifica se mover para (toRow, toCol) é válido
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

    // Verifica se algum jogador não tem peças restantes
    if (blackCount === 0) {
      return RED_PIECE; // Vermelho vence
    } else if (redCount === 0) {
      return BLACK_PIECE; // Preto vence
    }

    // Verifica se o próximo jogador tem algum movimento válido
    const nextPlayer = this.turn;
    if (!this.hasValidMoves(nextPlayer)) {
      console.log(`Player ${nextPlayer} has no valid moves.`);
      return 3; // Empate
    }

    return null; // O jogo continua
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
      red: 12 - redCount,
    };

    return capturedPieces;
  }

  getBoard() {
    return this.board;
  }

  getTurn() {
    return this.turn;
  }
}
