const CreateGame = (opts) => {
    let options = opts || {}
        boards = [],
        dt = 0,
        last = 0,
        fpsMeter = null,
        state = {}
    if (options.debug){
        fpsMeter = new FPSMeter({
            graph: 1,
            heat: 1,
            theme: "dark",
            interval: 50
        })  
    }
    const DEBUG_MODE = options.debug || false
    const KEY_CODES = { 
        32:"space", 
        37:"left", 
        38:"up", 
        39:"right", 
        40:"down"
    }
    const STEP = 1000 / 60
    const timestamp = () => {
        return window.performance && 
            window.performance.now ? 
            window.performance.now() : 
            new Date().getTime()
    }
    const setupInput = () => {
        state.keys = {}
        window.addEventListener('keydown', function (e) {
            // console.log(e.keyCode)
            if (KEY_CODES[e.keyCode]) {
                state.keys[KEY_CODES[e.keyCode]] = true
                e.preventDefault()
            }
        }, false)
        window.addEventListener('keyup', function (e) {
            if (KEY_CODES[e.keyCode]) {
                state.keys[KEY_CODES[e.keyCode]] = false
                e.preventDefault()
            }
        }, false)
        state.canvas.onmousedown = function (evt) {
            console.log("mouse down")
            console.log("canvas x: " + evt.layerX)
            console.log("canvas y: " + evt.layerY)
        }
        state.canvas.onmouseup = function (evt) {
            console.log("mouse up")
            // add = false
        }
        state.canvas.ontouchstart = function (evt) {
            // add = true
            // currentFrame = (currentFrame + 1) % frames.length
        }
        state.canvas.ontouchend = function (evt) {
            // add = false
        }
    }
    const loop = () => {
        if (options.debug)
            fpsMeter.tick()
        let now = timestamp()
        dt += Math.min(1000, (now - last))
        while(dt > STEP) {
            dt -= STEP
            update(STEP)
        }
        draw()
        last = now
        requestAnimationFrame(loop)
    }
    const update = (step) => { 
        boards.map((b) => {
            b.step(step)
        })
    }
    const draw = () => { 
        state.renderer.cls()
        boards.map((b) => {
            b.draw(state.gl)
        })
        state.renderer.flush()
    }
    state = {
        initialize: (canvasElementId, callback) => {
            state.renderer = TS(document.getElementById(canvasElementId))
            state.canvas = state.renderer.c
            state.gl = state.renderer.g
            state.gravity = 0.5
            state.maxX = state.renderer.c.width
            state.minX = 0
            state.maxY = state.renderer.c.height
            state.minY = 0
            state.cellSize = 32
            setupInput()
            last = timestamp()
            loop()

            if (typeof callback === "function")
                callback()
        },
        setBoard: (num, board) => {
            boards[num] = board
        },
        removeBoard: (num) => {
            boards.splice(num, 1)
        },
        debug: () => {
            console.log(boards)
        }
    }
    return Object.assign(state)
}

const CreateSpriteSheet = (opts) => {
    let options = opts || {},
        state = { map: {} }

    state = {
        load: (spriteData, renderer, callback) => {
            state.map = spriteData
            state.renderer = renderer
            let image = new Image()
            image.onload = () => {
                state.texture = TCTex(
                    state.renderer.g, 
                    image,
                    image.width,
                    image.height
                )
                if (typeof callback === "function")
                    callback()
            }
            image.src = "img/cats.png"
        },
        draw: (sprite, x, y, frameNumber) => {
            let frame = state.map[sprite],
                tex = state.texture
                u0 = frame.sx / tex.width,
                v0 = frame.sy / tex.height,
                u1 = u0 + (frame.w / tex.width),
                v1 = v0 + (frame.h / tex.height)
            state.renderer.img(
                tex,
                0,0,                // initial rendering location before translation
                frame.w, 
                frame.h,
                0,                  // rotation
                x, y,               // translation
                1,1,                // scale (x, y)
                u0,                 // These values are x, y, w, h
                v0,                 // for the texture normalized
                u1,                 // to [0-1]
                v1                  // I hope that makes sense
            )
        }
    }
    return Object.assign(state)
}

