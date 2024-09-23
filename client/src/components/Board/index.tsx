import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cell from './Cell';
import { CapturedPiece, CapturedPieces, Container, Content, GameInfo, Message, Player, Wrapper } from './styles';

const BOARD_SIZE = 8;

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

type IBoard = any[];

type IPiece = {
  x: number;
  y: number;
};

export default function Board({ socket }: any) { // Accept the socket as a prop
  const { roomId } = useParams(); // Get room ID from URL
  const [piece, setPiece] = useState<IPiece | null>(null);
  const [currentBoardState, setCurrentBoardState] = useState(INITIAL_BOARD_STATE);
  const [turn, setTurn] = useState<number | null>(null);
  const [player, setPlayer] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<Array<{ toRow: number; toCol: number }> | null>(null);
  const [blackCapturesPieces, setBlackCapturesPieces] = useState<number>(0);
  const [redCapturesPieces, setRedCapturesPieces] = useState<number>(0);

  const boardRef = useRef<HTMLDivElement>(null);

  let board: IBoard = [];
  let colorize: number;

  useEffect(() => {
    if (roomId) {
      socket.emit('joinGame', roomId); // Use the existing socket and roomId to join the correct room
    }

    socket.on('initializeGameState', (game: any) => {
      const { board, turn } = game;
      console.log('initializeGameState');
      setCurrentBoardState(board);
      setTurn(turn);
    });

    socket.on('updateGameState', (game: any) => {
      const { board, turn, capturedPieces } = game;
      console.log('updateGameState');
      setCurrentBoardState(board);
      setTurn(turn);
      setBlackCapturesPieces(capturedPieces.black);
      setRedCapturesPieces(capturedPieces.red);
      setMessage(null);
      setWinner(null);
    });

    socket.on('validMoves', (data: any) => {
      const { validMoves } = data;

      console.log(validMoves);

      setValidMoves(validMoves);
    });

    socket.on('getPlayer', (player: any) => {
      setPlayer(player);
    });

    socket.on('getMessage', (message: any) => {
      setMessage(message);
    });

    socket.on('getWinner', (data: any) => {
      const { winner } = data;
      setWinner(winner);
    });

    return () => {
      // Do not disconnect the socket here; the socket persists throughout the app
    };
  }, [roomId, socket]);

  // Render the board cells
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      colorize = i + j + 1;

      const isValidMove =
      validMoves?.some((move) => move.toRow === i && move.toCol === j) || false;

      board.push(
        <Cell
          key={`${i}${j}`}
          row={i}
          col={j}
          isSelected={piece && currentBoardState[i][j] !== 0 ? piece.x === i && piece.y === j : false}
          colorize={colorize}
          piece={currentBoardState[i][j]} // Ensure the correct piece data is passed
          isValidMove={isValidMove}
        />
      );
    }
  }

  const movePiece = (e: any) => {
    if (turn !== player) {
      setMessage('Not your turn!');
      return;
    }
  
    let target = e.target;
  
    // Traverse up the DOM tree to find the element with data attributes
    while (target && !target.dataset.row) {
      target = target.parentNode;
    }
  
    if (!target || !target.dataset.row || !target.dataset.col) {
      return;
    }
  
    const x = parseInt(target.dataset.row, 10);
    const y = parseInt(target.dataset.col, 10);
  
    if (isNaN(x) || isNaN(y)) {
      return;
    }
  
    const clickedPiece = currentBoardState[x][y];
  
    if (piece === null) {
      // No piece currently selected
      if (clickedPiece === player || clickedPiece === player + 2) {
        // Select the piece and get valid moves
        setPiece({ x, y });
        socket.emit('getValidMoves', { roomId, row: x, col: y });
      } else {
        setMessage('Not your piece!');
      }
    } else {
      // A piece is already selected
      if (clickedPiece === player || clickedPiece === player + 2) {
        // Change selection to the new piece
        setPiece({ x, y });
        socket.emit('getValidMoves', { roomId, row: x, col: y });
      } else {
        // Attempt to make a move
        socket.emit('makeMove', {
          fromRow: piece.x,
          fromCol: piece.y,
          toRow: x,
          toCol: y,
        });
  
        // Unselect the piece and clear valid moves
        setPiece(null);
        setValidMoves(null);
      }
    }
  };
  

  return (
    <Container>
      <GameInfo highlight={turn === player ? true : false}>
        {winner && (winner === 3 ? <h1>Draw! A player was left without valid moves.</h1> : <h1>Winner: Player {winner}!</h1>)}
        {player && (
          <Player>
            <h1>You</h1>
            <CapturedPiece color={player === 1 ? "black" : "red"} />
          </Player>
        )}
        <CapturedPieces>
          {Array.from({ length: player === 1 ? redCapturesPieces : blackCapturesPieces }).map((_, index) => (
            <CapturedPiece key={index} color={player === 1 ? "red" : "black"} />
          ))}
        </CapturedPieces>
        {message && <Message>Warning: {message}</Message>}
      </GameInfo>
      <Wrapper ref={boardRef}>
        <Content onMouseDown={(e: any) => movePiece(e)}>
          {board}
        </Content>
      </Wrapper>
      <GameInfo highlight={turn === (player === 1 ? 2: 1) ? true : false}>
        {winner && (winner === 3 ? <h1>Draw! A player was left without valid moves.</h1> : <h1>Winner: Player {winner}!</h1>)}
        {turn ? (
          <Player>
            <h1>Opponent</h1>
            <CapturedPiece color={player === 1 ? "red" : "black"} />
          </Player>
        ) : <h1>Waiting for the opponent.</h1>
        }
        <CapturedPieces>
          {Array.from({ length: player === 1 ? blackCapturesPieces : redCapturesPieces  }).map((_, index) => (
            <CapturedPiece key={index} color={player === 1 ? "black" : "red"} />
          ))}
        </CapturedPieces>
      </GameInfo>
    </Container>
  );
}
