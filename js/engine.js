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
        boards.map((b) => {
            b.draw(state.gl);
        })        
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
            state.boards[num] = board
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
    const c = document.createElement("canvas")
    c.width = game.maxX
    c.height = game.maxY
    const ctx = c.getContext("2d")
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"
    ctx.font = "normal bold 40px kremlin"
    ctx.fillText(title, c.width/2, c.height/2);
    ctx.fillText(subtitle, c.width/2, (c.height/2) + 40);
    const cTexture = TCTex(game.gl, c, c.width, c.height)
    let up = false

    let state = {
        step: (dt) => {
            if (game.keys["space"]) {
                if (typeof callback === "function")
                    callback()
            }
        },
        draw: () => {
            game.renderer.img(
                testTexture,
                0,
                0,
                test.width,
                test.height,
                0,
                0,
                0,
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