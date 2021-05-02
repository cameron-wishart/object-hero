module.exports = {
    spawner,
    idleMovement,
    findPlayer,
    attackPlayer,
}

const { skeleton } = require('../sprites/skeleton')

function spawner(curSpawner, curEnemies) {
    //console.log(curEnemies.length)
    let curTypeEnemies = curEnemies?.filter((enemy) => {
        if (enemy.type === curSpawner.type)
            return enemy
        return
    })
    if (curTypeEnemies.length < curSpawner.maxEnemies && curSpawner.coolDown === 0) {
        curSpawner.coolDown++
    }
    else if (curTypeEnemies.length < curSpawner.maxEnemies && curSpawner.coolDown < 50) {
        curSpawner.coolDown++
    }
    else if (curSpawner.coolDown === 50) {
        curEnemies.push(skeleton(Math.random() * ((curSpawner.maxX - 32) - curSpawner.minX) + curSpawner.minX, Math.random() * ((curSpawner.maxY - 32) - curSpawner.minY) + curSpawner.minY))
        curSpawner.coolDown = 0
    }
}

function idleMovement(enemy, gridSize, state) {


    let TL = Math.floor((enemy.y - 1) / gridSize) * 20 + Math.floor((enemy.x - 1) / gridSize)
    let BR = Math.floor((enemy.y + 33) / gridSize) * 20 + Math.floor((enemy.x + 33) / gridSize)

    if (enemy.tick < 30)
        switch (enemy.dir) {
            case 0:
                if (state.map[TL] !== 1 && enemy.y > state.enemySpawnAreas.skeletonSpawnArea.minY)
                    enemy.y -= enemy.speed
                break
            case 1:
                if (state.map[BR] !== 1 && enemy.x < state.enemySpawnAreas.skeletonSpawnArea.maxX)
                    enemy.x += enemy.speed
                break
            case 2:
                if (state.map[BR] !== 1 && enemy.y < state.enemySpawnAreas.skeletonSpawnArea.maxY)
                    enemy.y += enemy.speed
                break
            case 3:
                if (state.map[TL] !== 1 && enemy.x > state.enemySpawnAreas.skeletonSpawnArea.minX)
                    enemy.x -= enemy.speed
                break
            default:
        }
    else if (enemy.tick < 60) {

    }

}


function findPlayer(enemy, players, spawner) {

    for (player in players) {
        let tempPlayer = players[player]
        //console.log(tempPlayer)

        let distance = Math.sqrt(((tempPlayer.x - enemy.x) * (tempPlayer.x - enemy.x)) + ((tempPlayer.y - enemy.y) * (tempPlayer.y - enemy.y)))
        if (tempPlayer.y > spawner.skeletonSpawnArea.maxY || tempPlayer.x < spawner.skeletonSpawnArea.minX && enemy.target === player)
            enemy.target = null
        else if (distance < 100 || distance < enemy?.target) {
            enemy.target = player
        }
    }
}

function attackPlayer(enemy, players, spawner) {
    let targetPlayer = players[enemy.target]

    if (targetPlayer !== undefined) {

        let skeletonSpawn = spawner.skeletonSpawnArea
        let distance = Math.sqrt(((targetPlayer.x - enemy.x) * (targetPlayer.x - enemy.x)) + ((targetPlayer.y - enemy.y) * (targetPlayer.y - enemy.y)))

        if (targetPlayer.y > skeletonSpawn.maxY)
            enemy.target = null
        if (enemy.x < targetPlayer.x) {
            enemy.dir = 1
            enemy.x += enemy.speed * 2
        }
        else if (enemy.x > targetPlayer.x + 32) {
            enemy.dir = 3
            enemy.x -= enemy.speed * 2
        }
        else if (enemy.y > targetPlayer.y + 32) {
            enemy.dir = 0
            enemy.y -= enemy.speed * 2
        }
        else if (enemy.y < targetPlayer.y) {
            enemy.dir = 2
            enemy.y += enemy.speed * 2
        }

        if (distance <= 32 && enemy.tick === 0) {
            targetPlayer.isHit = true
            targetPlayer.health--
        }
    }
    else
        enemy.target = null
}