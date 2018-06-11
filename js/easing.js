// easing functions
const skipEasing = () => true
const infiniteWaitEasing = () => {}
const basicEasing = function(dt){
    if (this.target_x === undefined && this.target_y === undefined)
        return true
    const vx = (this.target_x - this.x) * this.ease,
          vy = (this.target_y - this.y) * this.ease
    this.x += vx * dt * 60
    this.y += vy * dt * 60
    return (closeEnough(this.y,this.target_y) && closeEnough(this.x, this.target_x))
}
const linearEasing = function(dt){
    this.wait -= dt * 60
    if (this.wait <= 0){
        this.x = this.target_x
        this.y = this.target_y
        return true
    }
    const vx = (this.target_x - this.x)/this.wait
    const vy = (this.target_y - this.y)/this.wait
    this.x += vx * dt * 60
    this.y += vy * dt * 60
    // return (closeEnough(this.y,this.target_y) && closeEnough(this.x, this.target_x))
    return false

}
const attackWait = function(dt){
    this.wait -= dt * 60
    this.armed = true
    return this.wait < 0
}
const stillWait = function(dt){
    this.wait -= dt * 60
    this.armed = false
    return this.wait < 0
}
const cykodEasing = function(dt){
    this.t += dt
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D)
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H)
    
    this.x += this.vx * dt
    this.y += this.vy * dt
}
const CYKOD_PATTERN = [
    {
        done: function() {
            this.armed = true
            this.patterns.ptr++
        }
    },
    {
        ease: cykodEasing,
        done: () => {}
    }
]

const SNAKE_PATTERN = [
    {   
        done: function(){
            this.x = 0
            this.y = -100
            this.target_x = 0
            this.target_y = this.h
            this.wait = 30
            this.patterns.ptr++
            this.sprite = "green_cat"
        }
    },
    {// slide down
        ease: linearEasing,
        done: function(){
            this.target_x = this.game.maxX - this.w
            this.target_y = this.y
            this.wait = 90
            this.patterns.ptr++
        }
    },
    {//slide right
        ease: linearEasing,
        done: function(){
            this.target_y += this.h
            this.wait = 10
            this.patterns.ptr++
        }
    },
    {// slide down
        ease: linearEasing,
        done: function(){
            this.target_x = 0
            this.wait = 90
            this.patterns.ptr++
        }
    },
    {// slide left
        ease: linearEasing,
        done: function(){
            this.target_y += this.h
            this.wait = 10
            this.patterns.ptr = 1
        }
    },
]

const PING_PONG_PATTERN = [
    {
        ease: basicEasing,
        done: function() {
            const target = nnBnn(this.game,6,12,null,randomInt(2,7))
            this.target_x = target.x
            this.target_y = target.y
            this.runner = createRunner(4, danmakuConfig)
            this.armed = true
            this.wait = 55
            this.patterns.ptr++
        }        
    },
    {
        ease: attackWait,
        done: function() {
            this.runner = createRunner(2, danmakuConfig)
            this.patterns.ptr++
        }
    },
    {
        ease: basicEasing,
        done: function() {
            const target = nnBnn(this.game,6,12,null,randomInt(5,10))
            this.target_x = target.x
            this.target_y = target.y
            this.wait = 155        
            this.patterns.ptr++
        }
    },
    {
        ease: attackWait,
        done: function() {
            // this.armed = false
            this.patterns.ptr=0
        }
    },
]

const TEST_PATTERN3 = [
    {
        ease: skipEasing,
        done: function(){
            this.x = randomInt(0, this.game.maxX - this.w)
            this.y = -this.h
            this.target_x = this.x
            this.target_y = this.game.maxY + 5
            this.wait = 400
            this.runner = createRunner(0, danmakuConfig)
            this.armed = true
            this.patterns.ptr++
        },
    },
    {
        ease: linearEasing,
        done: function(){
            this.patterns.ptr++
        }
    },
    {
        ease: infiniteWaitEasing
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
            this.target_x = randomInt(this.game.maxX/2, 3*this.game.maxX/4)
            this.target_y = randomInt(0.1*this.game.maxY, 0.2*this.game.maxY)
            this.runner = createRunner(4, danmakuConfig)
            this.wait = 200
            this.patterns.ptr++
        }
    },
    {
        ease: attackWait,
        done: function(){
            console.log("tock")
            this.armed = false
            this.patterns.ptr++
        }
    },
    {
        ease: basicEasing,
        done: function(){
            console.log("tick")
            this.target_x = randomInt(this.game.maxX/4, this.game.maxX/2)
            this.target_y = randomInt(0.1*this.game.maxY, 0.2*this.game.maxY)
            this.runner = createRunner(2, danmakuConfig)
            this.wait = 150
            this.patterns.ptr++
        }
    },    
    {
        ease: attackWait,
        done: function(){
            console.log("tock")
            this.armed = false
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
            this.armed = true
            this.patterns.ptr++
        }
    },
    {
        ease: linearEasing,
        done: function(){
            this.wait = 30
            this.armed = false
            this.patterns.ptr++
        }
    },
    {
        ease: stillWait,
        done: function(){      
            this.target_x = randomInt(this.game.maxX/4, this.game.maxX/2)
            this.target_y = randomInt(0.1*this.game.maxY, 0.2*this.game.maxY)
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
            this.armed = false
            this.target_x = randomInt(this.game.maxX/2, 3*this.game.maxX/4)
            this.target_y = randomInt(0.1*this.game.maxY, 0.2*this.game.maxY)
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
            this.armed = false
            this.patterns.ptr = 0
        }
    },
]
