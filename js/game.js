var gameBoard
const game = CreateGame({debug: config.debugMode})
const spriteSheet = CreateSpriteSheet("img/cats.png")
const numberSheet = CreateSpriteSheet("img/download.png")
const PI = Math.PI
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

    let randLevel = ["STICKY_SITUATION", "EXAMPLE_LEVEL", "HERDING_CATS"][randomInt(0,2)]
    gameBoard.add(CreateLevel(game, spriteSheet, GetLevel(game, config.level || randLevel, {offset: game.maxY/4}), WinGame))

    game.setBoard(4, CreateHud(game, spriteSheet, cat, 5, {
        numberSheet: numberSheet,
        dScore: 0
    }))
    
    
}

const GameOver = () => {
    game.gameOver = true
    game.setBoard(2, CreateCard(
        game,
        "game over",
        game.mobile ? "PLAY AGAIN?": "PRESS ENTER TO PLAY",
        PlayGame,
    ))
}

const WinGame = () => {
    game.win = true
    game.setBoard(2, CreateCard(
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
