import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import Cell from "./Cell";
import { Container, Content, Wrapper } from "./styles";

let socket: any;
const ENDPOINT = 'http://localhost:3000';

const BOARD_SIZE = 8;

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

type IBoard = JSX.Element[];
type IPiece = {
  x: number,
  y: number,
}

export default function Board(): JSX.Element {
  let board: IBoard = [];
  let colorize: number;
  const boardRef = useRef<HTMLDivElement>(null)
  const [piece, setPiece] = useState<IPiece | null>(null)
  const [drawBoard, setDrawBoard] = useState(INITIAL_BOARD_STATE);
  const [turn, setTurn] = useState<IPiece | null>(null)

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
    /*const connectionOptions =  {
      "forceNew" : true,
      "reconnectionAttempts": "Infinity",
      "timeout" : 10000,
      "transports" : ["websocket"]
    }*/

    socket.on('game', (game: any) => {
      const {board, turn} = game;

      setDrawBoard(board);
      setTurn(turn);
      console.log(drawBoard)
      console.log(turn)
    })

    socket.on('message', (message: any) => {
      console.log(message)
    })

  }, [socket]);


  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      colorize = i + j + 1;
      //console.log(i, j)

      board.push(<Cell className={`${i} ${j}`} key={`${i}${j}`}  colorize={colorize} piece={drawBoard[i][j]} />);
    }
  }

  const grabPiece = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let classes = e.target.className.split(' ');
    let x, y

    if (classes.length === 2) {
      x = classes[0]
      y = classes[1]
    } else {
      x = classes[2]
      y = classes[3]
    }


    if (piece === null) {
      setPiece({x: Number.parseInt(x), y:Number.parseInt(y)})
    } else {
      console.log(`make move from ${piece.x} , ${piece.y} to ${x} , ${y}`)

      socket.emit('move', {
        fromRow: piece.x,
        fromCol: piece.y,
        toRow: Number.parseInt(x),
        toCol: Number.parseInt(y),
      });

      setPiece(null)
    }
  }

  return (
    <Container >
      <Wrapper ref={boardRef}>
        <Content onMouseDown={e => grabPiece(e)} >
          { board }
        </Content>
      </Wrapper>
    </Container>
  );
}
