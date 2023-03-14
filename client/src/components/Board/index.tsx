import { useRef, useState } from "react";
import Cell from "./Cell";
import { Container, Content, Wrapper } from "./styles";

const BOARD_SIZE = 8;

const INITIAL_BOARD_STATE = [
  [0, 1, 0, 3, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 4, 0, 2, 0]
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
  const [to, setTo] = useState<IPiece | null>(null)

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      colorize = i + j + 1;
      //console.log(i, j)

      board.push(<Cell className={`${i} ${j}`} key={`${i}${j}`}  colorize={colorize} piece={INITIAL_BOARD_STATE[i][j]} />);
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
      setPiece({x, y})
    } else {
      console.log(`make move from ${piece.x} , ${piece.y} to ${x} , ${y}`)
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
