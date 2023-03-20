import styled from "styled-components";

interface IContainerProps {
  cellColor: 'red' | 'black';
  isSelected: boolean;
}

interface IPieceProps {
  imageSrc: string;
}

const cellColorSelector = {
  black: '#0d0a02',
  red: 'red',
}

export const Piece = styled.div<IPieceProps>`
  background-image: url(${({ imageSrc }) => imageSrc});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px;
  width: 72px;
  height: 72px;
`;

export const Container = styled.div<IContainerProps>`
  height: 72px;
  width: 72px;

  background: ${({ cellColor, isSelected }) => {
    if (isSelected) {  
      return 'dimgray';
    } else {
      return cellColorSelector[cellColor];
    }
  } };

  display: flex;
  justify-content: center;
  align-items: center;
`;
