const ExpStep = function() {}

const ExpDraw = function() {
    this.pairs.forEach((e) => {
        this.spriteSheet.draw(
            this.sprite, e[0], e[1], this.scale, null
        )
    })
}

const CreateExplosion = (game, spriteSheet, props) => {
    const exp = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    exp.x = game.maxX / 2
    exp.y = game.maxY / 4
    exp.scale = 10

    var theti = Array(randomRangeInt(4,7)).fill().map(()=>{
        return randomRangeInt(0, 2*Math.PI*1000) / 1000
    })
    let radius = 30
    let pairs = theti.map((e) => {
        return [
            exp.x + radius*Math.cos(e),
            exp.y + radius*Math.sin(e)
        ]
    })
    exp.pairs = pairs
    console.log(pairs)
    Object.assign(exp, props || {})
    Object.assign(exp, {
        draw: ExpDraw,
        step: ()=>{}
    })
    console.log(exp)
    return exp
}