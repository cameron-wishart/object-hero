module.exports = {
    createGameState,
    gameLoop,
    handleKeyPress
}

const { main, empty } = require('./maps/map')

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
    return state = {
        players:
        {

        }
        ,
        tick: 0,
        gridSize: 20,
        map: newMap,
        exit: { north: { room: 'empty', x: 64, y: 600, dir: 0 } }
    }
}

function gameLoop(state) {
    const canvasSize = 640
    const gridSize = canvasSize / state.gridSize
    if (state.tick === 3)
        state.tick = 0
    else
        state.tick++

    for (player in state.players) {
        const item = state.players[player]
        let tempY = item.y
        let tempX = item.x

        if (item.isMoving && state.tick === 0) {
            if (item.anim < 3)
                item.anim++
            else
                item.anim = 0
        }

        item.isMoving = false
        let TL = (Math.floor((tempY + (item.velY) + 16) / gridSize) * state.gridSize) + Math.floor((tempX + (item.velX)) / gridSize)
        let TR = (Math.floor((tempY + (item.velY) + 16) / gridSize) * state.gridSize) + Math.floor((tempX + (item.velX) + 31) / gridSize)
        let BL = (Math.floor((tempY + (item.velY) + 31) / gridSize) * state.gridSize) + Math.floor((tempX + (item.velX)) / gridSize)
        let BR = (Math.floor((tempY + (item.velY) + 31) / gridSize) * state.gridSize) + Math.floor((tempX + (item.velX) + 31) / gridSize)

        if ((state.map[TL] === 1 || state.map[BL] === 1) && item.dir === 3) {
            item.velX = 0
        }
        else if ((state.map[TR] === 1 || state.map[BR] === 1) && item.dir === 1) {
            item.velX = 0
            item.x = tempX
        }
        else if ((state.map[TL] === 1 || state.map[TR] === 1) && item.dir === 0) {
            item.velY = 0
        }
        else if ((state.map[BL] === 1 || state.map[BR] === 1) && item.dir === 2) {
            item.velY = 0
        }

        item.x += item.velX * item.speed


        item.y += item.velY * item.speed

        if (item.velY || item.velX)
            item.isMoving = true
        //item.y += item.velY * item.speed


    }
}

function handleKeyPress(keyPresses, state, socket) {
    state.players[socket.id].velX = 0
    state.players[socket.id].velY = 0
    state.players[socket.id].atk = false
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
                default:
            }
    })
}