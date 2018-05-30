const CatStep = function(dt){
    this.reload -= dt
    const gKeys = this.game.keys
    if (gKeys.right)   this.x += 3
    if (gKeys.left)    this.x -= 3
    if (gKeys.down)    this.y += 3
    if (gKeys.up)      this.y += -3
    if (gKeys.z && this.reload < 0) {
        this.reload = this.reloadTime
        let cmL = CreateCatMissile(
            game, spriteSheet, this.x, this.y
        )
        let cmR = CreateCatMissile(
            game, spriteSheet, this.x+this.w, this.y
        )
        this.board.add(cmL)
        this.board.add(cmR)
        gKeys.z = false
    }
    if (gKeys.q && !this.qDown){
        this.board.add(CreateExplosion(
            game, spriteSheet, this.x, this.y
        ))
        this.qDown = true
    } else if (!gKeys.q && this.qDown){
        this.qDown = false
    }
    if (gKeys.space && !this.spaceDown){
        console.log("slomo")
        game.sloMoFactor = 5
        this.spaceDown = true
    } else if (!gKeys.space && this.spaceDown){
        console.log("normalspeed")
        game.sloMoFactor = 1
        this.spaceDown = false
    }
}

const CatHit = function(damage){
    this.board.remove(this)
    this.board.add(CreateExplosion(
        game, spriteSheet, this.x + this.w/2, this.y + this.h/2
    ))
    GameOver()
}

const CreateCat = (game, spriteSheet, catType, props) => {
    let cat = Object
        .create(Sprite)
        .init(spriteSheet, catType)
    cat.game = game
    cat.x = game.maxX / 2
    cat.y = game.maxY / 2
    cat.reloadTime = 0.25
    cat.spaceDown = true
    cat.reload = cat.reloadTime
    cat.type = OBJECT_PLAYER

    Object.assign(cat, props || {})
    Object.assign(cat, {
        draw: SpriteDraw,
        step: CatStep,
        hit: CatHit,
    })
    return cat
}
const CatMissileStep = function(dt) {
    this.y += this.vy * dt

    const collision = this.board.collide(this, OBJECT_ENEMY)
    if (collision){
        collision.hit(this.damage)
        this.board.remove(this)
    }else if (this.y < -this.h) {
        this.board.remove(this)
    }
}
const CreateCatMissile = (game, spriteSheet, x, y, props) => {
    let missile = Object
        .create(Sprite)
        .init(spriteSheet, "cat_missile", {
            vy: -700,
            damage: 10
        })
    missile.x = x - missile.w / 2
    missile.y = y - missile.h
    missile.type = OBJECT_PLAYER_PROJECTILE
    Object.assign(missile, props || {})
    Object.assign(missile, {
        draw: SpriteDraw,
        step: CatMissileStep
    })
    return missile
}
