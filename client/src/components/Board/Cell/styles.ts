import styled from "styled-components";

const colors = {
  darkSquare: '#1f2328',
  lightSquare: '#c70039',
  selectedSquare: '#5a6169',
  validMoveSquare: 'rgba(255, 215, 0, 0.7)', 
  hoverOutline: '#ff195d',
  pieceShadow: 'rgba(0, 0, 0, 0.4)',
};

interface IContainerProps {
  cellColor: 'light' | 'dark';
  isSelected: boolean;
  isValidMove: boolean;
}

interface IPieceProps {
  imageSrc: string;
}

const cellColorSelector = {
  dark: colors.darkSquare,
  light: colors.lightSquare,
}

export const Piece = styled.div<IPieceProps>`
  background-image: url(${({ imageSrc }) => imageSrc});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%; 
  height: 100%;
  width: 100%;
  cursor: pointer;
  pointer-events: ${({ imageSrc }) => (imageSrc ? 'auto' : 'none')};
  filter: drop-shadow(2px 4px 4px ${colors.pieceShadow});
  transition: transform 0.1s ease-in-out;
  z-index: 1; 

  &:hover {
    transform: scale(1.05);
  }
`;

export const Container = styled.div<IContainerProps>`
  position: relative;
  background: ${({ cellColor, isSelected }) => (isSelected ? colors.selectedSquare : cellColorSelector[cellColor])};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    top: 30%; bottom: 30%; left: 30%; right: 30%; 
    background-color: ${colors.validMoveSquare};
    border-radius: 50%;
    opacity: ${({ isValidMove }) => (isValidMove ? 1 : 0)};
    transition: opacity 0.2s ease, background-color 0.2s ease;
    pointer-events: none;
    box-shadow: 0 0 8px 2px ${colors.validMoveSquare}; 
    z-index: 2;
  }

  &:hover {
    outline: 3px solid ${colors.hoverOutline};
    outline-offset: -3px;
    z-index: 1; 
  }

  ${Piece} {
     z-index: 3;
     position: relative;
  }
`;