module.exports = {
    createGameState,
    gameLoop,
    handleKeyPress
}

function createGameState() {

    return state = {
        players:
        {

        }
        ,
        gridSize: 16,
        map:
            [
                0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
            ]
    }
}

let tick = 0

function gameLoop(state) {
    const CanvasSize = 640
    const gridSize = 640 / state.gridSize
    if (tick === 5)
        tick = 0
    else
        tick++

    for (player in state.players) {
        const item = state.players[player]
        let tempY = item.y
        let tempX = item.x

        if (item.isMoving && tick === 0) {
            if (item.anim < 3)
                item.anim++
            else
                item.anim = 0
        }

        item.isMoving = false

        let TL = (Math.floor((tempY + 2) / gridSize) * state.gridSize) + Math.floor((tempX + (item.velX * item.speed) - 2) / gridSize)
        let BR = (Math.floor((tempY + 30) / gridSize) * state.gridSize) + (Math.floor((tempX + (item.velX * item.speed) + 32) / gridSize))
        let BL = (Math.floor((tempY + 30) / gridSize) * state.gridSize) + (Math.floor((tempX + (item.velX * item.speed) - 2) / gridSize))
        let TR = (Math.floor((tempY + 2) / gridSize) * state.gridSize) + (Math.floor((tempX + (item.velX * item.speed) + 32) / gridSize))

        let TLT = (Math.floor((tempY + (item.velY * item.speed) - 2) / gridSize) * state.gridSize) + Math.floor((tempX + 2) / gridSize)
        let BRT = (Math.floor((tempY + (item.velY * item.speed) + 32) / gridSize) * state.gridSize) + (Math.floor((tempX + 30) / gridSize))
        let BLT = (Math.floor((tempY + (item.velY * item.speed) + 32) / gridSize) * state.gridSize) + (Math.floor((tempX + 2) / gridSize))
        let TRT = (Math.floor((tempY + (item.velY * item.speed) - 2) / gridSize) * state.gridSize) + (Math.floor((tempX + 30) / gridSize))


        if ((state.map[TL] === 1 || state.map[BL] === 1) && item.velX === -1) {
            item.velX = 0
            item.x = (Math.floor(tempX / gridSize) * gridSize)
        }
        else if ((state.map[BR] === 1 || state.map[TR] === 1) && item.velX === 1) {
            item.velX = 0
            item.x = (Math.floor(tempX / gridSize) * gridSize) + (gridSize - 32)
        }

        if ((state.map[BRT] === 1 || state.map[BLT] === 1) && item.velY === 1) {
            item.velY = 0
            item.y = (Math.floor((tempY) / gridSize) * gridSize) + (gridSize - 32)
        }
        else if ((state.map[TRT] === 1 || state.map[TLT] === 1) && item.velY === -1) {
            item.velY = 0
            item.y = (Math.floor(tempY / gridSize) * gridSize) + 2
        }



        if ((item.x += item.velX * item.speed) < 0) {
            item.velX = 0
            item.x = 0
        }
        else if ((item.x += item.velX * item.speed) >= (CanvasSize - 32)) {
            item.velX = 0
            item.x = CanvasSize - 32
        }
        else {
            item.x += item.velX * item.speed
        }

        if ((item.y += item.velY * item.speed) < 0) {
            item.velY = 0
            item.y = 0
        }
        else if ((item.y += item.velY * item.speed) >= (CanvasSize - 32)) {
            item.velY = 0
            item.y = (CanvasSize - 32)
        }
        else {

            item.y += item.velY * item.speed
        }

        if (item.velY || item.velX)
            item.isMoving = true
        //item.y += item.velY * item.speed


    }
}

function handleKeyPress(keyPresses, state, socket) {
    state.players[socket.id].velX = 0
    state.players[socket.id].velY = 0
    for (key in keyPresses) {
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
            default:
        }
    }
}