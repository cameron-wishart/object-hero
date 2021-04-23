const http = require('http').createServer()

const io = require('socket.io')(http, {
    cors: { origin: '*' }
})

io.on('connection', socket => {
    console.log('a user connected');
    socket.emit('init', 'hello')
    socket.on('hello', msg => {
        console.log(msg)
    })


    // socket.on('disconnecting', (obj) => {
    //     socket.brodcast.emit('player disconnect', 'player gone!')
    // })

})

http.listen(3000, () => console.log('listening on http://localhost:3000'))