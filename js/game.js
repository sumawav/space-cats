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

const enemies = {
    straight: { 
        x: 0, y: -50, enemyType: "orange_cat", health: 10, 
        E: 100 
    },
    ltr: { 
        x: 0, y: -100, enemyType: "purple_cat", health: 10, 
        B: 200, C: 1, E: 200 
    },
    circle: { 
        x: 400, y: -50, enemyType: "black_cat", health: 10, 
        A: 0, B: -200, C: 1, E: 20, F: 200, G: 1, H: Math.PI/2 
    },
    wiggle: { 
        x: 100, y: -50, enemyType: "cat", health: 10, 
        B: 100, C: 4, E: 100 
    },
    step: { 
        x: 0, y: -50, enemyType: "cat", health: 10, 
        B: 300, C: 1.5, E: 60 
    },
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
    [ 22000,  25000, 400, 'wiggle', { x: 100 }]
];

var gameBoard
const game = CreateGame({debug: false})
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
        "space cats",
        "PRESS Z TO PLAY",
        PlayGame
    ))
    const touchControls = CreateTouchControls(game, spriteSheet)
    touchControls.init()
    if (game.mobile){
        state.setBoard(4, touchControls)
    }
    
}

const PlayGame = () => {
    game.gameOver = false
    gameBoard = CreateGameBoard()
    gameBoard.add(CreateCat(game, spriteSheet, "orange_cat", {
        tint: "0xFF0000FF",
        x: (game.maxX / 2) - (SPRITES.orange_cat.w/2),
        y: game.maxY - SPRITES.orange_cat.h,
        maxVel: 200
    }))
    game.setBoard(1, gameBoard)
    game.removeBoard(2)
    // gameBoard.add(CreateEnemy(game, spriteSheet, enemies.step)
    gameBoard.add(CreateLevel(game, spriteSheet, level1, WinGame))
}

const GameOver = () => {
    game.gameOver = true
    game.setBoard(2, CreateMainTitle(
        game,
        "game over",
        "PRESS Z TO PLAY",
        PlayGame
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
