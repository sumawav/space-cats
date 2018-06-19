
const EnemyStep = function(dt){    
    const pattern = this.patterns.list[this.patterns.ptr]
    if (!pattern)
        debugger
    const done = !pattern.ease ? true : pattern.ease.call(this, dt)
    if (done)
        pattern.done.call(this)

    if (this.blink) {
        this.blinkTimer--
        this.sprite = this.spriteCache || this.sprite
        this.tint = this.tintCache || this.tint
        if (this.blinkTimer < 0){
            this.blink = false
        } else if (this.blinkTimer % 3 === 0){
            this.spriteCache = this.sprite
            this.sprite = "blank_cat"
            // tint is 0xAlpha Blue Green Red
            this.tintCache = this.tint
            this.tint = 0xFFD8FF00
        }
    }

    if (this.armed && this.runner){
        this.runner.x = this.x + this.w/2
        this.runner.y = this.y + this.h/2
        this.runner.update(dt)
    }
    
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
    if (this.health < 1){
        cat.sloMoMeter += 5
        this.game.score(this.points)
        this.board.remove(this)
        explosion_sound.play()
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
        .init(spriteSheet, override.enemyType || blueprint.enemyType)   //TODO should be .sprite
    Object.assign(en, {
        A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,t:0, // defaults
        x:0,y:-en.h,
        type: OBJECT_ENEMY,
        blink: false,
        tint: 0xFFFFFFFF,
        blinkTimer: 0,
        game: game,
        patterns: {
            list: [],
            ptr: null
        },
        ease: 0.05
    }, blueprint, override)
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
        case 9:
            return Danmaku_09.createRunner(config)
        case 8:
            return Danmaku_08.createRunner(config)
        case 7:
            return Danmaku_07.createRunner(config)
        case 6:
            return Danmaku_06.createRunner(config)
        case 5:
            return Danmaku_05.createRunner(config)
        case 4:
            return Danmaku_04.createRunner(config)
        case 3:
            return Danmaku_03.createRunner(config)
        case 2:
            return Danmaku_02.createRunner(config)
        case 1:
            return Danmaku_01.createRunner(config)
        case 0:
            return Danmaku_00.createRunner(config)
        default:
            return null
    }
}
