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
        40:"down",
        90:"z"
    }
    const STEP = 1 / 60
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
            // console.log("mouse down")
            // console.log("canvas x: " + evt.layerX)
            // console.log("canvas y: " + evt.layerY)
        }
        state.canvas.onmouseup = function (evt) {}
        state.canvas.ontouchstart = function (evt) {}
        state.canvas.ontouchend = function (evt) {}
    }
    const loop = () => {
        if (options.debug)
            fpsMeter.tick()
        let now = timestamp()
        dt += Math.min(1, (now - last) / 1000)
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

const CreateSpriteSheet = () => {
    let state = { map: {} }

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
        draw: (sprite, x, y, scale, tint) => {
            scale = scale || 1
            tint = tint || false
            const frame = state.map[sprite],
                tex = state.texture,
                u0 = frame.sx / tex.width,
                v0 = frame.sy / tex.height,
                u1 = u0 + (frame.w / tex.width),
                v1 = v0 + (frame.h / tex.height)
            const colCache = state.renderer.col
            if (tint)
                state.renderer.col = tint
            state.renderer.img(
                tex,
                0,0,                // initial rendering location before translation
                frame.w, 
                frame.h,
                0,                  // rotation
                x, y,               // translation
                scale,scale,        // scale (x, y)
                u0,                 // These values are x, y, w, h
                v0,                 // for the texture normalized
                u1,                 // to [0-1]
                v1                  // I hope that makes sense
            )
            state.renderer.col = colCache
        }
    }
    return Object.assign(state)
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
        iterate: function (funcName) {
            var args = Array.prototype.slice.call(arguments, 1)
            state.objects.forEach((e,i) => {
                e[funcName].apply(e, args)
            })
        },
        detect: (func) => {
            return state.objects.find((e) => {
                return func(e)
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
        overlap: (o1, o2) => {
            return !(
                (o1.y+o1.h-1<o2.y) || 
                (o1.y>o2.y+o2.h-1) ||
                (o1.x+o1.w-1<o2.x) || 
                (o1.x>o2.x+o2.w-1)
            )
        },
        collide: (obj, type) => {
            return state.detect((e) => {
                if (obj != e){
                    let col = (!type || e.type & type) && state.overlap(obj, e)
                    return col ? e : false
                }
            })
        },

    }
    return Object.assign(state)
}
