const socket = io()

//colors
BG_COLOR = '#c2c2c2'
PLAYER_COLOR = '#231f20'

//canvas context
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let keyPresses = {};
const heroAnim = [16, 0, 16, 32]
const skeletonAnim = [32, 0, 32, 64]

/**
 * CHARACTERS
 */
const player_sprite = new Image()
player_sprite.src = './assets/hero.png';
player_sprite.onload = function () {
    console.log('loaded')
};

const blue_slime_sprite = new Image()
blue_slime_sprite.src = './assets/blue_slime.png';
blue_slime_sprite.onload = function () {
    console.log('loaded')
};

const skeleton_sprite = new Image()
skeleton_sprite.src = './assets/skeleton.png';
skeleton_sprite.onload = function () {
    console.log('loaded')
};

/**
 * TILES
 */
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


/**
 * SOCKET EVENTS
 */
socket.on('gameState', (state) => { handleGame(state) })
socket.on('newMessage', (msg) => { showChat(msg) })

var start_button = document.getElementById("start_button")
var name_bar = document.getElementById('name')
var retry_button = document.getElementById('retry')
start_button.addEventListener("click", () => {
    init()
    socket.emit('joinGame', { room: 'main', x: 48, y: 64, dir: 2, name: name_bar.value })
})

var chatBox = document.getElementById('chatBox')
var messages = document.getElementById('messages')

function init() {
    canvas.style.display = 'block'
    start_button.parentElement.parentElement.style.display = 'none'
    chatBox.parentElement.style.display = 'block'
    // window.addEventListener('click', clickListener)
    // function clickListener(event) {
    //     keyPresses['click'] = true;
    //     socket.emit('keypress', keyPresses)
    // }

    window.addEventListener('keydown', keyDownListener);


    window.addEventListener('keyup', keyUpListener);

}

function keyDownListener(event) {
    if (chatBox !== document.activeElement)
        if (!keyPresses[event.key] === true) {
            keyPresses[event.key] = true;
            socket.emit('keypress', keyPresses)
        }
    if (event.key === 'Enter') {
        socket.emit('message', chatBox.value)
        chatBox.value = ''
    }
}

function keyUpListener(event) {
    delete keyPresses[event.key]
    socket.emit('keypress', keyPresses)
}

