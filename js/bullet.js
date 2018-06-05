const BulletDraw = function() {
    this.spriteSheet.draw(
        this.sprite, this.x, this.y, this.scale, this.tint, true
    )
}

const BulletHit = function(damage) {
    this.board.remove(this)
}

const BulletAreaCheck = function() {
    if (this.x < 0 || this.game.maxX < this.x || this.y < 0 || this.game.maxY < this.y) {
        console.log("Bullet Removed")
        this.board.remove(this);
    }
}

const CreateBullet = (game, spreadSheet, x, y, props) => {
    const bullet = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    bullet.x = x
    bullet.y = y
    bullet.scale = 10
    bullet.tint = "0xFF" + "FF" + "88" + "88"
    bullet.game = game

    Object.assign(bullet, props || {})
    Object.assign(bullet, {
        draw: BulletDraw,
        step: ()=>{},
        hit: BulletHit,
        areaCheck: BulletAreaCheck
    })

    return bullet
}