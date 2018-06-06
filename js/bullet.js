const BulletDraw = function() {
    this.spriteSheet.draw(
        this.sprite, this.x, this.y, this.scale, this.tint, true
    )
}

const BulletStep = function(dt) {
    this.runner.update(dt)
    this.x = this.runner.x
    this.y = this.runner.y

    const collision = (this.bin && this.bin.length > 1) ? 
                      this.board.binCollide(this, OBJECT_PLAYER) : 
                      false
    if (collision) {
        collision.hit(this.damage)
        this.board.remove(this)
    }
    
    this.areaCheck()
}

const BulletHit = function(damage) {
    this.board.remove(this)
}

const BulletAreaCheck = function() {
    if (this.x < 0 || this.game.maxX < this.x || this.y < 0 || this.game.maxY < this.y) {
        // console.log("Bullet Removed")
        this.board.remove(this);
    } else {
        this.bin = this.board.reportPosition(this)
    }
}

const CreateDanmakuBullet = (game, spreadSheet, runner, props) => {
    const bullet = Object
        .create(Sprite)
        .init(spriteSheet, "square")

    bullet.runner = runner
    bullet.type = OBJECT_ENEMY_PROJECTILE
    bullet.x = runner.x
    bullet.y = runner.y
    bullet.scale = 10
    bullet.tint = "0xFF" + "FF" + "88" + "88"
    bullet.game = game

    Object.assign(bullet, props || {})
    Object.assign(bullet, {
        draw: BulletDraw,
        step: BulletStep,
        hit: BulletHit,
        areaCheck: BulletAreaCheck,
    })

    return bullet
}