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
    //console.log('a user connected');
    //socket.on('newGame', handleNewGame)
    socket.on('joinGame', (obj) => {
        let { room } = obj
        if (state[room] === undefined)
            handleNewGame(room)

        handleJoinGame(obj)
    })

    function handleJoinGame(obj) {
        let { room, x, y, dir, name } = obj
        if (clientRooms[socket.id] !== undefined) {
            socket.leave(clientRooms[socket.id])
            //delete state[clientRooms[socket.id]].players[socket.id]
        }
        socket.join(room)
        state[room].players[socket.id] = { x: x, y: y, velX: 0, velY: 0, dir: dir, isMoving: false, isCol: false, atk: false, coolDown: 0, anim: 0, speed: 4, name: name, health: 3, isHit: false, inventory: [] }
        clientRooms[socket.id] = room
        //console.log(state)
    }

    function handleNewGame(room) {
        //console.log('creating')
        state[room] = createGameState(room)
        startGameInterval(room)
        //handleJoinGame(room)
    }

    socket.on('keypress', (keyPress) => {
        handleKeyPress(keyPress, state[clientRooms[socket.id]], socket)
    })

    socket.on('message', (msg) => {
        state[clientRooms[socket.id]].chat.push(msg)
        io.sockets.in(clientRooms[socket.id]).emit('newMessage', { message: msg, name: state[clientRooms[socket.id]].players[socket.id].name })
    })

    socket.on('gameOver', (msg) => {
        console.log('dead')
        if (state[clientRooms[socket.id]]?.players[socket.id])
            delete state[clientRooms[socket.id]].players[socket.id]
    })

    socket.on('disconnect', () => {
        if (state[clientRooms[socket.id]]?.players[socket.id])
            delete state[clientRooms[socket.id]].players[socket.id]
        //console.log('Client disconnected')
    });
})

function startGameInterval(room) {
    const intervalId = setInterval(() => {
        //console.log(room)
        gameLoop(state[room])
        emitGameState(room, state[room])
    }, 1000 / 30);
}

function emitGameState(room, gameState) {
    // Send this event to everyone in the room.
    io.sockets.in(room).emit('gameState', gameState)
}

server.listen(process.env.PORT || 3000, () => {
});