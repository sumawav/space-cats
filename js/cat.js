const CatStep = function(dt){
    this.reload -= dt
    const gKeys = this.game.keys
    if (gKeys.right)
        this.vx = this.maxVel
    else if (gKeys.left)    
        this.vx = -this.maxVel
    else 
        this.vx = 0

    if (gKeys.down)    
        this.vy = this.maxVel
    else if (gKeys.up) 
        this.vy = -this.maxVel 
    else 
        this.vy = 0
    // shoot
    if (gKeys.z && !this.zDown && this.reload < 0) {
        // console.log("Z DOWN")
        this.reload = this.reloadTime
        let cmL = CreateCatMissile(
            game, spriteSheet, this.x, this.y
        )
        let cmR = CreateCatMissile(
            game, spriteSheet, this.x+this.w, this.y
        )
        this.board.add(cmL)
        this.board.add(cmR)

        this.zDown = true
    } else if (!gKeys.z && this.zDown){
        // console.log("Z UP")
        this.zDown = false
    }
    // text explosion
    if (gKeys.q && !this.qDown){
        this.board.add(CreateExplosion(
            game, spriteSheet, this.x, this.y
        ))
        this.qDown = true
    } else if (!gKeys.q && this.qDown){
        this.qDown = false
    }
    // slow motion
    if (gKeys.space && !this.spaceDown){
        console.log("slomo")
        game.sloMoFactor = 5
        this.spaceDown = true
    } else if (!gKeys.space && this.spaceDown){
        console.log("normalspeed")
        this.game.sloMoFactor = 1
        this.spaceDown = false
    }

    this.x += this.vx * dt /* * this.game.sloMoFactor */
    this.y += this.vy * dt /* * this.game.sloMoFactor */

    this.board.reportPosition(this)

}

const CatHit = function(damage){
    this.board.remove(this)
    this.game.sloMoFactor = 6
    this.board.add(CreateExplosion(
        game, spriteSheet, this.x + this.w/2, this.y + this.h/2,
        {
            callback: ()=> this.game.sloMoFactor = 1
        }
    ))
    GameOver()
}

const CreateCat = (game, spriteSheet, catType, props) => {
    let cat = Object
        .create(Sprite)
        .init(spriteSheet, catType)
    cat.game = game
    cat.x = game.maxX/2 - cat.w/2
    cat.y = game.maxY - game.playerOffset - cat.h
    cat.reloadTime = 0.10
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

    const collision = (this.bin && this.bin.length > 1) ? 
                      this.board.binCollide(this, OBJECT_ENEMY) : 
                      false
    if (collision){
        collision.hit(this.damage)
        this.board.remove(this)
    }else if (this.y < -this.h) {
        this.board.remove(this)
    } else {
        this.bin = this.board.reportPosition(this)
    }
}
const CreateCatMissile = (game, spriteSheet, x, y, props) => {
    let missile = Object
        .create(Sprite)
        .init(spriteSheet, "cat_missile", {
            vy: -700,
            damage: 1
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
