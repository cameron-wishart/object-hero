
const skeleton = (X, Y) => {
    return {
        type: 'skeleton',
        x: X,
        y: Y,
        speed: 1,
        dir: 2,
        target: null,
        tick: 0,
        anim: 0,
        health: 2,
    }
}

module.exports = {
    skeleton
}