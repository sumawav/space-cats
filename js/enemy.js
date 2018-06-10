// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity
// H Time shift of vertical
const EnemyStep = function(dt){

    if (this.altStep){
        const pattern = this.patterns.list[this.patterns.ptr]
        const done = pattern.ease.call(this, dt, this.target_x, this.target_y, this.wait)
        if (done)
            pattern.done.call(this)
    } else {
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
        else if (this.blinkTimer % 4 === 0)
            this.sprite = "blank_cat"
    }

    if (this.runnerActive){
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

const startup = function() {
    this.target_x = randomRangeInt(this.game.maxX/2, 3*this.game.maxX/4)
    this.target_y = randomRangeInt(0.1*this.game.maxY, 0.2*this.game.maxY)
    this.ease = 0.05
    this.patterns.list = TEST_PATTERN
    this.patterns.ptr = 0
    this.altStep = true
}

const TEST_PATTERN = [
    {
        ease: basicEasing,
        done: function(){
            console.log("tick")
            this.target_x = randomRangeInt(this.game.maxX/2, 3*this.game.maxX/4)
            this.target_y = randomRangeInt(0.1*this.game.maxY, 0.2*this.game.maxY)
            this.runner = createRunner(4, danmakuConfig)
            this.wait = 200
            this.patterns.ptr++
        }
    },
    {
        ease: basicWait,
        done: function(){
            console.log("tock")
            this.runnerActive = false
            this.patterns.ptr++
        }
    },
    {
        ease: basicEasing,
        done: function(){
            console.log("tick")
            this.target_x = randomRangeInt(this.game.maxX/4, this.game.maxX/2)
            this.target_y = randomRangeInt(0.1*this.game.maxY, 0.2*this.game.maxY)
            this.runner = createRunner(2, danmakuConfig)
            this.wait = 150
            this.patterns.ptr++
        }
    },    
    {
        ease: basicWait,
        done: function(){
            console.log("tock")
            this.runnerActive = false
            this.patterns.ptr = 0
        }
    },
]


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
        game: game,
        patterns: {
            list: [],
            ptr: null
        }
    }, blueprint, override)
    Object.assign(en, {
        originalSprite: en.sprite
    })
    Object.assign(en, {
        runner: createRunner(en.danmaku, danmakuConfig),
        runnerActive: false
    })
    Object.assign(en, {
        draw: SpriteDraw,
        step: EnemyStep,
        hit: EnemyHit,
        startup: startup
    })
    return en
}
const createRunner = (danmaku, config) => {
    switch (danmaku){
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
            // return Danmaku_00.createRunner(config)
            return null
    }
}
