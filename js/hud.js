const DrawHud = function() {
    let slm = this.cat.sloMoMeter
    let coarse = Math.floor(slm /this.size)
    let fine = (slm % this.size)
    this.spriteSheet.draw(
        this.sprite, coarse * this.size - (this.size - fine), 0, this.size, 0xFF0000FF, false
    )
    for (let i = 0; i < coarse; ++i) {
        this.spriteSheet.draw(
            this.sprite, i*this.size, 0, this.size, 0xFF0000FF, false
        )
    }
    let scoreDigitLength = 0
    this.dScore.toString().split("").forEach((digit) => {
        this.numberSheet.draw(digit, scoreDigitLength, 5, 1, null, false)
        scoreDigitLength += this.numberSheet.map[digit].w + 1
    })
}

const StepHud = function(dt){
    if (this.dScore < this.game.gameScore){
        if ((this.game.gameScore - this.dScore) > 100){
            this.dScore += 100
        } else
            this.dScore++
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
    9: { sx:239, sy: 6, w: 25, h: 30, frames: 1 }
}

let CreateHud = (game, spriteSheet, cat, size, props) => {
    const hud = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    hud.size = size || 16
    hud.game = game
    hud.spriteSheet = spriteSheet
    hud.cat = cat
    hud.w = game.maxX
    hud.dScore = 0;
    Object.assign(hud, props || {})
    Object.assign(hud, {
        step: StepHud,
        draw: DrawHud
    })
    return hud
}