// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity
// H Time shift of vertical
const EnemyStep = function(dt){    
    const pattern = this.patterns.list[this.patterns.ptr]
    const done = !pattern.ease ? true : pattern.ease.call(this, dt)
    if (done)
        pattern.done.call(this)

    // i'd like to hold on to this
    if(0){
        this.t += dt
        this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D)
        this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H)
        
        this.x += this.vx * dt
        this.y += this.vy * dt
    }

    if (this.blink) {
        this.blinkTimer--
        this.sprite = this.originalSprite
        if (this.blinkTimer < 0)
            this.blink = false
        else if (this.blinkTimer % 3 === 0)
            this.sprite = "blank_cat"
    }

    if (this.armed){
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
    } else if (this.y > game.maxY || this.x < -this.w || this.x > game.maxX) {
        this.board.remove(this)
    } else {
        this.bin = this.board.reportPosition(this)
    }
}

const EnemyHit = function(damage, cat){
    this.health -= damage
    if (this.health < 0){
        if (this.game.sloMoFactor === 1)
            cat.sloMoMeter += 5
        this.game.score(this.points)
        this.board.remove(this)
        this.board.add(CreateExplosion(
            game, spriteSheet, this.x + this.w/2, this.y + this.h/2
        ))        
    } else if(!this.blink) {
        this.blink = true
        this.blinkTimer = 15
    }

}

const CreateEnemy = function(game, spriteSheet, blueprint, override) {
    override = override || {}
    let en = Object
        .create(Sprite)
        .init(spriteSheet, override.enemyType || blueprint.enemyType)   
    Object.assign(en, {
        A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,t:0, // defaults
        x:0,y:-en.h,
        type: OBJECT_ENEMY,
        blink: false,
        blinkTimer: 0,
        game: game,
        patterns: {
            list: [],
            ptr: null
        },
        ease: 0.05
    }, blueprint, override)
    Object.assign(en, {
        originalSprite: en.sprite
    })
    Object.assign(en, {
        runner: createRunner(en.danmaku, danmakuConfig),
        armed: false
    })
    Object.assign(en, {
        draw: SpriteDraw,
        step: EnemyStep,
        hit: EnemyHit,
    })
    return en
}

const createRunner = (danmaku, config) => {
    switch (danmaku){
        case 5:
            return Danmaku_05.createRunner(config)
            break            
        case 4:
            return Danmaku_04.createRunner(config)
            break            
        case 3:
            return Danmaku_03.createRunner(config)
            break
        case 2:
            return Danmaku_02.createRunner(config)
            break
        case 1:
            return Danmaku_01.createRunner(config)
            break
        default:
            return Danmaku_00.createRunner(config)
    }
}
