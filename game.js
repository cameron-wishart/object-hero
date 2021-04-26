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
        gridSize: 8,
        map:
            [
                0, 0, 1, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 1, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
            ]
    }
}

function gameLoop(state) {

    const gridSize = 400 / state.gridSize


    for (player in state.players) {
        const item = state.players[player]
        let tempY = item.y
        let tempX = item.x

        let TL = (Math.floor((tempY + 4) / gridSize) * state.gridSize) + Math.floor((tempX + (item.velX * item.speed) - 4) / gridSize)
        let BR = (Math.floor((tempY + 30) / gridSize) * state.gridSize) + (Math.floor((tempX + (item.velX * item.speed) + 34) / gridSize))
        let BL = (Math.floor((tempY + 30) / gridSize) * state.gridSize) + (Math.floor((tempX + (item.velX * item.speed) - 4) / gridSize))
        let TR = (Math.floor((tempY + 4) / gridSize) * state.gridSize) + (Math.floor((tempX + (item.velX * item.speed) + 34) / gridSize))

        let TLT = (Math.floor((tempY + (item.velY * item.speed) - 2) / gridSize) * state.gridSize) + Math.floor((tempX + 2) / gridSize)
        let BRT = (Math.floor((tempY + (item.velY * item.speed) + 34) / gridSize) * state.gridSize) + (Math.floor((tempX + 30) / gridSize))
        let BLT = (Math.floor((tempY + (item.velY * item.speed) + 34) / gridSize) * state.gridSize) + (Math.floor((tempX + 2) / gridSize))
        let TRT = (Math.floor((tempY + (item.velY * item.speed) - 2) / gridSize) * state.gridSize) + (Math.floor((tempX + 30) / gridSize))


        if ((state.map[TL] === 1 || state.map[BL] === 1) && item.velX === -1) {
            console.log('x')
            item.velX = 0
            item.x = (Math.floor(tempX / gridSize) * gridSize)
        }
        else if ((state.map[BR] === 1 || state.map[TR] === 1) && item.velX === 1) {
            console.log('x')
            item.velX = 0
            item.x = (Math.floor(tempX / gridSize) * gridSize) + 18
        }

        if ((state.map[BRT] === 1 || state.map[BLT] === 1) && item.velY === 1) {
            console.log('y')
            item.velY = 0
            item.y = (Math.floor((tempY) / gridSize) * gridSize) + 17
        }
        else if ((state.map[TRT] === 1 || state.map[TLT] === 1) && item.velY === -1) {
            console.log('y')
            item.velY = 0
            item.y = (Math.floor(tempY / gridSize) * gridSize) + 1
        }



        if ((item.x += item.velX * item.speed) < 0) {
            item.velX = 0
            item.x = 0
        }
        else if ((item.x += item.velX * item.speed) >= 368) {
            item.velX = 0
            item.x = 367
        }
        else
            item.x += item.velX * item.speed

        if ((item.y += item.velY * item.speed) < 0) {
            item.velY = 0
            item.y = 0
        }
        else if ((item.y += item.velY * item.speed) >= 368) {
            item.velY = 0
            item.y = 367
        }
        else
            item.y += item.velY * item.speed


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
                break;
            case 's':
                state.players[socket.id].velY = 1;
                break;

            case 'a':
                state.players[socket.id].velX = -1;
                break;
            case 'd':
                state.players[socket.id].velX = 1;
                break;
            default:

        }
    }
}