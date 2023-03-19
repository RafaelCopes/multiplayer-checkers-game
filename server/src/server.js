const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const { CheckersGame } = require('./CheckersGame.js');

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

let game = null;
let player1 = null;
let player2 = null;

io.on('connection', (socket) => {
  if (!player1) {
    player1 = socket;
    player1.emit('player', 1);
    console.log('Found player 1!');
    return;
  }

  if (!player2) {
    player2 = socket;
    player2.emit('player', 2);
    console.log('Found player 2!');
    
    game = new CheckersGame();

    player1.emit('initializeGameState', { board: game.getBoard(), turn: game.getTurn() });
    player2.emit('initializeGameState', { board: game.getBoard(), turn: game.getTurn() });

    player1.on('makeMove', (data) => {
      const { fromRow, fromCol, toRow, toCol } = data;

      const player = (game.getTurn() === CheckersGame.BLACK_PIECE) ? player1 : player2;
      const opponent = (game.getTurn() === CheckersGame.BLACK_PIECE) ? player2 : player1;
    
      if (game.makeMove(fromRow, fromCol, toRow, toCol)) {
        player.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });
        opponent.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });

        if (game.getWinner()) {
          player.emit('winner', { winner: game.getWinner() });
          opponent.emit('winner', { winner: game.getWinner() });
        }
        return;
      }
    });

    player2.on('makeMove', (data) => {
      const { fromRow, fromCol, toRow, toCol } = data;

      const player = (game.getTurn() === CheckersGame.BLACK_PIECE) ? player1 : player2;
      const opponent = (game.getTurn() === CheckersGame.BLACK_PIECE) ? player2 : player1;
    
      if (game.makeMove(fromRow, fromCol, toRow, toCol)) {

        player.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });
        opponent.emit('updateGameState', { board: game.getBoard(), turn: game.getTurn() });

        if (game.getWinner()) {
          player.emit('winner', { winner: game.getWinner() });
          opponent.emit('winner', { winner: game.getWinner() });
        }
        return;
      }
    });

    return;
  }

  socket.emit('message', 'Game in progress');
});

io.on('disconnect', (socket) => {
  if (socket === player1) {
    player1 = null;
    game = null;
  }

  if (socket === player2) {
    player2 = null;
    game = null;
  }
});

server.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}...`);
});
