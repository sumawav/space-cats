const OBJECT_PLAYER             = 1,
      OBJECT_PLAYER_PROJECTILE  = 2,
      OBJECT_ENEMY              = 4,
      OBJECT_ENEMY_PROJECTILE   = 8,
      OBJECT_POWERUP            = 16

const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy:32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy:64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy:96, w: 32, h: 32, frames: 1 },
    cat_missile:{ sx: 8, sy:32 + 8, w: 2, h:16, frames: 1 },
    square:     { sx:16, sy: 0 +10, w: 1, h: 1, frames: 1 }
}

// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity
// H Time shift of vertical
const enemies = (type) => {
    let text = {}
    switch(type){
        case "straight": 
            text = { 
                x: 0, y: -50, enemyType: "orange_cat", health: 2, 
                E: 100 
            }
            break
        case "ltr": 
            text = { 
                x: 0, y: -100, enemyType: "purple_cat", health: 2, 
                B: 75, C: 1, E: 100, danmaku: 2
            }
            break
        case "circle": 
            text = { 
                x: 250, y: -50, enemyType: "black_cat", health: 2, 
                A: 0, B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 
            }
            break
        case "wiggle": 
            text = { 
                x: 100, y: -50, enemyType: "cat", health: 2, 
                B: 50, C: 4, E: 100, danmaku: 3
            }
            break
        case "step": 
            text = { 
                x: 0, y: -50, enemyType: "cat", health: 2, 
                B: 150, C: 1.2, E: 75
            }
            break
        case "still":
            let x = game ? game.maxX / 2 : 100
            let y = game ? game.maxY / 4: 100
            text = {
                x: x, y: y, enemyType: "cat", health: 20, danmaku: 1
            }
        break
        default:
            text = {
                x: game ? game.maxX : 100, y: game ? game.maxY : 100, enemyType: "cat", health: 10, 
                E: 75
            }
    }
    return text
};

var level1 = [
    // Start,   End, Gap,  Type,   Override
    [ 0,      4000,  500, 'step' ],
    [ 6000,   13000, 800, 'ltr' ],
    [ 10000,  16000, 400, 'circle' ],
    [ 17800,  20000, 500, 'straight', { x: 50 } ],
    [ 18200,  20000, 500, 'straight', { x: 90 } ],
    [ 18200,  20000, 500, 'straight', { x: 10 } ],
    [ 22000,  25000, 400, 'wiggle', { x: 150 }],
    [ 22000,  25000, 400, 'wiggle', { x: 100 }],
    [ 26000,  26500, 500, "still"]
    // [ 26000,  27000, 500, ]
];

DEBUG_LEVEL = [
    [0, 300, 500, "still"]
]

var gameBoard
const game = CreateGame({debug: false})
const spriteSheet = CreateSpriteSheet()

var cat
var danmakuConfig


const startGame = () => {
    game.renderer.bkg(0.0, 0.0, 0.0)
    game.setBoard(0, CreateStarField(game, { 
        centerX: game.maxX/4,
        centerY: game.maxY/4,
        speed: 10
    }))
    game.setBoard(2, CreateMainTitle(
        game,
        "space cats",
        "PRESS Z TO PLAY",
        PlayGame
    ))

    if (game.mobile){
        const touchControls = CreateTouchControls(game, spriteSheet)
        touchControls.init()
        game.setBoard(3, touchControls)
    }
        
}

const PlayGame = () => {
    game.gameOver = false
    game.sloMoFactor = 1
    gameBoard = CreateGameBoard(game)
    cat = CreateCat(game, spriteSheet, "orange_cat", {
        tint: 0x00000000,
        maxVel: 200,
    })
    danmakuConfig = CreateDanmakuConfig(cat)
    gameBoard.add(cat)
    game.setBoard(1, gameBoard)
    game.removeBoard(2)
    // gameBoard.add(CreateLevel(game, spriteSheet, DEBUG_LEVEL, WinGame))
    gameBoard.add(CreateLevel(game, spriteSheet, level1, WinGame))

    game.setBoard(4, CreateHud(game, spriteSheet, cat, 5))
}

const GameOver = () => {
    game.gameOver = true
    game.setBoard(2, CreateMainTitle(
        game,
        "game over",
        "PRESS Z TO PLAY",
        PlayGame,
    ))
}

const WinGame = () => {
    game.setBoard(2, CreateMainTitle(
        game,
        "you win!!",
        "PRESS Z TO PLAY AGAIN",
        PlayGame
    ))
}

const loadSprites = () => {


    spriteSheet.load(SPRITES, game.renderer, startGame)
}

window.addEventListener("load", () => { 
    document.getElementById("canvas").focus()
    game.initialize("canvas", loadSprites) 
})
