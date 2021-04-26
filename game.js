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
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
            ]
    }
}

function gameLoop(state) {

    const gridSize = 50


    for (player in state.players) {
        const item = state.players[player]
        let tempY = item.y
        let tempX = item.x

        let locationTL = (Math.floor((tempY + (item.velY * item.speed)) / gridSize) * 8) + Math.floor((tempX + (item.velX * item.speed)) / gridSize)
        let locationBR = (Math.floor((tempY + (item.velY * item.speed) + 32) / 50) * 8) + (Math.floor((tempX + (item.velX * item.speed) + 32) / 50))
        let locationBL = (Math.floor((tempY + (item.velY * item.speed) + 32) / 50) * 8) + (Math.floor((tempX + (item.velX * item.speed)) / 50))
        let locationTR = (Math.floor((tempY + (item.velY * item.speed)) / 50) * 8) + (Math.floor((tempX + (item.velX * item.speed) + 32) / 50))
        console.log('bl ', locationBL, ' br ', locationBR)
        if (state.map[locationTL] === 1 && state.map[locationBL] === 1 && item.velX === -1) {
            item.velX = 0
            item.x = (Math.floor((tempX + (item.velX * item.speed)) / gridSize) * 50) + 49
        }
        else if (state.map[locationBR] === 1 && state.map[locationTR] === 1 && item.velX === 1) {
            item.velX = 0
            item.x = (Math.floor((tempX + (item.velX * item.speed) - 2) / gridSize) * 50) + 18
        }
        else if (state.map[locationBR] === 1 && state.map[locationBL] === 1 && item.velY === 1) {
            item.velY = 0
            item.y = (Math.floor((tempY + (item.velY * item.speed) - 2) / gridSize) * 50) + 18
        }
        else if (state.map[locationTR] === 1 && state.map[locationTL] && item.velY === -1) {
            item.velY = 0
            item.y = (Math.floor((tempY + (item.velY * item.speed) - 2) / gridSize) * 50) + 50
        }
        else {


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

        }
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