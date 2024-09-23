import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { CheckersGame } from './checkers-game.js';

const PORT = 3333;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
});

const games: {
  [roomId: string]: { game: CheckersGame; player1: any; player2: any };
} = {};

io.on('connection', socket => {
  console.log('A user connected:', socket.id);

  socket.on('createGame', () => {
    const roomId = uuid(); // Generate a unique room ID
    console.log(`Game created with roomId: ${roomId}`);

    socket.emit('gameCreated', roomId);
    console.log(`Player ${socket.id} created game ${roomId}.`);
  });

  socket.on('joinGame', roomId => {
    console.log(`${socket.id} is trying to join room ${roomId}`);

    // Leave any previous rooms (except the default room which is the socket id)
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
      }
    }

    // Join the user to the specified room
    socket.join(roomId);
    console.log(`Player ${socket.id} joined room ${roomId}.`);

    // Keep track of the roomId in the socket
    socket.data.roomId = roomId;

    // If room doesn't exist, create a new game
    if (!games[roomId]) {
      games[roomId] = {
        game: new CheckersGame(),
        player1: socket,
        player2: null,
      };

      socket.emit('getPlayer', 1);
      console.log(`Player 1 joined room: ${roomId}`);
    } else if (!games[roomId].player2) {
      games[roomId].player2 = socket;
      socket.emit('getPlayer', 2);
      console.log(`Player 2 joined room: ${roomId}`);

      const game = games[roomId].game;

      // Initialize game for both players by broadcasting to the room
      io.to(roomId).emit('initializeGameState', {
        board: game.getBoard(),
        turn: game.getTurn(),
      });
      console.log(`Game state initialized for room ${roomId}.`);
    } else {
      socket.emit(
        'getMessage',
        'This game room is full. Please join another room.'
      );
    }
  });

  socket.on('checkGameExists', roomId => {
    if (games[roomId]) {
      socket.emit('gameExists', true);
    } else {
      socket.emit('gameExists', false);
    }
  });

  socket.on('makeMove', data => {
    const { fromRow, fromCol, toRow, toCol } = data;
    const roomId = socket.data.roomId;

    const game = games[roomId]?.game;

    if (!game) return;

    console.log(
      `Move in room ${roomId}: Player ${socket.id} moved from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`
    );

    // Make the move in the game object for the room
    if (game.makeMove(fromRow, fromCol, toRow, toCol)) {
      console.log(`Move made in room ${roomId}. Broadcasting new game state.`);

      // Broadcast the updated game state to all players in the room
      io.to(roomId).emit('updateGameState', {
        board: game.getBoard(),
        turn: game.getTurn(),
        capturedPieces: game.getPlayersCapturedPiecesCount(),
      });

      if (game.getWinner()) {
        console.log(`Game won in room ${roomId} by Player ${game.getWinner()}`);
        // Broadcast the winner to all players in the room
        io.to(roomId).emit('getWinner', { winner: game.getWinner() });
        delete games[roomId]; // Clean up after the game is won
      }
    }
  });

  socket.on('getValidMoves', data => {
    const { roomId, row, col } = data;
    const game = games[roomId]?.game;

    if (!game) return;

    const validMoves = game.getValidMovesForPiece(row, col);

    socket.emit('validMoves', { validMoves });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);

    // Clean up any games where this user was playing
    for (const roomId in games) {
      const game = games[roomId];
      if (game.player1 === socket || game.player2 === socket) {
        console.log(
          `Cleaning up game in room ${roomId} due to player disconnection.`
        );
        if (game.player1)
          game.player1.emit(
            'getMessage',
            'Opponent disconnected, the game will end.'
          );
        if (game.player2)
          game.player2.emit(
            'getMessage',
            'Opponent disconnected, the game will end.'
          );
        delete games[roomId]; // Remove the game from the server
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}...`);
});
