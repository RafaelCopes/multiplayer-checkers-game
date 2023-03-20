import { Container, Piece } from "./styles";

interface ICellProps {
  colorize: number;
  piece: number;
  className: string;
  isSelected: boolean;
}

export default function Cell({ colorize, piece, className, isSelected }: ICellProps) : JSX.Element {
  if (colorize % 2 === 0) {
    if (piece === 1) {
      return (
        <Container isSelected={isSelected} cellColor="black">
          <Piece className={className} imageSrc={'./assets/black-checker/standard.png'} />
        </Container>
      );
    } else if (piece === 3) {
      return (
        <Container isSelected={isSelected} cellColor="black">
          <Piece className={className} imageSrc={'./assets/black-checker/king-me.png'} />
        </Container>
      );
    } else if (piece === 2) {
      return (
        <Container isSelected={isSelected} cellColor="black">
          <Piece className={className} imageSrc={'assets/red-checker/standard.png'} />
        </Container>
      );
    } else if (piece === 4) {
      return (
        <Container isSelected={isSelected} cellColor="black">
          <Piece className={className} imageSrc={'assets/red-checker/king-me.png'} />
        </Container>
      );
    } else {
      return (
        <Container isSelected={isSelected} className={className} cellColor="black" />
      );
    }
  }

  if (piece === 1) {
    return (
      <Container isSelected={isSelected} cellColor="red">
        <Piece className={className} imageSrc={'./assets/black-checker/standard.png'} />
      </Container>
    );
  } else if (piece === 3) {
    return (
      <Container isSelected={isSelected} cellColor="red">
        <Piece className={className} imageSrc={'./assets/black-checker/king-me.png'} />
      </Container>
    );
  } else if (piece === 2) {
    return (
      <Container isSelected={isSelected} cellColor="red">
        <Piece className={className} imageSrc={'assets/red-checker/standard.png'} />
      </Container>
    );
  } else if (piece === 4) {
    return (
      <Container isSelected={isSelected} cellColor="red">
        <Piece className={className} imageSrc={'assets/red-checker/king-me.png'} />
      </Container>
    );
  } else {
    return (
      <Container isSelected={isSelected} className={className} cellColor="red" />
    );
  }
}
