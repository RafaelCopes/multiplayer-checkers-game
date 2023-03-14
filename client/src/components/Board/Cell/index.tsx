import { Container } from "./styles";

interface ICellProps {
  colorize: number;
  piece: number;
}

export default function Cell({ colorize, piece }: ICellProps) : JSX.Element {
  if (colorize % 2 === 0) {
    if (piece === 1) {
      return (
        <Container cellColor="black">
          <img src='./assets/black-checker/standard.png' alt="black-checker" />
        </Container>
      );
    } else if (piece === 3) {
      return (
        <Container cellColor="black">
          <img src='./assets/black-checker/king-me.png' alt="black-checker" />
        </Container>
      );
    } else if (piece === 2) {
      return (
        <Container cellColor="black">
          <img src='assets/red-checker/standard.png' alt="red-checker" />
        </Container>
      );
    } else if (piece === 4) {
      return (
        <Container cellColor="black">
          <img src='assets/red-checker/king-me.png' alt="red-checker" />
        </Container>
      );
    } else {
      return (
        <Container cellColor="black" />
      );
    }
  }

  if (piece === 1) {
    return (
      <Container cellColor="red">
        <img src='./assets/black-checker/standard.png' alt="black-checker" />
      </Container>
    );
  } else if (piece === 3) {
    return (
      <Container cellColor="red">
        <img src='./assets/black-checker/king-me.png' alt="black-checker" />
      </Container>
    );
  } else if (piece === 2) {
    return (
      <Container cellColor="red">
        <img src='assets/red-checker/standard.png' alt="red-checker" />
      </Container>
    );
  } else if (piece === 4) {
    return (
      <Container cellColor="red">
        <img src='assets/red-checker/king-me.png' alt="red-checker" />
      </Container>
    );
  } else {
    return (
      <Container cellColor="red" />
    );
  }
}
