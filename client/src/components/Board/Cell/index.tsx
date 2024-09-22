import { Container, Piece } from "./styles";

interface ICellProps {
  colorize: number;
  piece: number;
  isSelected: boolean;
  isValidMove: boolean;
  row: number;
  col: number;
}

export default function Cell({ colorize, piece, className, isSelected, isValidMove, row, col }: ICellProps) : JSX.Element {
  if (colorize % 2 === 0) {
    if (piece === 1) {
      return (
        <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="black" isValidMove={isValidMove}>
          <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/black-checker/standard.svg'} />
        </Container>
      );
    } else if (piece === 3) {
      return (
        <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="black" isValidMove={isValidMove}>
          <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/black-checker/king-me.svg'} />
        </Container>
      );
    } else if (piece === 2) {
      return (
        <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="black" isValidMove={isValidMove}>
          <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/red-checker/standard.svg'} />
        </Container>
      );
    } else if (piece === 4) {
      return (
        <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="black" isValidMove={isValidMove}>
          <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/red-checker/king-me.svg'} />
        </Container>
      );
    } else {
      return (
        <Container data-row={row} data-col={col} isSelected={isSelected} className={className} cellColor="black" isValidMove={isValidMove} />
      );
    }
  }

  if (piece === 1) {
    return (
      <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="red" isValidMove={isValidMove}>
        <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/black-checker/standard.svg'} />
      </Container>
    );
  } else if (piece === 3) {
    return (
      <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="red" isValidMove={isValidMove}>
        <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/black-checker/king-me.svg'} />
      </Container>
    );
  } else if (piece === 2) {
    return (
      <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="red" isValidMove={isValidMove}>
        <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/red-checker/standard.svg'} />
      </Container>
    );
  } else if (piece === 4) {
    return (
      <Container data-row={row} data-col={col} isSelected={isSelected} cellColor="red" isValidMove={isValidMove}>
        <Piece data-row={row} data-col={col} className={className} imageSrc={'/assets/red-checker/king-me.svg'} />
      </Container>
    );
  } else {
    return (
      <Container data-row={row} data-col={col} isSelected={isSelected} className={className} cellColor="red" isValidMove={isValidMove} />
    );
  }
}