function paintGame(state) {
    for (let player in state.players)
        if (player === socket.id) {
            if (state.players[player].health === 0) {
                socket.emit('gameOver', 'dead')
                gameOver()
                break
            }
            if (state.players[player].y < 0) {
                socket.emit('joinGame', state.exit.north)
            }
            else if (state.players[player].y > 600) {
                socket.emit('joinGame', state.exit.south)
            }
        }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintMap(state)
    //showChat(state)
    paintEnemies(state.enemies)
    paintPlayers(state.players)
    paintSpawn(state.enemySpawnAreas)
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


function paintSpawn(spawners) {
    Object.keys(spawners).map(spawnBox => {
        let x = spawners[spawnBox].minX
        ctx.strokeStyle = '#ff0000'
        //ctx.fillStyle = PLAYER_COLOR
        //ctx.strokeRect(50, 50, 50, 100)
        ctx.strokeRect(x, spawners[spawnBox].minY, spawners[spawnBox].maxX - spawners[spawnBox].minX, spawners[spawnBox].maxY - spawners[spawnBox].minY)
    })
}


function paintEnemies(enemies) {
    enemies.map((enemy) => {
        switch (enemy.type) {
            case 'skeleton':
                switch (enemy.dir) {
                    case 0:

                        ctx.drawImage(skeleton_sprite, skeletonAnim[enemy.anim], 96, 32, 32, enemy.x, enemy.y, 32, 32)
                        break
                    case 1:

                        ctx.drawImage(skeleton_sprite, skeletonAnim[enemy.anim], 64, 32, 32, enemy.x, enemy.y, 32, 32)
                        break
                    case 2:

                        ctx.drawImage(skeleton_sprite, skeletonAnim[enemy.anim], 0, 32, 32, enemy.x, enemy.y, 32, 32)
                        break
                    case 3:

                        ctx.drawImage(skeleton_sprite, skeletonAnim[enemy.anim], 32, 32, 32, enemy.x, enemy.y, 32, 32)
                        break
                }
                break
            default:
        }

    })
}

function paintPlayers(players) {
    for (let player in players) {
        switch (players[player].dir) {
            case 0:
                if (players[player].isMoving)
                    ctx.drawImage(player_sprite, heroAnim[players[player].anim], 16, 16, 16, players[player].x, players[player].y, 32, 32)
                else if (players[player].atk) {
                    ctx.drawImage(player_sprite, 16, 16, 16, 16, players[player].x, players[player].y, 32, 32)
                    ctx.fillStyle = PLAYER_COLOR
                    ctx.fillRect(players[player].x, players[player].y - 32, 32, 32)
                }
                else
                    ctx.drawImage(player_sprite, 16, 16, 16, 16, players[player].x, players[player].y, 32, 32)

                break
            case 1:
                //ctx.drawImage(image, 0, 0, 16, 16, players[player].x, players[player].y, 32, 32)
                if (players[player].isMoving) {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(player_sprite, heroAnim[players[player].anim], 0, 16, 16, - players[player].x - 32, players[player].y, 32, 32)
                    ctx.restore()

                }
                else if (players[player].atk) {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(player_sprite, heroAnim[players[player].anim], 0, 16, 16, - players[player].x - 32, players[player].y, 32, 32)
                    ctx.restore()
                    ctx.fillStyle = PLAYER_COLOR
                    ctx.fillRect(players[player].x + 32, players[player].y, 32, 32)
                }
                else {
                    ctx.save()
                    ctx.scale(-1, 1)
                    ctx.drawImage(player_sprite, 16, 0, 16, 16, - players[player].x - 32, players[player].y, 32, 32)
                    ctx.restore()
                }
                break
            case 2:
                if (players[player].isMoving)
                    ctx.drawImage(player_sprite, heroAnim[players[player].anim], 32, 16, 16, players[player].x, players[player].y, 32, 32)
                else if (players[player].atk) {
                    ctx.drawImage(player_sprite, 16, 32, 16, 16, players[player].x, players[player].y, 32, 32)
                    ctx.fillStyle = PLAYER_COLOR
                    ctx.fillRect(players[player].x, players[player].y + 32, 32, 32)
                }
                else
                    ctx.drawImage(player_sprite, 16, 32, 16, 16, players[player].x, players[player].y, 32, 32)

                break
            case 3:
                if (players[player].isMoving)
                    ctx.drawImage(player_sprite, heroAnim[players[player].anim], 0, 16, 16, players[player].x, players[player].y, 32, 32)
                else if (players[player].atk) {
                    ctx.drawImage(player_sprite, 16, 0, 16, 16, players[player].x, players[player].y, 32, 32)
                    ctx.fillStyle = PLAYER_COLOR
                    ctx.fillRect(players[player].x - 32, players[player].y, 32, 32)
                }
                else
                    ctx.drawImage(player_sprite, 16, 0, 16, 16, players[player].x, players[player].y, 32, 32)

                break
            default:

        }
        //ctx.drawImage(image, 0, 0, 16, 16, players[player].x, players[player].y, 32, 32)
    }
}

function showChat(msg) {
    const { name, message } = msg
    // chat.map((msg) => {
    let listItem = document.createElement("li")
    let text = document.createTextNode(`${name} - ${message}`)
    listItem.appendChild(text)
    messages.appendChild(listItem)
    // })
}

function handleGame(state) {
    requestAnimationFrame(() => paintGame(state))
}

retry_button.addEventListener("click", () => {
    start_button.parentElement.parentElement.style.display = 'block'
    retry_button.style.display = 'none'
})

function gameOver() {
    //window.addEventListener('keydown', keyDownListener);
    window.removeEventListener('keydown', keyDownListener)
    window.removeEventListener('keyup', keyUpListener)
    canvas.style.display = 'none'
    chatBox.parentElement.style.display = 'none'
    retry_button.style.display = 'block'
}