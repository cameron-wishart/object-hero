module.exports = {
    attack,
    playerMovement
}

function attack(enemies, player) {

    let hit = false
    let tempEnemiesRemain = []
    enemies.map((enemy, index) => {
        switch (player.dir) {
            case 0:
                if ((player.x + 32) >= enemy.x && player.x <= (enemy.x + 32) && (player.y + 32) >= (enemy.y + 32) && (player.y - 32) <= (enemy.y + 32))
                    hit = true
                break
            case 1:
                if ((player.x + 64) >= (enemy.x) && player.x <= enemy.x && (player.y + 32) >= enemy.y && player.y <= (enemy.y + 32))
                    hit = true
                break
            case 2:
                if ((player.x + 32) >= enemy.x && player.x <= (enemy.x + 32) && (player.y + 64) >= enemy.y && player.y <= enemy.y)
                    hit = true
                break
            case 3:
                if ((player.x - 32) >= enemy.x && (player.x + 32) >= (enemy.x + 32) && (player.y + 32) >= enemy.y && player.y <= (enemy.y + 32))
                    hit = true
                break
            default:
        }
        if (hit)
            enemy.health--

        if (enemy.health !== 0)
            tempEnemiesRemain.push(enemies[index])

        hit = false
    })
    return tempEnemiesRemain
}

function playerMovement(player, gridSize, state) {

    let tempY = player.y
    let tempX = player.x

    if (player.isMoving && (state.tick % 6) === 0) {
        if (player.anim < 3)
            player.anim++
        else
            player.anim = 0
    }



    player.isMoving = false
    let TL = (Math.floor((tempY + (player.velY) + 16) / gridSize) * state.gridSize) + Math.floor((tempX + (player.velX)) / gridSize)
    let TR = (Math.floor((tempY + (player.velY) + 16) / gridSize) * state.gridSize) + Math.floor((tempX + (player.velX) + 31) / gridSize)
    let BL = (Math.floor((tempY + (player.velY) + 31) / gridSize) * state.gridSize) + Math.floor((tempX + (player.velX)) / gridSize)
    let BR = (Math.floor((tempY + (player.velY) + 31) / gridSize) * state.gridSize) + Math.floor((tempX + (player.velX) + 31) / gridSize)

    if ((state.map[TL] === 1 || state.map[BL] === 1) && player.dir === 3) {
        player.velX = 0
    }
    else if ((state.map[TR] === 1 || state.map[BR] === 1) && player.dir === 1) {
        player.velX = 0
        player.x = tempX
    }
    else if ((state.map[TL] === 1 || state.map[TR] === 1) && player.dir === 0) {
        player.velY = 0
    }
    else if ((state.map[BL] === 1 || state.map[BR] === 1) && player.dir === 2) {
        player.velY = 0
    }

    player.x += player.velX * player.speed


    player.y += player.velY * player.speed

    if (player.velY || player.velX)
        player.isMoving = true

}