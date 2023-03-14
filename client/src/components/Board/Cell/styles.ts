import styled from "styled-components";

interface IContainerProps {
  cellColor: 'red' | 'black';
}

const cellColorSelector = {
  black: '#0d0a02',
  red: 'red',
}

export const Container = styled.div<IContainerProps>`
  height: 72px;
  width: 72px;

  background: ${({ cellColor }) => cellColorSelector[cellColor] };

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 60px;
    height: 60px;
  }
`;
