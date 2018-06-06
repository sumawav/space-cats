// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity
// H Time shift of vertical
const EnemyStep = function(dt){
    this.t += dt

    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D)
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H)
  
    this.x += this.vx * dt
    this.y += this.vy * dt

    if (this.blink) {
        this.blinkTimer--
        this.tint = 0xFFFFFFFF
        if (this.blinkTimer < 0)
            this.blink = false
        else if (this.blinkTimer % 2 === 0)
            this.tint = 0xFF0000FF
    }

    if (this.runner){
        this.runner.x = this.x + this.w/2
        this.runner.y = this.y + this.h/2
        this.runner.update(dt)
    }
    // const collision = this.board.collide(this, OBJECT_PLAYER)
    const collision = (this.bin && this.bin.length > 1) ? 
                      this.board.binCollide(this, OBJECT_PLAYER) : 
                      false
    if (collision) {
        collision.hit(this.damage)
        this.board.remove(this)
    }

    if (this.y > game.maxY || this.x < -this.w || this.x > game.width) {
        this.board.remove(this)
    } else {
        this.bin = this.board.reportPosition(this)
    }
    
}

const EnemyHit = function(damage){
    this.health -= damage
    if (this.health < 0){
        this.board.remove(this)
        this.board.add(CreateExplosion(
            game, spriteSheet, this.x + this.w/2, this.y + this.h/2
        ))        
    } else if(!this.blink) {
        this.blink = true
        this.blinkTimer = 10
    }

}

const CreateEnemy = function(game, spriteSheet, blueprint, override) {
    override = override || {}
    let en = Object
        .create(Sprite)
        .init(spriteSheet, override.enemyType || blueprint.enemyType)   
    Object.assign(en, {
        A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,t:0, // defaults
        type: OBJECT_ENEMY,
        blink: false,
        blinkTimer: 0,
    }, blueprint, override)
    Object.assign(en, {
        runner: createRunner(en.danmaku, danmakuConfig)
    })
    Object.assign(en, {
        draw: SpriteDraw,
        step: EnemyStep,
        hit: EnemyHit
    })
    return en
}
const createRunner = (danmaku, config) => {
    switch (danmaku){
        case 1:
            return Danmaku_01.createRunner(config)
            break
        default:
            return Danmaku_00.createRunner(config)
    }
}
