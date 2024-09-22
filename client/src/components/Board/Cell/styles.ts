import styled from "styled-components";

interface IContainerProps {
  cellColor: 'red' | 'black';
  isSelected: boolean;
  isValidMove: boolean;
}

interface IPieceProps {
  imageSrc: string;
}

const cellColorSelector = {
  black: '#403737',
  red: '#d12121',
}

export const Piece = styled.div<IPieceProps>`
  background-image: url(${({ imageSrc }) => imageSrc});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px;
  width: 72px;
  height: 72px;

  cursor: pointer;
`;

export const Container = styled.div<IContainerProps>`
  height: 72px;
  width: 72px;

  background: ${({ cellColor, isSelected, isValidMove }) => {
    if (isValidMove) {
      return 'gold';
    }

    if (isSelected) {  
      return 'dimgray';
    } else {
      return cellColorSelector[cellColor];
    }

  } };

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 3px solid grey;
  }
`;
