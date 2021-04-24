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
        state.players[player].x += state.players[player].velX * state.players[player].speed
        state.players[player].y += state.players[player].velY * state.players[player].speed
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