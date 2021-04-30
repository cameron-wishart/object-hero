module.exports = {
    createGameState,
    gameLoop,
    handleKeyPress
}

const { main, empty } = require('./maps/map')
const { attack, playerMovement } = require('./actions/playerActions')
const { spawner } = require('./actions/enemyActions')


function createGameState(room) {
    let newMap = []
    switch (room) {
        case 'main':
            newMap = main()
            break
        case 'empty':

            newMap = empty()
            break
        default:
    }
    return state = newMap
}

function gameLoop(state) {

    const canvasSize = 640
    const gridSize = canvasSize / state.gridSize
    if (state.tick === 30)
        state.tick = 0
    else
        state.tick++


    for (spawn in state.enemySpawnAreas) {
        spawner(state.enemySpawnAreas[spawn], state.enemies)
    }


    for (item in state.players) {

        const player = state.players[item]

        if (player.atk === true && player.coolDown === 0) {
            state.enemies = attack(state.enemies, player)
            player.coolDown++
        }
        else if (player.coolDown > 0 && player.coolDown < 5) {
            player.coolDown++
        }
        else if (player.coolDown === 5) {
            player.atk = false
            player.coolDown = 0
        }

        playerMovement(player, gridSize, state)

    }
}

function handleKeyPress(keyPresses, state, socket) {
    state.players[socket.id].velX = 0
    state.players[socket.id].velY = 0
    Object.keys(keyPresses).map(function (key, index) {
        if (index === Object.keys(keyPresses).length - 1)
            switch (key) {
                case 'w':
                    state.players[socket.id].velY = -1;
                    state.players[socket.id].dir = 0
                    break;
                case 's':
                    state.players[socket.id].velY = 1;
                    state.players[socket.id].dir = 2
                    break;

                case 'a':
                    state.players[socket.id].velX = -1;
                    state.players[socket.id].dir = 3
                    break;
                case 'd':
                    state.players[socket.id].velX = 1;
                    state.players[socket.id].dir = 1
                    break;
                case 'e':
                    state.players[socket.id].atk = true
                    break
                case 'click':
                    state.players[socket.id].atk = true
                    break
                default:
            }
    })
}