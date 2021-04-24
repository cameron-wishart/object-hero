const { createGameState, handleKeyPress, gameLoop } = require('./game');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('client'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


const main = createGameState()

const world = {
    main: createGameState()
}

io.on('connection', socket => {
    console.log('a user connected');
    //set player in starting map
    world['main'].players[socket.id] = { x: 10, y: 10, velX: 0, velY: 0, speed: 1, inventory: [] }

    socket.emit('init', 'hello')

    socket.on('keypress', (keyPresses) => {
        handleKeyPress(keyPresses, state, socket)
    })


    startGameInterval(socket, state)


    socket.on('disconnect', () => {
        delete state.players[socket.id]
        console.log('Client disconnected')
    });
})

function startGameInterval(socket, state) {
    const interval = setInterval(() => {
        socket.emit('tick', state)
        gameLoop(state, socket)
    }, 1000 / 30)
}

server.listen(process.env.PORT || 3000, () => {
    console.log('listening');
});