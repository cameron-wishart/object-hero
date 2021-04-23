const http = require('http').createServer()

const io = require('socket.io')(http, {
    cors: { origin: '*' }
})

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
    socket.emit('init', state.players)

    socket.on('keypress', () => {
        state.players[socket.id].x += 1;
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
    }, 1000 / 20)
}



http.listen(3000, () => console.log('listening on http://localhost:3000'))