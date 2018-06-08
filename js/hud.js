let DrawHud = function() {
    let slm = this.cat.sloMoMeter
    let coarse = Math.floor(slm /this.size)
    let fine = (slm % this.size)
    this.spriteSheet.draw(
        this.sprite, coarse * this.size - (this.size - fine), this.game.maxY - this.size, this.size, 0xFF0000FF, false
    )
    for (let i = 0; i < coarse; ++i) {
        this.spriteSheet.draw(
            this.sprite, i*this.size, this.game.maxY - this.size, this.size, 0xFF0000FF, false
        )
    }
    if (this.numbersTex){
        let thisScore = score
        let scoreDigitLength = 0
        thisScore.toString().split("").forEach((digit,i) => {
            const frame = HUD[digit],
            u0 = frame.sx / this.numbersTex.width,
            v0 = frame.sy / this.numbersTex.height,
            u1 = u0 + (frame.w / this.numbersTex.width),
            v1 = v0 + (frame.h / this.numbersTex.height)
            this.game.renderer.img(
                this.numbersTex,
                scoreDigitLength, this.game.maxY - 35,
                frame.w,
                frame.h,
                0,
                0,0,
                1,
                1,
                u0,v0,u1,v1
            )
            scoreDigitLength += frame.w + 1 
        })

    }

}

const HUD = {
    0: { sx: 0, sy: 6, w: 25, h: 30, frames: 1 },
    1: { sx: 27, sy: 6, w: 14, h: 30, frames: 1 },
    2: { sx: 44, sy: 6, w: 25, h: 30, frames: 1 },
    3: { sx: 72, sy: 6, w: 25, h: 30, frames: 1 },
    4: { sx:100, sy: 6, w: 25, h: 30, frames: 1 },
    5: { sx:127, sy: 6, w: 26, h: 30, frames: 1 },
    6: { sx:155, sy: 6, w: 26, h: 30, frames: 1 },
    7: { sx:183, sy: 6, w: 25, h: 30, frames: 1 },
    8: { sx:211, sy: 6, w: 25, h: 30, frames: 1 },
    9: { sx:239, sy: 6, w: 25, h: 30, frames: 1 },

}

let CreateHud = (game, spriteSheet, cat, size, props) => {
    const hud = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    hud.size = size || 16
    let c = document.createElement("canvas")
    c.width = game.maxX
    c.height = 40
    const ctx = c.getContext("2d")
    ctx.fillStyle = "#00FFFF"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.font = "normal bold 40px kremlin"
    ctx.fillText("0123456789", 0, 0)
    const cTexture = TCTex(game.gl, c, c.width, c.height)
    // document.body.appendChild(c)
    c = null

    hud.numbersTex = cTexture
    hud.game = game
    hud.spriteSheet = spriteSheet
    hud.cat = cat
    hud.w = game.maxX
    Object.assign(hud, props || {})
    Object.assign(hud, {
        step: ()=>{},
        draw: DrawHud
    })
    return hud
}