const CardDraw = function() {
    this.game.renderer.img(
        this.tex,
        -this.tex.width/2,
        -this.tex.height/2,
        this.tex.width,
        this.tex.height,
        this.rot,
        this.x, //x
        this.y, //y
        1,1,0,0,1,1
    )
}
const CardStep = function(dt) {
    if (!this.game.keys["space"])
        this.up = true
    if (this.up && this.game.keys["space"]) {
        if (typeof this.callback === "function")
            this.callback()
    }
}
const Card = {
    init: function(game, title, subtitle, callback) {
        let c = document.createElement("canvas")
        c.width = game.maxX
        c.height = 200
        const ctx = c.getContext("2d")
        ctx.fillStyle = "#00FFFF"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "normal bold 40px kremlin"
        ctx.fillText(title, c.width/2, c.height/2)
        ctx.font = "normal bold 20px kremlin"
        ctx.fillText(subtitle, c.width/2, (c.height/2) + 40)
        const cTexture = TCTex(game.gl, c, c.width, c.height)
        // document.body.appendChild(c)
        c = null

        this.up = false
        this.game = game
        this.x = game.maxX / 2
        this.y = game.maxY / 2
        this.tex = cTexture
        this.rot = 0
        this.callback = callback || null
        return this
    }
}
const MainTitleStep = function(dt) {
    if (this.y >= (this.game.maxY - this.tex.height/4))   
        this.scrollYDirection = false
    if (this.y <= 0 + this.tex.height/4)           
        this.scrollYDirection = true
    if (this.x >= this.game.maxX - this.tex.width/4)   
        this.scrollXDirection = false
    if (this.x <= 0 + this.tex.width/4)           
        this.scrollXDirection = true
    if (this.rot > Math.PI/14)
        this.rotationDir = false
    if (this.rot < -Math.PI/14)
        this.rotationDir = true
    this.rot += this.rotationDir ? .009 : -.01

    let dY = this.scrollYDirection ? 6 : -4
    let dX = this.scrollXDirection ? 7 : -8 
    this.y += dY/2
    this.x += dX/2

    if (!this.game.keys["space"])
        this.up = true
    if (this.up && this.game.keys["space"]) {
        if (typeof this.callback === "function")
            this.callback()
    }    
}
const CreateMainTitle = (game, title, subtitle, callback) => {
    let card = Object
        .create(Card)
        .init(game, title, subtitle, callback)

    Object.assign(card, {
        draw: CardDraw,
        step: MainTitleStep,
    })
    return card
}

const CreateGameBoard = () => {
    let state = {
        objects: [],
        cnt: {},
        add: (obj) => {
            obj.board = state
            state.objects.push(obj)
            state.cnt[obj.type] = (state.cnt[obj.type] || 0) + 1
            return obj
        },
        remove: (obj) => {
            let idx = state.removed.indexOf(obj)
            if (idx === -1) {
                state.removed.push(obj)
                return true
            } else {
                return false
            }
        },
        resetRemoved: () => state.removed = [],
        finalizeRemoved: () => {
            state.removed.forEach((e) => {
                let idx = state.objects.indexOf(e)
                if (idx !== -1) {
                    state.cnt[e.type]--
                    state.objects.splice(idx, 1)
                }
            })
        },
        // Interestingly, arrow functions don't have the arguments variable
        // that's why I'm using the classic syntax here
        iterate: function (funcName) {
            var args = Array.prototype.slice.call(arguments, 1)
            state.objects.forEach((e,i) => {
                e[funcName].apply(e, args)
            })
        },
        detect: (func) => {
            return state.objects.find((e) => {
                return func.call(e)
            }) || false
        },
        step: (dt) => {
            state.resetRemoved()
            state.iterate("step", dt)
            state.finalizeRemoved()
        },
        draw: (ctx) => {
            state.iterate("draw", ctx)
        },
        // TODO:
        // these variable names will likely change
        overlap: (o1, o2) => {
            return !((o1.y+o1.h-1<o2.y) || 
                    (o1.y>o2.y+o2.h-1) ||
                    (o1.x+o1.w-1<o2.x) || 
                    (o1.x>o2.x+o2.w-1))
        },
        // TODO: 
        // this is most likely broken, will deal with later
        collide: (obj, type) => {
            return state.detect(() => {
                if(obj != this) {
                    var col = (!type || this.type & type) && board.overlap(obj,this)
                    return col ? this : false
                }
            })
        }

    }
    return Object.assign(state)
}


const SpriteDraw = function() {
    this.spriteSheet.draw(this.sprite, this.x, this.y, null)
}
const Sprite = {
    init: function(spriteSheet, sprite, props) {
        this.spriteSheet = spriteSheet
        this.sprite = sprite || ""
        this.w = spriteSheet.map[sprite].w;
        this.h = spriteSheet.map[sprite].h;
        props = props || {}
        Object.assign(this, props)
        return this
    }
}



