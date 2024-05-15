import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import path from 'path';
import { CheckersGame } from './checkers-game.js';
import { BLACK_PIECE } from './constants.js';

const PORT = 3333;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

app.use(cors());

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
});

let game: CheckersGame | null;
let player1: any = null;
let player2: any = null;

io.on('connection', (socket) => {
  if (!player1) {
    player1 = socket;
    player1.emit('getPlayer', 1);
    console.log('Found player 1!');
    return;
  }

  if (!player2) {
    player2 = socket;
    player2.emit('getPlayer', 2);
    console.log('Found player 2!');
    
    game = new CheckersGame();


    player1.emit('initializeGameState', { board: game.getBoard(), turn: game.getTurn() });
    player2.emit('initializeGameState', { board: game.getBoard(), turn: game.getTurn() });

    player1.on('makeMove', (data: any) => {
      const { fromRow, fromCol, toRow, toCol } = data;

      if (!game) return;

      const player = (game.getTurn() === BLACK_PIECE) ? player1 : player2;
      const opponent = (game.getTurn() === BLACK_PIECE) ? player2 : player1;
    
      if (game.makeMove(fromRow, fromCol, toRow, toCol)) {
        player.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });
        opponent.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });

        if (game.getWinner()) {
          player.emit('getWinner', { winner: game.getWinner() });
          opponent.emit('getWinner', { winner: game.getWinner() });
        }
        
        return;
      }
    });

    player2.on('makeMove', (data) => {
      const { fromRow, fromCol, toRow, toCol } = data;

      if (!game) return;

      const player = (game.getTurn() === BLACK_PIECE) ? player1 : player2;
      const opponent = (game.getTurn() === BLACK_PIECE) ? player2 : player1;
    
      if (game.makeMove(fromRow, fromCol, toRow, toCol)) {

        player.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });
        opponent.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });

        if (game.getWinner()) {
          player.emit('getWinner', { winner: game.getWinner() });
          opponent.emit('getWinner', { winner: game.getWinner() });
        }
        return;
      }
    });

    socket.on('disconnect', (socket) => {
      player1.emit('getMessage', 'Opponent disconnected, reload your window to find a new game!');
      player2.emit('getMessage', 'Opponent disconnected, reload your window to find a new game!');

      player1 = null;
      player2 = null;
      game = null; 
    });

    return;
  }

  socket.emit('getMessage', 'There is already a game in progress. Wait for it to end!');
});

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}...`);
});
