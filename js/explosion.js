const ExpStep = function(dt) {
    this.t += dt
    if (this.layer.scale > 0){
        this.layer.scale -= dt * 40
    } else {
        this.board.remove(this)
    }
    let spread = 40
    this.layer.pairs.map((e) => {
        e.t += dt * spread
        e.x = this.centerX + e.t * e.cosTheta
        e.y = this.centerY + e.t * e.sinTheta
    })
}

const ExpDraw = function() {
    this.layer.pairs.forEach((e) => {
        this.spriteSheet.draw(
            this.sprite, e.x, e.y, this.layer.scale, null, true
        )
    })
}

const CreateExplosion = (game, spriteSheet, x, y, props) => {
    const exp = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    exp.centerX = x
    exp.centerY = y
    // exp.scale = 20
    // create array of random angles [0, 2*PI]
    var theti = Array(randomRangeInt(10,15)).fill().map(() => {
        return randomRangeInt(0, 2*Math.PI*1000) / 1000
    })
    exp.layer = { 
        pairs:[],
        scale: 20
    }
    exp.layer.pairs = theti.map((e) => {
        const cosTheta = Math.cos(e),
              sinTheta = Math.sin(e),
              initialSpread = randomRangeInt(0,20)
        return {
            x: exp.centerX + initialSpread*cosTheta,
            y: exp.centerY + initialSpread*sinTheta,
            cosTheta: cosTheta,
            sinTheta: sinTheta,
            t: initialSpread,
        }
    })
    exp.t = 0
    
    Object.assign(exp, props || {})
    Object.assign(exp, {
        draw: ExpDraw,
        step: ExpStep
    })
    // console.log(exp)
    return exp
}