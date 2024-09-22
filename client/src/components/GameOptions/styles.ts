import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;

  background: black;
  color: white;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;

	p {
		font-size: 1.2rem;
	}

	h1 {
		font-size: 2.5rem;
	}

  button {
    padding: 10px 20px;
    border: 0;
    border-radius: 5px;
    background: darkred;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: red;
    }
  }
  
	input {
		padding: 10px;
		border: 0;
		border-radius: 5px;
		font-size: 1.2rem;
	}

	div {
		display: flex;
		gap: 15px;
	}
`;