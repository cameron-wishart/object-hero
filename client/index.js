const socket = io('ws://localhost:3000')

//colors
BG_COLOR = '#c2c2c2'
PLAYER_COLOR = '#231f20'

//canvas context
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let keyPresses = {};

socket.on('init', handleInit)
socket.on('players', (msg) => {
    console.log(msg)
})
socket.on('tick', (msg) => {
    paintGame(msg)
})

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
    console.log(event.key)
    socket.emit("keypress", event.key)
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function handleInit(msg) {
    socket.emit("hello", msg)
    console.log(msg)
}

function paintGame(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintPlayers(state.players)
}

function paintPlayers(players) {
    console.log(players)
    for (let player in players) {
        ctx.fillStyle = BG_COLOR
        ctx.fillRect(players[player].x, players[player].y, 10, 10)
    }
}

function handleGame(state) {
    requestAnimationFrame(state)
}