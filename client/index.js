const socket = io()

//colors
BG_COLOR = '#c2c2c2'
PLAYER_COLOR = '#231f20'

//canvas context
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let keyPresses = {};


//socket events
socket.on('players', (msg) => {
    console.log(msg)
})
socket.on('tick', (msg) => {
    paintGame(msg)
})

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    if (!keyPresses[event.key] === true) {

        keyPresses[event.key] = true;
        socket.emit('keypress', keyPresses)
    }
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    delete keyPresses[event.key]
    socket.emit('keypress', keyPresses)
}


socket.on('init', handleInit)

function handleInit(msg) {
    socket.emit("hello", msg)
    console.log(msg)
}

function paintGame(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintPlayers(state.players)
}

function paintPlayers(players) {
    for (let player in players) {
        ctx.fillStyle = BG_COLOR
        ctx.fillRect(players[player].x, players[player].y, 64, 64)
    }
}

function handleGame(state) {
    requestAnimationFrame(state)
}