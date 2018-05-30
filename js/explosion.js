const ExpStep = function(dt) {
    this.t += dt
    if (this.scale > 0){
        this.scale -= dt * 40
    } else {
        this.board.remove(this)
    }
    let spread = 1
    this.pairs.map((e) => {
        e.x = this.centerX + this.t * spread * e.cosTheta
        e.y = this.centerY + this.t * spread * e.sinTheta
    })
}

const ExpDraw = function() {
    this.pairs.forEach((e) => {
        this.spriteSheet.draw(
            this.sprite, e.x, e.y, this.scale, null, true
        )
    })
}

const CreateExplosion = (game, spriteSheet, x, y, props) => {
    const exp = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    exp.centerX = x
    exp.centerY = y
    exp.scale = 10

    var theti = Array(randomRangeInt(10,15)).fill().map(() => {
        return randomRangeInt(0, 2*Math.PI*1000) / 1000
    })
    const initialSpread = 20
    exp.pairs = []
    exp.pairs = theti.map((e) => {
        const cosTheta = Math.cos(e),
              sinTheta = Math.sin(e)
        
        return {
            x: exp.centerX + initialSpread*cosTheta,
            y: exp.centerY + initialSpread*sinTheta,
            cosTheta: cosTheta,
            sinTheta: sinTheta
        }
    })
    exp.t = initialSpread
    
    Object.assign(exp, props || {})
    Object.assign(exp, {
        draw: ExpDraw,
        step: ExpStep
    })
    // console.log(exp)
    return exp
}