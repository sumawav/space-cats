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
    const done = pattern.ease.call(this, dt)
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

const TEST_PATTERN3 = [
    {
        ease: function(){
            this.x = randomRangeInt(0, this.game.maxX - this.w)
            this.y = -this.h
            this.target_x = this.x
            this.target_y = this.game.maxY + 5
            return true
        },
        done: function(){
            this.patterns.ptr++
            this.wait = 300
            this.runner = createRunner(0, danmakuConfig)
            this.runnerActive = true
        },
    },
    {
        ease: linearEasing,
        done: function(){
            this.patterns.ptr++
        }
    },
    {
        ease: ()=>{}
    }
]

const TEST_PATTERN = [
    {
        ease: function(){
            this.target_x = 0
            this.target_y = 0
            return true
        },
        done: function(){
            this.patterns.ptr++
        }
    },
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
        ease: attackWait,
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
        ease: attackWait,
        done: function(){
            console.log("tock")
            this.runnerActive = false
            this.patterns.ptr = 1
        }
    },
]

const TEST_PATTERN2 = [
    {
        ease: function(){
            this.target_x = 0
            this.target_y = 0
            return true
        },
        done: function(){
            this.patterns.ptr++
        }
    },
    {
        ease: basicEasing,
        done: function(){
            this.target_x = this.game.maxX - this.w
            this.target_y = 0
            this.runner = createRunner(5, danmakuConfig)
            this.wait = 205
            this.runnerActive = true
            this.patterns.ptr++
        }
    },
    {
        ease: function(dt){
            this.wait -= dt * 60
            const vx = (this.target_x - this.x)/this.wait
            this.x += vx * dt * 60
            return (closeEnough(this.y,this.target_y) && closeEnough(this.x, this.target_x))
        },
        done: function(){
            this.wait = 30
            this.runnerActive = false
            this.patterns.ptr++
        }
    },
    {
        ease: stillWait,
        done: function(){      
            this.target_x = randomRangeInt(this.game.maxX/4, this.game.maxX/2)
            this.target_y = randomRangeInt(0.1*this.game.maxY, 0.2*this.game.maxY)
            this.runner = createRunner(4, danmakuConfig)      
            this.patterns.ptr++
        }
    },
    {
        ease: basicEasing,
        done: function(){            
            this.wait = 150
            this.patterns.ptr++
        }
    },    
    {
        ease: attackWait,
        done: function(){
            this.runnerActive = false
            this.target_x = randomRangeInt(this.game.maxX/2, 3*this.game.maxX/4)
            this.target_y = randomRangeInt(0.1*this.game.maxY, 0.2*this.game.maxY)
            this.runner = createRunner(2, danmakuConfig)               
            this.patterns.ptr++
        }
    },
    {
        ease: basicEasing,
        done: function(){         
            this.wait = 150
            this.patterns.ptr++
        }
    },
    {
        ease: attackWait,
        done: function(){
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
        },
        ease: 0.05
    }, blueprint, override)
    Object.assign(en, {
        originalSprite: en.sprite
    })
    Object.assign(en, {
        runners: createRunner(en.danmaku, danmakuConfig),
        runnerActive: false
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
