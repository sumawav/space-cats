const OBJECT_PLAYER             = 1,
      OBJECT_PLAYER_PROJECTILE  = 2,
      OBJECT_ENEMY              = 4,
      OBJECT_ENEMY_PROJECTILE   = 8,
      OBJECT_POWERUP            = 16

const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy: 32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy: 64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy: 96, w: 32, h: 32, frames: 1 },
    cat_missile:{ sx: 8, sy:32 + 8, w: 2, h: 16, frames: 1 },
    square:     { sx:16, sy: 0 +10, w: 1, h: 1, frames: 1 }
}

var gameBoard
const game = CreateGame({debug: true})
const spriteSheet = CreateSpriteSheet()

const startGame = () => {
    game.renderer.bkg(0.0, 0.0, 0.0)
    game.setBoard(0, CreateStarField(game, { 
        centerX: game.maxX/4,
        centerY: game.maxY/4,
        speed: 10
    }))
    game.setBoard(1, CreateMainTitle(
        game,
        "SPACE CATS",
        "press z to play",
        playGame
    ))
}

const playGame = () => {
    gameBoard = CreateGameBoard()
    gameBoard.add(CreateCat(game, spriteSheet, "orange_cat", {
        tint: "0xFF0000FF",
        x: (game.maxX / 2) - (SPRITES.orange_cat.w/2),
        y: game.maxY - SPRITES.orange_cat.h,
    }))
    game.setBoard(1, gameBoard)

    var enemies = {
        basic: { x: 100, y: -50, B: 100, C: 2 , E: 100 }
    };
    game.removeBoard(2)
    // add some enemies for testing
    let test_baddies = ["purple_cat", "orange_cat", "cat", "black_cat", "purple_cat"]
    test_baddies.forEach((e,i) => {
        gameBoard.add(CreateEnemy(game, spriteSheet, {
            x: 20+100*i, y: -50, enemyType: e,
            B: 100, C: 2, E: 100,
            damage: i
        }))
    })
}

const GameOver = () => {
    const gameOver = CreateMainTitle(
        game,
        "game over",
        "PRESS SPACE",
        playGame
    )
    game.setBoard(2, gameOver)
}

const loadSprites = () => {
    spriteSheet.load(SPRITES, game.renderer, startGame)
}

window.addEventListener("load", () => { 
    document.getElementById("canvas").focus()
    game.initialize("canvas", loadSprites) 
})
