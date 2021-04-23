const socket = io('ws://localhost:3000')

socket.on('init', handleInit)
socket.on('player disconnect', (msg) => {
    console.log(msg)
})
function handleInit(msg) {
    socket.emit("hello", "world")
    console.log(msg)
}