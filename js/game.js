const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy: 32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy: 64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy: 96, w: 32, h: 32, frames: 1 },
    cat_missile:{ sx: 8, sy:32 + 8, w: 4, h: 16, frames: 1 },
};

var deleteme = 0

const game = CreateGame({
    debug: true
})

const spriteSheet = CreateSpriteSheet()

const startGame = () => {
    game.renderer.bkg(0.0, 0.0, 0.0);
    let titleScreenBoard = CreateMainTitle(
        game,
        "SPACE CATS",
        "press spacebar",
        playGame
    )
    let starField = CreateStarField(game, { 
        centerX: game.maxX/4,
        centerY: game.maxY/4 }
    )
    game.setBoard(0, starField)
    game.setBoard(1, titleScreenBoard)
}

const playGame = () => {
    let board = CreateGameBoard();
    let cat = CreateCat(game, spriteSheet, "orange_cat")
    board.add(cat)
    game.setBoard(1, board)
}

const loadSprites = () => {
    spriteSheet.load(SPRITES, game.renderer, startGame)    
}

window.addEventListener("load", () => { 
    game.initialize("canvas", loadSprites) 
})

const CreateStarField = (game, opt) => {
    var options = {
        count: opt.count || 512,
        depth: opt.depth || 32,
        density: opt.density || 128,
        centerX: opt.centerX || game.maxX/2,
        centerY: opt.centerY || game.maxY
    }
    let stars = []

    const randomRange = (minVal,maxVal) => {
        return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
    }

    for (let i = 0; i < options.count; ++i){
        stars[i] = {
            x: randomRange(-25,25),
            y: randomRange(-25,25),
            z: randomRange(0, options.depth)
        }
    }

    let c = document.createElement("canvas")
    c.width = 1
    c.height = 1
    const ctx = c.getContext("2d")
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0,0,c.width,c.height)
    const cTexture = TCTex(game.gl, c, c.width, c.height)
    c = null

    let state = {
        stars: stars,
        depth: options.depth,
        density: options.density,
        centerX: options.centerX,
        centerY: options.centerY,
        step: () => {
            state.stars.forEach((star, i, a) => {
                star.z -= 0.2
                if (star.z <= 0)
                    star = {
                        x: randomRange(-25,25),
                        y: randomRange(-25,25),
                        z: state.depth
                    }
                let k = state.density / star.z
                star.px = k * star.x + state.centerX 
                star.py = k * star.y + state.centerY
                star.size = (1 - star.z / state.depth) * 2
                a[i] = star
            })
        },
        draw: () => {
            let cacheCol = game.renderer.col
            state.stars.forEach((star) => {
                if (star.px >= 0 && star.px <= game.maxX && 
                    star.py >= 0 && star.py <= game.maxY) {
                    // let shade = parseInt(Math.min((1 - star.z / depth)*1.5,1) * 255);
                    // let shadeStr = shade.toString(16)
                    // game.renderer.col = "0xFF" + shadeStr + shadeStr + shadeStr
                    game.renderer.img(
                        cTexture,
                        0,
                        0,
                        cTexture.width,
                        cTexture.height,
                        0,
                        star.px,
                        star.py,
                        star.size,
                        star.size,
                        0,0,1,1
                    )
                }
            })
            game.renderer.col = cacheCol
        }
    }
    return Object.assign(state)
}

const CatStep = function(dt){
    let game = this.game
    if (game.keys.right) {
        this.x += 3
    }
    if (game.keys.left) {
        this.x -= 3
    }
    if (game.keys.down) {
        this.y += 3
    }
    if (game.keys.up) {
        this.y += -3
    }
    if (game.keys.space) {
        let cmL = CreateCatMissile(
            game, spriteSheet, this.x, this.y
        )
        let cmR = CreateCatMissile(
            game, spriteSheet, this.x+this.w, this.y
        )
        console.log(cmL)
        this.board.add(cmL)
        this.board.add(cmR)
        game.keys.space = false
    }
}
const CreateCat = (game, spriteSheet, catType, props) => {
    let cat = Object
        .create(Sprite)
        .init(spriteSheet, catType)
    cat.game = game
    cat.x = game.maxX / 2
    cat.y = game.maxY / 2
    Object.assign(cat, props || {})
    Object.assign(cat, {
        draw: SpriteDraw,
        step: CatStep,
    })
    return cat
}
const CatMissileStep = function(dt) {
    this.y += this.vy
    if (this.y < -this.h) {
        this.board.remove(this)
    }
}
const CreateCatMissile = (game, spriteSheet, x, y, props) => {
    let missile = Object
        .create(Sprite)
        .init(spriteSheet, "cat_missile", {
            vy: -7,
            damage: 10
        })
    missile.x = x - missile.w / 2
    missile.y = y - missile.h
    Object.assign(missile, props || {})
    Object.assign(missile, {
        draw: SpriteDraw,
        step: CatMissileStep
    })
    return missile
}

