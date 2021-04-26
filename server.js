const { createGameState, handleKeyPress, gameLoop } = require('./game');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { stat } = require('fs');
const io = new Server(server);

app.use(express.static('client'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


const clientRooms = {}
const state = {}

io.on('connection', socket => {
    console.log('a user connected');

    //socket.on('newGame', handleNewGame)
    socket.on('joinGame', () => {
        if (state['main'] === undefined)
            handleNewGame()
        else
            handleJoinGame()
    })

    function handleJoinGame() {
        console.log('joining')
        socket.join('main')
        state['main'].players[socket.id] = { x: 0, y: 0, velX: 0, velY: 0, dir: 0, isMoving: false, speed: 2, inventory: [] }
        clientRooms[socket.id] = 'main'

    }

    function handleNewGame() {
        console.log('creating')
        state['main'] = createGameState()
        clientRooms[socket.id] = 'main'
        socket.join('main')
        state['main'].players[socket.id] = { x: 0, y: 0, velX: 0, velY: 0, dir: 0, isMoving: false, speed: 2, inventory: [] }
        startGameInterval('main')

    }

    socket.on('keypress', (keyPresses) => {
        handleKeyPress(keyPresses, state['main'], socket)
    })

    socket.on('disconnect', () => {
        if (state['main']?.players[socket.id])
            delete state['main'].players[socket.id]
        console.log('Client disconnected')
    });
})

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        gameLoop(state[roomName])
        emitGameState(roomName, state[roomName])
    }, 1000 / 30);
}

function emitGameState(room, gameState) {
    // Send this event to everyone in the room.
    io.sockets.in('main').emit('gameState', gameState)
}

server.listen(process.env.PORT || 3000, () => {
    console.log('listening');
});