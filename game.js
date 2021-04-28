module.exports = {
    createGameState,
    gameLoop,
    handleKeyPress
}

const { main, empty } = require('./maps/map')
const { attack, playerMovement } = require('./actions/playerActions')
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
    if (state.tick === 3)
        state.tick = 0
    else
        state.tick++



    for (item in state.players) {

        const player = state.players[item]

        if (player.atk === true && state.tick === 0) {
            state.enemies = attack(state.enemies, player)
            player.atk = false
        }

        playerMovement(player, gridSize)

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
                    if (state.players[socket.id].atk === true)
                        state.players[socket.id].atk = false
                    else
                        state.players[socket.id].atk = true
                default:
            }
    })
}