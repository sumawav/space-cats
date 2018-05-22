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
    };
    const STEP = 1000 / 60
    const timestamp = () => {
        return window.performance && 
            window.performance.now ? 
            window.performance.now() : 
            new Date().getTime();
    }
    const setupInput = () => {
        state.keys = {}
        window.addEventListener('keydown', function (e) {
            // console.log(e.keyCode);
            if (KEY_CODES[e.keyCode]) {
                state.keys[KEY_CODES[e.keyCode]] = true;
                e.preventDefault();
            }
        }, false)
        window.addEventListener('keyup', function (e) {
            if (KEY_CODES[e.keyCode]) {
                state.keys[KEY_CODES[e.keyCode]] = false;
                e.preventDefault();
            }
        }, false)
        state.canvas.onmousedown = function (evt) {
            console.log("mouse down")
            // add = true;
            // currentFrame = (currentFrame + 1) % frames.length;    
        };
        state.canvas.onmouseup = function (evt) {
            console.log("mouse up")
            // add = false;
        };
        state.canvas.ontouchstart = function (evt) {
            // add = true;
            // currentFrame = (currentFrame + 1) % frames.length;
        };
        state.canvas.ontouchend = function (evt) {
            // add = false;
        };
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
    // temporary
    const update = (step) => { 
        boards.map((b) => {
            b.step(step)
        })
    }
    const draw = () => { 
        state.renderer.cls()
        boards.map((b) => {
            b.draw(state.gl);
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
                callback();
        },
        setBoard: (num, board) => {
            boards[num] = board
        }
    }
    return Object.assign(state)
}

const CreateSpriteSheet = (opts) => {
    let options = opts || {},
        state = { map: {} }

    state = {
        load: (spriteData, gl, callback) => {
            state.map = spriteData
            let image = new Image()
            image.onload = () => {
                state.texture = TCTex(
                    gl, 
                    image,
                    image.width,
                    image.height
                )
                if (typeof callback === "function")
                    callback()
            }
            image.src = "img/cats.png"
        },
        draw: (canvas, sprite, x, y, frame) => {
            // canvas = TC object
            // sprite = frame dimensions
            // 
        }
    }
    return Object.assign(state)
}

const CreateTitleScreen = (title, subtitle, game, callback) => {
    let c = document.createElement("canvas")
    c.width = game.maxX
    c.height = game.maxY
    const ctx = c.getContext("2d")
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"
    ctx.font = "normal bold 40px kremlin"
    ctx.fillText(title, c.width/2, c.height/2);
    ctx.fillText(subtitle, c.width/2, (c.height/2) + 40);
    const cTexture = TCTex(game.gl, c, c.width, c.height)
    c = null
    let up = false

    let state = {
        x: 0,
        y: 0,
        scrollYDirection: false, // false - down, true - up
        scrollXDirection: false, // false - left, true - right
        step: (dt) => {
            if (state.y >= cTexture.height/2) 
                state.scrollYDirection = true
            if (state.y <= -cTexture.height/2)
                state.scrollYDirection = false
            if (state.x >= cTexture.width/2) 
                state.scrollXDirection = true
            if (state.x <= -cTexture.width/2)
                state.scrollXDirection = false
            let dY = state.scrollYDirection ? -4 : 6
            let dX = state.scrollXDirection ? -8 : 7
            state.y += dY/2
            state.x += dX/2

            if (!game.keys["space"])
                up = true
            if (up && game.keys["space"]) {
                if (typeof callback === "function")
                    callback()
            }
        },
        draw: () => {
            game.renderer.img(
                cTexture,
                0,
                0,
                cTexture.width,
                cTexture.height,
                0,
                state.x, //x
                state.y, //y
                1,
                1,
                0,
                0,
                1,
                1
            )
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
                    var col = (!type || this.type & type) && board.overlap(obj,this);
                    return col ? this : false;
                }
            })
        }

    }

    return Object.assign(state)
}