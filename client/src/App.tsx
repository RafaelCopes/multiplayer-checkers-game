import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import GameOptions from './components/GameOptions';
import Board from './components/Board';
import GlobalStyle from './styles/GlobalStyles';

const ENDPOINT = 'http://localhost:3333';

// Create a socket instance globally, outside of any component
const socket = io(ENDPOINT);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameOptions socket={socket} />} />
        <Route path="/game/:roomId" element={<Board socket={socket} />} />
      </Routes>
      <GlobalStyle />
    </Router>
  );
}

export default App;
