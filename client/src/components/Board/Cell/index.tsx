import { Container, Piece } from "./styles";

interface ICellProps {
  colorize: number;
  piece: number;
  isSelected: boolean;
  isValidMove: boolean;
  row: number;
  col: number;
}

export default function Cell({ colorize, piece, isSelected, isValidMove, row, col }: ICellProps) : JSX.Element {
  const cellType = colorize % 2 === 0 ? "light" : "dark";
  const imageSrc = piece === 1 ? '/assets/black-checker/standard.svg' : piece === 3 ? '/assets/black-checker/king-me.svg' : piece === 2 ? '/assets/red-checker/standard.svg' : piece === 4 ? '/assets/red-checker/king-me.svg' : '';

  return (
    <Container data-row={row} data-col={col} isSelected={isSelected} cellColor={cellType} isValidMove={isValidMove}>
      <Piece data-row={row} data-col={col} imageSrc={imageSrc} />
    </Container>
  );
}