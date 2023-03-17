import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;

  background: black;
  color: white;
  
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 100px;
`;

export const GameInfo = styled.div`
  margin-bottom: 10px;
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
