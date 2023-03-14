import Cell from "./Cell";
import { Container, Content, Wrapper } from "./styles";

const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];
const BOARD_SIZE = 8;
const INITIAL_BOARD_STATE = [
  [0, 1, 0, 3, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 2, 0, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 2],
  [2, 0, 2, 0, 4, 0, 2, 0]
];

type IBoard = JSX.Element[];

let activePiece: HTMLElement | null = null;

const grabPiece = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const element = e.target as HTMLElement;

  if (element.tagName === 'IMG') {
    activePiece = element;
  }

  console.log(activePiece)
}

const dropPiece = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  if (activePiece) {
    activePiece = null;
  }

  console.log(activePiece)
}


export default function Board(): JSX.Element {
  let board: IBoard = [];
  let colorize: number;

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      colorize = i + j + 1;
      console.log(INITIAL_BOARD_STATE[i][j])

      board.push(<Cell key={`${i}${j}`} colorize={colorize} piece={INITIAL_BOARD_STATE[i][j]} />);
    }
  }

  return (
    <Container>
      <Wrapper>
        <Content onMouseDown={e => grabPiece(e)}>
          { board }
        </Content>
      </Wrapper>
    </Container>
  );
}
