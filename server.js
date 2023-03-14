const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const {CheckersGame} = require('./CheckersGame.js');

const PORT = 3000;

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
  //console.log(path.resolve(__dirname, '..', '..', 'client', 'index.html'))
  res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'index.html'));
});

let game = null;
let player1 = null;
let player2 = null;

io.on('connection', (socket) => {
  if (!player1) {
    player1 = socket;
    player1.emit('message', 'You are Player 1');
    console.log('You are Player 1');
    return;
  }

  if (!player2) {
    player2 = socket;
    player2.emit('message', 'You are Player 2');
    console.log('You are Player 2');
    
    game = new CheckersGame();
    player1.emit('game', { board: game.getBoard(), turn: game.getTurn() });
    player2.emit('game', { board: game.getBoard(), turn: game.getTurn() });

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

io.on('move', ({ fromRow, fromCol, toRow, toCol }) => {
  const player = (game.getTurn() === CheckersGame.BLACK_PIECE) ? player1 : player2;
  const opponent = (game.getTurn() === CheckersGame.BLACK_PIECE) ? player2 : player1;

  if (player !== socket) {
    socket.emit('message', 'Not your turn');
    return;
  }

  if (game.makeMove(fromRow, fromCol, toRow, toCol)) {
    player.emit('game', { board: game.getBoard(), turn: game.getTurn() });
    opponent.emit('game', { board: game.getBoard(), turn: game.getTurn() });
    return;
  }

  /*const winner = game.getWinner();
  if (winner) {
    player1.emit('winner', winner);
    player2.emit('winner', winner);
  } else {
    player.emit('message', 'Invalid move');
  }*/
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
