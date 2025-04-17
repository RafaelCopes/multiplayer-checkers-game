import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Wrapper } from './styles'; // Make sure path is correct
import { Crown } from 'lucide-react'; // Import the Crown icon

export default function GameOptions({ socket }: any) {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = () => {
    socket.emit('createGame');
    socket.once('gameCreated', (roomId: string) => {
      alert(`Game created! Share this Room ID with your friend: ${roomId}`);
      navigate(`/game/${roomId}`);
    });
    return () => {
      socket.off('gameCreated');
    };
  };

  const handleJoinGame = () => {
    const trimmedRoomId = roomId.trim();
    if (trimmedRoomId) {
      socket.emit('checkGameExists', trimmedRoomId);
      socket.once('gameExists', (exists: boolean) => {
        if (exists) {
          navigate(`/game/${trimmedRoomId}`);
        } else {
          alert('Room not found. Please check the Room ID and try again.');
          setRoomId('');
        }
      });
    } else {
      alert('Please enter a valid Room ID.');
      setRoomId('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleJoinGame();
    }
  };

  return (
    <Wrapper>
      <Container>
        {/* Title Container with Icon */}
        <div className="title-container">
          {/* Use Lucide Crown Icon */}
          <Crown className="title-icon" aria-hidden="true" />
          {/* Game Title */}
          <h1>Welcome to Copes Checkers</h1>
        </div>

        <button onClick={handleCreateGame}>Create a Game</button>

        {/* Separator */}
        <div className="separator">
          <span>or</span>
        </div>

        {/* Join Section */}
        <div className="join-section">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Enter Room ID"
          />
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      </Container>
    </Wrapper>
  );
}