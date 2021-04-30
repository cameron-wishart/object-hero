module.exports = {
    spawner
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

function spawnEnemy() {

}