let DrawHud = function() {
    let slm = this.cat.sloMoMeter
    let coarse = Math.floor(slm /this.size)
    let fine = (slm % this.size)
    this.spriteSheet.draw(
        this.sprite, coarse * this.size - (this.size - fine), this.game.maxY - 3, this.size, 0xFF0000FF, false
    )
    for (let i = 0; i < coarse; ++i) {
        this.spriteSheet.draw(
            this.sprite, i*this.size, this.game.maxY - 3, this.size, 0xFF0000FF, false
        )
    }

}

let CreateHud = (game, spriteSheet, cat, size, props) => {
    const hud = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    hud.game = game
    hud.spriteSheet = spriteSheet
    hud.cat = cat
    hud.w = game.maxX
    hud.size = size || 16
    Object.assign(hud, props || {})
    Object.assign(hud, {
        step: ()=>{},
        draw: DrawHud
    })
    return hud
}