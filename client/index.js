const socket = io()

//colors
BG_COLOR = '#c2c2c2'
PLAYER_COLOR = '#231f20'

//canvas context
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let keyPresses = {};

const image = new Image()
image.src = './assets/greencapsheet.png';
image.onload = function () {
    console.log('loaded')
};

//socket events

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
    paintMap(state)
    paintPlayers(state.players)
}

function paintMap(state) {
    let row = 0
    let gridSize = canvas.width / state.gridSize
    let xPos = 0;
    for (let i = 0; i < state.map.length; i++) {
        let height = gridSize * row
        switch (state.map[i]) {
            case 0:
                ctx.fillStyle = BG_COLOR
                ctx.fillRect(xPos, height, gridSize, gridSize)
                break;
            case 1:
                ctx.fillStyle = PLAYER_COLOR
                ctx.fillRect(xPos, height, gridSize, gridSize)
                break;
            default:
        }
        if ((xPos + gridSize) === canvas.width) {
            xPos = 0
            row++;
        }
        else
            xPos += gridSize

    }
}

function paintPlayers(players) {
    for (let player in players) {
        ctx.fillStyle = BG_COLOR
        ctx.drawImage(image, 0, 0, 16, 16, players[player].x, players[player].y, 32, 32)
        //ctx.fillRect(players[player].x, players[player].y, 32, 32)
    }
}

function handleGame(state) {
    requestAnimationFrame(state)
}