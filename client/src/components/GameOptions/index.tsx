import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from './styles';

export default function GameOptions({ socket }: any) { // Accept the socket as a prop
  const [roomId, setRoomId] = useState('');

  const navigate = useNavigate();

  const handleCreateGame = () => {
    socket.emit('createGame'); // Use the existing socket

    socket.on('gameCreated', (roomId: string) => {
      alert(`Game created! Share this Room ID with your friend: ${roomId}`);
      navigate(`/game/${roomId}`); // Navigate to the game with the room ID
    });
  };

  const handleJoinGame = () => {
    if (roomId) {
      navigate(`/game/${roomId}`); // Navigate to the game with the room ID
    } else {
      alert('Please enter a valid Room ID.');
    }
  };

  return (
    <Container>
      <h1>Welcome to Copes Checkers</h1>
      <button onClick={handleCreateGame}>Create a Game</button>
      <p>or</p>
      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinGame}>Join Game</button>
      </div>
    </Container>
  );
}
