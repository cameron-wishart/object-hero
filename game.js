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
                0, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 0, 0, 0, 1,
            ]
    }
}

function gameLoop(state) {

    for (player in state.players) {
        const item = state.players[player]
        if (item.x <= 0)
            item.x = 1
        else if (item.x >= 368)
            item.x = 367
        else
            item.x += item.velX * item.speed

        if (item.y <= 0)
            item.y = 1
        else if (item.y >= 364)
            item.y = 363
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