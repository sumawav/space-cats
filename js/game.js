const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy: 32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy: 64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy: 96, w: 32, h: 32, frames: 1 },
};

var deleteme = 0

const game = CreateGame({
    debug: true
})

const spriteSheet = CreateSpriteSheet()

const startGame = () => {
    game.renderer.bkg(0.0, 0.0, 0.0);
    let titleScreenBoard = CreateTitleScreen(
        "hello world",
        "foo bar baz",
        game,
        playGame
    )
    let starField = CreateStarField(
        game,
        512,    //count
        32,     //depth
        128,    //density
        game.maxX/4,
        game.maxY/4 
    )
    game.setBoard(0, starField)
    game.setBoard(1, titleScreenBoard)
}

const playGame = () => {
    let board = CreateGameBoard();
    let cat = CreateCat(spriteSheet, game, { sprite: "orange_cat"})
    board.add(cat)
    console.log(cat)
    game.setBoard(1, board)

}

const loadSprites = () => {
    spriteSheet.load(SPRITES, game.renderer, startGame)    
}

window.addEventListener("load", () => { 
    game.initialize("canvas", loadSprites) 
})

const CreateStarField = (game, count, depth, density, centerX, centerY) => {
    let stars = []

    const randomRange = (minVal,maxVal) => {
        return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
    }

    for (let i = 0; i < count; ++i){
        stars[i] = {
            x: randomRange(-25,25),
            y: randomRange(-25,25),
            z: randomRange(0, depth)
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
        depth: depth,
        density: density,
        centerX: centerX,
        centerY: centerY,
        step: () => {
            state.stars.forEach((star, i, a) => {
                star.z -= 0.2
                if (star.z <= 0)
                    star = {
                        x: randomRange(-25,25),
                        y: randomRange(-25,25),
                        z: state.depth
                    }
                let k = density / star.z
                star.px = k * star.x + state.centerX 
                star.py = k * star.y + state.centerY
                star.size = (1 - star.z / depth) * 2
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

const CreateCat = (spritesheet, game, props) => {
    let sprite = CreateSprite(spritesheet)
    if (!props)
        props = {
            sprite: "cat"
        }
    sprite.setup("cat", props)

    let state = {
        x: game.maxX / 2,
        y: game.maxY / 2,
        step: () => {
            if (game.keys["right"]) {
                sprite.x += 3
                // game.keys.right = false
            }
            if (game.keys.left) {
                sprite.x -= 3
                // game.keys.left = false
            }
            if (game.keys.down) {
                sprite.y += 3
                // game.keys.down = false
            }
            if (game.keys.up) {
                sprite.y -= 3
                // game.keys.up = false
            }
        }
    }
    return Object.assign(sprite, state)
}