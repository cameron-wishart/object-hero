const socket = io()

//colors
BG_COLOR = '#c2c2c2'
PLAYER_COLOR = '#231f20'

//canvas context
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let keyPresses = {};
const heroAnim = [16, 0, 16, 32]
let ticker = 0

const image = new Image()
image.src = './assets/hero.png';
image.onload = function () {
    console.log('loaded')
};


const grass = new Image()
grass.src = './assets/grass-tile.png';
grass.onload = function () {
    console.log('grass loaded')
};

const grassTwo = new Image()
grassTwo.src = './assets/grass-tile-3.png';
grassTwo.onload = function () {
    console.log('grass loaded')
};

const tileSheet = new Image()
tileSheet.src = './assets/tiles-map.png';
tileSheet.onload = function () {
    console.log('tilemap loaded')
};
//socket events
socket.on('gameState', (state) => { handleGame(state) })


document.getElementById("start_button").addEventListener("click", () => {
    init()
    socket.emit('joinGame', 'player joining')
})


function init() {



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
                ctx.drawImage(grass, 0, 0, 32, 32, xPos, height, gridSize, gridSize)
                //ctx.fillRect(xPos, height, gridSize, gridSize)
                break;
            case 1:
                //ctx.fillStyle = PLAYER_COLOR
                ctx.drawImage(grassTwo, 0, 0, 32, 32, xPos, height, gridSize, gridSize)

                //ctx.fillRect(xPos, height, gridSize, gridSize)
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
        switch (players[player].dir) {
            case 0:
                if (players[player].isMoving)
                    ctx.drawImage(image, heroAnim[players[player].anim], 16, 16, 16, players[player].x, players[player].y, 32, 32)
                else
                    ctx.drawImage(image, 16, 16, 16, 16, players[player].x, players[player].y, 32, 32)

                break
            case 1:
                //ctx.drawImage(image, 0, 0, 16, 16, players[player].x, players[player].y, 32, 32)
                if (players[player].isMoving) {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(image, heroAnim[players[player].anim], 0, 16, 16, - players[player].x - 32, players[player].y, 32, 32)
                    ctx.restore()

                }
                else {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(image, 16, 0, 16, 16, - players[player].x - 32, players[player].y, 32, 32)
                    ctx.restore()
                }
                break
            case 2:
                if (players[player].isMoving)
                    ctx.drawImage(image, heroAnim[players[player].anim], 32, 16, 16, players[player].x, players[player].y, 32, 32)
                else
                    ctx.drawImage(image, 16, 32, 16, 16, players[player].x, players[player].y, 32, 32)

                break
            case 3:
                if (players[player].isMoving)
                    ctx.drawImage(image, heroAnim[players[player].anim], 0, 16, 16, players[player].x, players[player].y, 32, 32)
                else
                    ctx.drawImage(image, 16, 0, 16, 16, players[player].x, players[player].y, 32, 32)

                break
            default:

        }
        //ctx.drawImage(image, 0, 0, 16, 16, players[player].x, players[player].y, 32, 32)
    }
}

function handleGame(state) {
    requestAnimationFrame(() => paintGame(state))
}