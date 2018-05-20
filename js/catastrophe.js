var canvas = TS(document.getElementById("canvas")),
    kittenTexture = null,
    fpsMeter = new FPSMeter({
        graph: 1,
        heat: 1,
        theme: "dark",
        interval: 50
    }),
    gl = canvas.g,
    kittenImage = new Image(),
    gravity = 0.5,
    random = Math.random,
    maxX = canvas.c.width,
    minX = 0,
    maxY = canvas.c.height,
    minY = 0,
    cellSize = 32,
    // counter = document.getElementById("kitten-count"),
    frames = [
        [0, 0, 32, 32],
        [0, 32, 32, 32],
        [0, 64, 32, 32],
        [0, 96, 32, 32]
    ],
    currentFrame = 0,
    kitten = null,
    now, 
    dt,
    last,
    level = 1;
    
var STEP = 1000 / 60
const KEY_CODES = { 
    37:"left", 
    38:"up", 
    39:"right", 
    40:"down", 
    32:"space" 
};

const Sprite = (x, y, texture, frameX, frameY, frameW, frameH) => {
    let u0 = frameX / texture.width,
        v0 = frameY / texture.height,
        u1 = u0 + (frameW / texture.width),
        v1 = v0 + (frameH / texture.height)
    let state = {
        positionX: x,
        positionY: y,
        width: frameW,
        height: frameH,
        texture: texture,
        speedX: 0,
        speedY: 0,
        rotation: 0,
        u0: frameX / texture.width,
        v0: frameY / texture.height,
        u1: u1,
        v1: v1,
        halfWidth: frameW / 2,
        updateList: [],
        update: (dt) => {
            state.updateList.forEach((e) => {
                state[e](dt)
            })
        }
    }
    return Object.assign(
        state, 
        canDraw(state), 
        hasControl(state),
        hasGravity(state)
    )
}

const canDraw = (state) => ({
    draw: () => {
        canvas.img(
            state.texture,
            // -state.halfWidth,
            0,
            0,
            state.width,
            state.height,
            state.rotation,
            state.positionX,
            state.positionY,
            1,
            1,
            state.u0,
            state.v0,
            state.u1,
            state.v1
        )
    }
})

const hasControl = (state) => {
    state.updateList.push("control")
    return {
        control: () => {
            if (keys.right) {
                state.positionX += cellSize
                keys.right = false
            }
            if (keys.left) {
                state.positionX -= cellSize
                keys.left = false
            }
            if (keys.down) {
                state.positionY += cellSize
                keys.down = false
            }
        }
    }
}

const hasGravity = (state) => {
    state.updateList.push("gravity")
    var dropTimerInit = 1000
    return {
        dropTimer: dropTimerInit,
        gravity: (dt) => {
            // console.log(dropTimerInit)
            state.dropTimer -= dt
            if (state.dropTimer < 0){
                state.positionY += cellSize
                state.dropTimer = dropTimerInit;
            }
        }
    }
}

function start() {
    var frame = frames[0]
    
    kitten = Sprite(minX, minY, kittenTexture, frame[0], frame[1], frame[2], frame[3])
    canvas.bkg(0.227, 0.227, 0.227);

    dt = 0
    last = timestamp()
    mainLoop();
}

function update(dt) {
    kitten.update(dt)
}

function draw() {
    canvas.cls()
    kitten.draw()
    canvas.flush()
}

function timestamp() {
    /*
        CAVEAT: performance.now() apparantly isn't high res:
        https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
    */
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function mainLoop() {
    fpsMeter.tick()
    now = timestamp()
    dt += Math.min(1000, (now - last))
    while(dt > STEP) {
        dt -= STEP
        update(STEP)
    }
    draw()
    last = now
    requestAnimationFrame(mainLoop)
}

keys = {}
window.addEventListener('keydown', function (e) {
    // console.log(e.keyCode);
    if (KEY_CODES[e.keyCode]) {
        keys[KEY_CODES[e.keyCode]] = true;
        e.preventDefault();
    }
}, false);
window.addEventListener('keyup', function (e) {
    if (KEY_CODES[e.keyCode]) {
        keys[KEY_CODES[e.keyCode]] = false;
        e.preventDefault();
    }
}, false);
  

canvas.c.onmousedown = function (evt) {
    console.log("mouse down")
    add = true;
    currentFrame = (currentFrame + 1) % frames.length;    
};
canvas.c.onmouseup = function (evt) {
    console.log("mouse up")
    add = false;
};
canvas.c.ontouchstart = function (evt) {
    add = true;
    currentFrame = (currentFrame + 1) % frames.length;
};
canvas.c.ontouchend = function (evt) {
    add = false;
};

kittenImage = new Image()
kittenImage.onload = function () {
    kittenTexture = TCTex(gl, kittenImage, kittenImage.width, kittenImage.height);
    start();
};
kittenImage.src = "img/cats.png"

