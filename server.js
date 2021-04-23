// const http = require('http').createServer()
// const io = require('socket.io')(http, {
//     cors: { origin: '*' }
// })
// const express = require('express');
// const socketIO = require('socket.io');

// //const io = require('socket.io')()
// const PORT = process.env.PORT || 3000;
// const INDEX = 'client/index.html';

// const server = express()
//     .use((req, res) => res.sendFile('./client/index.html', { root: __dirname }))
//     .listen(PORT, () => console.log(`Listening on ${PORT}`));


// const socketserver = express().listen(3001)
// const io = socketIO(socketserver);

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

const state = {
    players:
    {

    }
    ,
    map:
        [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
        ]
}

io.on('connection', socket => {
    console.log('a user connected');
    state.players[socket.id] = { x: 10, y: 10 }

    socket.emit('init', 'hello')

    // socket.on('keypress', () => {
    //     console.log('press')
    //     state.players[socket.id].x += 1;
    // })

    //startGameInterval(socket, state)


    socket.on('disconnect', () => {
        delete state.players[socket.id]
        console.log('Client disconnected')
    });
})

function startGameInterval(socket, state) {
    const interval = setInterval(() => {
        socket.emit('tick', state)
    }, 1000 / 10)
}

server.listen(process.env.PORT || 3000, () => {
    console.log('listening');
});