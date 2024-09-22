import styled from "styled-components";

interface PieceProps {
  color: 'black' | 'red';
}

export const Container = styled.div`
  height: 100vh;

  background: black;
  color: white;
  
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 70px;
`;

export const GameInfo = styled.div<{ highlight: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 50px;

  height: 594px;
  width: 300px;

  border-radius: 8px;
  border: 8px solid dimgrey;
  border: ${({ highlight }) => (highlight ? "8px solid #d12121" : "8px solid dimgrey")};

  padding: 30px;

  text-align: center;


  background-color: #403737;

  h1 {
    font-size: 24px;
  }
`;

export const Wrapper = styled.div`
  padding: 8px;
  border-radius: 8px;
  background: dimgray;
`;

export const Message = styled.h1`
  color: red;
`;


export const Content = styled.div`
  background: red;
  height: 576px;
  width: 576px;

  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
`;

export const CapturedPieces = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
`;

export const CapturedPiece = styled.div<PieceProps>`
  width: 50px;
  height: 50px;
  background-image: url(${(props) => props.color === 'black' ? '/assets/black-checker/standard.svg': '/assets/red-checker/standard.svg'});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 5px;
`;

export const Player = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;