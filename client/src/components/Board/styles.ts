import styled, { css, keyframes } from "styled-components";

const colors = {
  background: '#000000',
  containerBackground: '#1a1d21',
  containerBackgroundGradient: 'linear-gradient(145deg, #212428, #15171a)',
  border: '#33383f',              
  textPrimary: '#e8e8e8',
  textSecondary: '#8a9199',
  accentPrimary: '#c70039',       
  accentHover: '#ff195d',       
  warningText: '#ff195d',        
  boardFrame: '#101214',         
  shadowColor: 'rgba(0, 0, 0, 0.6)',
  capturedPieceBorder: 'rgba(255, 255, 255, 0.1)', 
};

// Container principal
export const Container = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  color: ${colors.textPrimary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }
`;

export const GameContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3rem;

  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

export const GameInfo = styled.div<{ highlight: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;

  min-height: 610px;
  width: 280px;

  background: ${colors.containerBackground};
  background: ${colors.containerBackgroundGradient};
  border-radius: 12px;
  border: 2px solid ${colors.border};
  padding: 1.5rem;
  box-shadow: 0px 8px 20px ${colors.shadowColor};
  text-align: center;
  transition: border-color 0.3s ease-in-out;

  border-color: ${({ highlight }) => (highlight ? colors.accentHover : colors.border)};

  h1 {
    font-size: 1.4rem;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin: 0;
    line-height: 1.3;
  }

  @media (max-width: 1100px) {
    min-height: auto;
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    gap: 1rem;
  }

  & > h1:first-child {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.accentHover};
  }
`;

export const Wrapper = styled.div`
  padding: 10px; 
  border-radius: 12px;
  background: ${colors.boardFrame}; 
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5), 
              inset 0px 0px 10px rgba(0, 0, 0, 0.7);
  display: inline-block; 
`;

export const Content = styled.div`
  height: 576px;
  width: 576px;

  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  border-radius: 6px; 
  overflow: hidden; 
  border: 1px solid ${colors.border}; 
`;

export const CapturedPieces = styled.div`
  width: 100%;
  height: 180px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 8px;
  padding: 1rem;
  background-color: rgba(0,0,0,0.2);
  border-radius: 8px;
  margin-top: 0.5rem;
`;

export const CapturedPiece = styled.div<{ color: 'black' | 'red' }>`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.color === 'black' ? '/assets/black-checker/standard.svg': '/assets/red-checker/standard.svg'});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
`;

export const Player = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  width: 100%;

  h1 {
    font-size: 1.2rem;
    font-weight: 500;
    color: ${colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0;
  }

  ${CapturedPiece} {
    width: 55px;
    height: 55px;
    border: none;
    box-shadow: 0 2px 5px rgba(0,0,0,0.4);
  }
`;

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  10% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
`;

export const MessageArea = styled.div`
  min-height: 50px;
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Message = styled.div`
  color: ${colors.warningText};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  background-color: rgba(40, 30, 30, 0.8);
  border: 1px solid ${colors.accentPrimary};
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  animation: ${fadeInOut} 3s ease-in-out forwards;
`;

export const WinnerMessage = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: ${colors.accentHover};
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid ${colors.accentPrimary};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export const BackButton = styled.button`
  background: ${colors.accentPrimary};
  color: ${colors.textPrimary};
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: ${colors.accentHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(199, 0, 57, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(199, 0, 57, 0.3);
  }
`;