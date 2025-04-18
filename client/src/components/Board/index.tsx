import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cell from './Cell';
import { CapturedPiece, CapturedPieces, Container, Content, GameInfo, Message, Player, Wrapper, MessageArea, GameContent, WinnerMessage, BackButton } from './styles';

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

export default function Board({ socket }: any) { 
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [piece, setPiece] = useState<IPiece | null>(null);
  const [currentBoardState, setCurrentBoardState] = useState(INITIAL_BOARD_STATE);
  const [turn, setTurn] = useState<number | null>(null);
  const [player, setPlayer] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageKey, setMessageKey] = useState<number>(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<Array<{ toRow: number; toCol: number }> | null>(null);
  const [blackCapturesPieces, setBlackCapturesPieces] = useState<number>(0);
  const [redCapturesPieces, setRedCapturesPieces] = useState<number>(0);

  const boardRef = useRef<HTMLDivElement>(null);

  let board: IBoard = [];
  let colorize: number;

  useEffect(() => {
    if (roomId) {
      socket.emit('joinGame', roomId);
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
      if (!winner) {
        setMessage(null);
      }
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
     
    };
  }, [roomId, socket]);

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
          piece={currentBoardState[i][j]} 
          isValidMove={isValidMove}
        />
      );
    }
  }

  const movePiece = (e: any) => {
    let target = e.target;
  
      // Percorre a DOM para encontrar o elemento com os atributos de dados
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
  
    // Verifica se é vez do jogador ao clicar em uma peça
    if (clickedPiece !== 0 && (turn !== player || player === null)) {
      setMessage('Not your turn!');
      setMessageKey(prev => prev + 1);
      return;
    }
  
    if (piece === null) {
      // Nenhuma peça selecionada
      if (clickedPiece === 0) {
        return;
      } else if (player !== null && (clickedPiece === player || clickedPiece === player + 2)) {
        // Seleciona a peça e pega os movimentos válidos
        setPiece({ x, y });
        socket.emit('getValidMoves', { roomId, row: x, col: y });
      } else {
        // Peça do oponente
        setMessage('Not your piece!');
        setMessageKey(prev => prev + 1);
      }
    } else {
      // Já tem uma peça selecionada
      if (player !== null && (clickedPiece === player || clickedPiece === player + 2)) {
        // Muda a seleção para a nova peça
        setPiece({ x, y });
        socket.emit('getValidMoves', { roomId, row: x, col: y });
      } else {
        // Tenta fazer um movimento
        socket.emit('makeMove', {
          fromRow: piece.x,
          fromCol: piece.y,
          toRow: x,
          toCol: y,
        });
  
        // Desmarca a peça e limpa os movimentos válidos
        setPiece(null);
        setValidMoves(null);
      }
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container>
      {winner && (
        <WinnerMessage>
          {winner === 3 ? 'Draw! A player was left without valid moves.' : `Winner: Player ${winner === 1 ? 'Black' : 'Red'}!`}
          <BackButton onClick={handleBackToHome}>Back to Home</BackButton>
        </WinnerMessage>
      )}
      <GameContent>
        <GameInfo highlight={turn === player ? true : false}>
          {player !== null && (
            <>
              <Player>
                <h1>You</h1>
                <CapturedPiece color={player === 1 ? "black" : "red"} />
              </Player>
              <CapturedPieces>
                {Array.from({ length: player === 1 ? redCapturesPieces : blackCapturesPieces }).map((_, index) => (
                  <CapturedPiece key={index} color={player === 1 ? "red" : "black"} />
                ))}
              </CapturedPieces>
            </>
          )}
          <MessageArea>
            {message && <Message key={messageKey}>{message}</Message>}
          </MessageArea>
        </GameInfo>
        <Wrapper ref={boardRef}>
          <Content onMouseDown={(e: any) => movePiece(e)}>
            {board}
          </Content>
        </Wrapper>
        <GameInfo highlight={turn === (player === 1 ? 2: 1) ? true : false}>
          {turn ? (
            <>
              <Player>
                <h1>Opponent</h1>
                <CapturedPiece color={player === 1 ? "red" : "black"} />
              </Player>
              <CapturedPieces>
                {Array.from({ length: player === 1 ? blackCapturesPieces : redCapturesPieces }).map((_, index) => (
                  <CapturedPiece key={index} color={player === 1 ? "black" : "red"} />
                ))}
              </CapturedPieces>
            </>
          ) : <h1>Waiting for the opponent.</h1>
          }
        </GameInfo>
      </GameContent>
    </Container>
  );
}
