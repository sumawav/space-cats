const OBJECT_PLAYER             = 1,
      OBJECT_PLAYER_PROJECTILE  = 2,
      OBJECT_ENEMY              = 4,
      OBJECT_ENEMY_PROJECTILE   = 8,
      OBJECT_POWERUP            = 16

const SPRITES = {
    cat:           { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat:    { sx: 0, sy: 32, w: 32, h: 32, frames: 1 },
    black_cat:     { sx: 0, sy: 64, w: 32, h: 32, frames: 1 },
    purple_cat:    { sx: 0, sy: 96, w: 32, h: 32, frames: 1 },
    teal_cat:      { sx: 0, sy: 128, w: 32, h: 32, frames: 1 },
    red_orange_cat:{ sx: 0, sy: 160, w: 32, h: 32, frames: 1 },
    green_cat:     { sx: 0, sy: 192, w: 32, h: 32, frames: 1 },
    gray_cat:      { sx: 0, sy: 224, w: 32, h: 32, frames: 1 },
    blank_cat:     { sx: 0, sy: 256, w: 32, h: 32, frames: 1 },
    cat_missile:{ sx: 8, sy: 40, w: 2, h:16, frames: 1 },
    square:     { sx:16, sy: 10, w: 1, h: 1, frames: 1 }
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
    let blueprint = {}
    switch(type){
        case "straight": 
            blueprint = { 
                x: 0, y: -50, enemyType: "teal_cat", health: 2, 
                E: 100, points: 17, patterns: { list: TEST_PATTERN3, ptr: 0 }
            }
            break
        case "ltr": 
            blueprint = { 
                x: 0, y: -100, enemyType: "purple_cat", health: 2, 
                B: 75, C: 1, E: 100, danmaku: 2, points: 37,
                patterns: { list: TEST_PATTERN3, ptr: 0 }
            }
            break
        case "circle": 
            blueprint = { 
                x: 250, y: -50, enemyType: "black_cat", health: 2, 
                A: 0, B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2,
                points: 17, patterns: { list: TEST_PATTERN3, ptr: 0 }
            }
            break
        case "wiggle": 
            blueprint = { 
                x: 100, y: -50, enemyType: "red_orange_cat", health: 2, 
                B: 50, C: 4, E: 100, danmaku: 3, points: 27, patterns: { list: TEST_PATTERN3, ptr: 0 }
            }
            break
        case "step": 
            blueprint = { 
                x: 0, y: -50, enemyType: "gray_cat", health: 2, 
                B: 150, C: 1.2, E: 75, points: 17, 
                patterns: { list: TEST_PATTERN3, ptr: 0 }
            }
            break
        case "still":
            let x = game ? game.maxX / 2 : 100
            let y = game ? game.maxY / 4: 100
            blueprint = {
                x: x, y: y, enemyType: "green_cat", health: 20,
                points: 307, patterns: { list: TEST_PATTERN2, ptr: 0}
            }
        case "pingpong":
            blueprint = {
                x: game ? game.maxX / 2 : 100, 
                y: game ? game.maxY / 4: 100, 
                enemyType: "red_orange_cat", health: 40,
                points: 69420, 
                patterns: { list: PING_PONG_PATTERN, ptr: 0 }
            }
        break
        default:
            blueprint = {
                x: game ? game.maxX : 100, y: game ? game.maxY : 100, enemyType: "cat", health: 10, 
                E: 75
            }
    }
    return blueprint
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
    [0, 300, 500, "pingpong"]
]

var gameBoard
const game = CreateGame({debug: false})
const spriteSheet = CreateSpriteSheet("img/cats.png")
const numberSheet = CreateSpriteSheet("img/download.png")

var cat
var danmakuConfig


const startGame = () => {
    game.titleScreen = true
    game.renderer.bkg(0.0, 0.0, 0.0)
    game.setBoard(0, CreateStarField(game, { 
        centerX: game.maxX/4,
        centerY: game.maxY/4,
        speed: 10
    }))
    game.setBoard(2, CreateMainTitle(
        game,
        "space cats",
        game.mobile ? "TOUCH HERE" : "PRESS ENTER",
        PlayGame
    ))

    if (game.mobile){
        const touchControls = CreateTouchControls(game, spriteSheet)
        touchControls.init()
        game.setBoard(3, touchControls)
    }
        
}

const PlayGame = () => {
    game.gameScore = 0
    game.titleScreen = false
    game.gameOver = false
    game.sloMoFactor = 1
    gameBoard = CreateGameBoard(game)
    cat = CreateCat(game, spriteSheet, "orange_cat", {
        tint: 0x00000000,
        maxVel: 200,
        sloMoMeter: 100
    })
    danmakuConfig = CreateDanmakuConfig(cat)
    gameBoard.add(cat)
    game.setBoard(1, gameBoard)
    game.removeBoard(2)

    gameBoard.add(CreateLevel(game, spriteSheet, DEBUG_LEVEL, WinGame))
    // gameBoard.add(CreateLevel(game, spriteSheet, level1, WinGame))

    game.setBoard(4, CreateHud(game, spriteSheet, cat, 5, {
        numberSheet: numberSheet,
        dScore: 0
    }))
    
    
}

const GameOver = () => {
    game.gameOver = true
    game.setBoard(2, CreateMainTitle(
        game,
        "game over",
        game.mobile ? "PLAY AGAIN?": "PRESS ENTER TO PLAY",
        PlayGame,
    ))
}

const WinGame = () => {
    game.win = true
    game.setBoard(2, CreateMainTitle(
        game,
        "you win!!",
        game.mobile ? "PLAY AGAIN?": "PRESS ENTER TO PLAY",
        PlayGame
    ))
}

const loadSprites = () => {
    spriteSheet.load(SPRITES, game.renderer, 
        numberSheet.load(HUD, game.renderer, startGame)
    )
}

window.addEventListener("load", () => { 
    document.getElementById("canvas").focus()
    game.initialize("canvas", loadSprites) 
})
