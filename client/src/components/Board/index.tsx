import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import Cell from "./Cell";
import { Container, Content, GameInfo, Message, Wrapper } from "./styles";

let socket: any;
const ENDPOINT = 'http://localhost:3333';

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
  x: number,
  y: number,
};

export default function Board(): any {
  const [piece, setPiece] = useState<IPiece | null>(null);
  const [currentBoardState, setCurrentBoardState] = useState(INITIAL_BOARD_STATE);
  const [turn, setTurn] = useState<number | null>(null);
  const [player, setPlayer] = useState<number | null>(null);
  const [message, setMessage] = useState<String | null>(null);
  const [winner, setWinner] = useState<number | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  let board: IBoard = [];
  let colorize: number;

  useEffect(() => {
    /*const connectionOptions =  {
      "forceNew" : true,
      "reconnectionAttempts": "Infinity",
      "timeout" : 10000,
      "transports" : ["websocket"]
    }*/
    socket = io(ENDPOINT);
  }, []);

  useEffect(() => {
    socket.on('initializeGameState', (game: any) => {
      const { board, turn } = game;

      setCurrentBoardState(board);
      setTurn(turn);
    });

    socket.on('updateGameState', (game: any) => {
      const { board, turn } = game;

      setCurrentBoardState(board);
      setTurn(turn);
      setMessage(null);
      setWinner(null);
    })

    socket.on('getPlayer', (player: any) => {
      setPlayer(player);
    })

    socket.on('getMessage', (message: any) => {
      setMessage(message);
    })

    socket.on('getWinner', (data: any) => {
      const { winner } = data;
      setWinner(winner);
    })
  }, [socket]);

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      colorize = i + j + 1;

      board.push(<Cell
        className={`${i} ${j}`}
        key={`${i}${j}`}
        isSelected={piece && currentBoardState[i][j] !== 0 ? piece.x === i && piece.y === j : false}
        colorize={colorize}
        piece={currentBoardState[i][j]}
      />);
    }
  }

  const movePiece = (e: any) => {
    if (turn !== player) {
      setMessage('Not your turn!');
      return;
    }

    let classes = e.target.className.split(' ');
    let x: string;
    let y: string;

    if (classes.length === 2) {
      x = classes[0];
      y = classes[1];
    } else {
      x = classes[2];
      y = classes[3];
    }

    if (piece === null) {
      setPiece({x: Number.parseInt(x), y: Number.parseInt(y)});
    } else {

      if (piece) {
        if (currentBoardState[piece.x][piece.y] !== player && currentBoardState[piece.x][piece.y] !== player + 2) {
          setMessage('Not your piece!')
          setPiece(null);
          return;
        }

        socket.emit('makeMove', {
          fromRow: piece.x,
          fromCol: piece.y,
          toRow: Number.parseInt(x),
          toCol: Number.parseInt(y),
        });
      }

      setPiece(null);
    }
  }

  return (
    <Container>
      <GameInfo>
        {message && <Message>Warning: {message}</Message>}
        {winner && <h1>Winner: Player {winner}!</h1>}
        {player && <h1>You are player {player}!</h1>}
        {player && <h1>You play with the {player === 1 ? 'Black' : 'Red'} pieces!</h1>}
        {turn ? <h1>Current turn: Player {turn}.</h1> : <h1>Waiting for opponent!</h1>}
      </GameInfo>
      <Wrapper ref={boardRef}>
        <Content onMouseDown={(e: any) => movePiece(e)} >
          { board }
        </Content>
      </Wrapper>
    </Container>
  );
}
