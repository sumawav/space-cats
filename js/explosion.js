const ExpStep = function(dt) {
    this.t += dt
    this.layers.forEach((layer) => {
        if (layer.scale > 0){
            layer.scale -= dt * layer.spread
        } else {
            layer.done = true
        }
        if (!layer.done){
            layer.pairs.map((e) => {
                e.t += dt * layer.spread
                e.x = this.centerX + e.t * e.vx
                e.y = this.centerY + e.t * e.vy
            })
        }
    })
    if (this.layers[0].done && this.layers[1].done && this.layers[2].done){
        this.board.remove(this)
        if (typeof this.callback === "function")
            this.callback()
    }
}

const ExpDraw = function() {
    this.layers.forEach((layer) => {
        if (!layer.done){
            layer.pairs.forEach((e) => {
                this.spriteSheet.draw(
                    this.sprite, e.x, e.y, 
                    layer.scale, layer.tint, 
                    true // draw squares centered
                )
            })
        }
    })

}

const CreateExplosion = (game, spriteSheet, x, y, props) => {
    const exp = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    exp.centerX = x
    exp.centerY = y

    const generateAngles = (min, max) => {
        return Array(randomRangeInt(min,max)).fill().map(() => {
            return randomRangeInt(0, 2*Math.PI*1000) / 1000
        })        
    }
    exp.layers = [
        { 
            pairs:[],
            scale: 20,
            spread: 60,
            tint: "0xff743f3f",  //createHexColor(63, 63, 116),
            thetas: generateAngles(10, 15)
        },
        { 
            pairs:[],
            scale: 15,
            spread: 40,
            tint: "0xff2671df", // createHexColor(223, 113, 38),
            thetas: generateAngles(5, 10)
        },
        { 
            pairs:[],
            scale: 10,
            spread: 20,
            tint: "0xff36f2fb", // createHexColor(251, 242, 54),
            thetas: generateAngles(2, 5)
        }
    ]
    exp.layers.map((layer) => {
        layer.pairs = layer.thetas.map((e) => {
            const vx = Math.cos(e),
                  vy = Math.sin(e),
                  initialSpread = randomRangeInt(0,20)
            return {
                x: exp.centerX + initialSpread*vx,
                y: exp.centerY + initialSpread*vy,
                vx: vx,
                vy: vy,
                t: initialSpread,
            }
        })
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