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
    if (closeEnough(this.y,this.target_y) && closeEnough(this.x, this.target_x)){
        this.x = this.target_x
        this.y = this.target_y
        return true
    } else {
        return false
    }
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
// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity
// H Time shift of vertical
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
// const horizontalSinusoid = function(dt){
//     this.t += dt
//     // constant horizontal velocity
//     this.vx = this.A 

//     this.x += this.vx * dt
//     this.y = this.E + this.F * Math.sin(this.G * (this.t) + this.H*window.QQQ)
// }
// const HORIZONTAL_SINUSOID_PATTERN = [
//     {
//         done: function() {
//             this.armed = true
//             this.t = 0
//             if (!window.QQ){
//                 window.QQQ = 0
//                 window.QQQQ = setInterval(()=> {
//                     window.QQQ += (1/60)
//                     // console.log(window.QQQ)
//                 }, 50)
//                 window.QQ = 55
//             }
//             window.QQ--

//             this.patterns.ptr++
//         }
//     },
//     {
//         ease: horizontalSinusoid,
//         done: () => {
//             if (window.QQ === 1){
//                 clearInterval(window.QQQQ)
//             }
//         }
//     }
// ]
const SNAKE_PATTERN = [
    {   
        done: function(){
            this.x = 0
            this.y = -100
            this.target_x = 0
            this.target_y = this.h
            this.wait = 30
            this.patterns.ptr++
        }
    },
    {// slide down
        ease: linearEasing,
        done: function(){
            this.target_x = this.game.maxX - this.w
            this.target_y = this.y
            this.wait = 90
            this.armed = true
            this.patterns.ptr++
        }
    },
    {//slide right
        ease: linearEasing,
        done: function(){
            this.target_y += this.h
            this.wait = 10
            this.armed = false
            this.patterns.ptr++
        }
    },
    {// slide down
        ease: linearEasing,
        done: function(){
            this.target_x = 0
            this.wait = 90
            this.armed = true
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
const STRAIGHT_WITH_BREAKS = [
    {   
        done: function(){
            console.log(this.patterns.ptr)
            this.y = -32
            this.target_x = this.x || 0
            this.target_y = this.h
            this.wait = 100
            this.patterns.ptr++
        }
    },
    {// slide down
        ease: linearEasing,
        done: function(){
            console.log(this.patterns.ptr)
            this.patterns.ptr++
        }
    },
    {// jump to left
        ease: basicEasing,
        done: function(){
            console.log(this.patterns.ptr)
            this.wait = 120
            this.patterns.ptr++
        }
    },
    {// stop and fire
        ease: attackWait,
        done: function(){
            console.log(this.patterns.ptr)
            this.armed = false
            const target = nnBnn(this.game,6,12,randomInt(3,5),randomInt(0,5))
            this.target_x = target.x
            this.target_y = target.y
            this.patterns.ptr++
        }
    },
    {// jump to right
        ease: basicEasing,
        done: function(){
            console.log(this.patterns.ptr)
            this.wait = 120
            this.patterns.ptr++
        }
    },
    {// stop and fire
        ease: attackWait,
        done: function(){
            console.log(this.patterns.ptr)
            this.armed = false
            const target = nnBnn(this.game,6,12,randomInt(0,2),randomInt(0,5))
            this.target_x = target.x
            this.target_y = target.y
            this.patterns.ptr = 2
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

const BOSS_1_PATTERN = [
    {
        ease: function(){
            this.target_x = 0
            this.target_y = 2*this.h
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
            this.target_y = 2*this.h
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
            if (randomInt(1,2) === 2){
                CURRENT_LEVEL.queue([
                    [0, 1000,  100, "snake", { enemyType: "black_cat", health: 8 }],
                ])
            }
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
