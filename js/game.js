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
    cat_missile:{ sx: 8, sy:32 + 8, w: 4, h: 16, frames: 1 },
}

var gameBoard

const game = CreateGame({
    debug: true
})

const spriteSheet = CreateSpriteSheet()

const startGame = () => {
    game.renderer.bkg(0.0, 0.0, 0.0)
    let titleScreenBoard = CreateMainTitle(
        game,
        "SPACE CATS",
        "press spacebar",
        playGame
    )
    let starField = CreateStarField(game, { 
        centerX: game.maxX/4,
        centerY: game.maxY/4,
        speed: 10 
    })
    game.setBoard(0, starField)
    game.setBoard(1, titleScreenBoard)
}

const playGame = () => {
    // let board = CreateGameBoard()
    gameBoard = CreateGameBoard()
    let cat = CreateCat(game, spriteSheet, "orange_cat")
    gameBoard.add(cat)
    game.setBoard(1, gameBoard)

    // add some enemies for testing
    let test_baddies = Array(5).fill().forEach((e,i) => {
        gameBoard.add(CreateEnemy(game, spriteSheet, {
            x: 20+100*i, y: 10+100*i, enemyType: "purple_cat"
        }))
    })
}

const loadSprites = () => {
    spriteSheet.load(SPRITES, game.renderer, startGame)    
}

window.addEventListener("load", () => { 
    game.initialize("canvas", loadSprites) 
})

const CatStep = function(dt){
    this.reload -= dt
    const gKeys = this.game.keys
    if (gKeys.right)   this.x += 3
    if (gKeys.left)    this.x -= 3
    if (gKeys.down)    this.y += 3
    if (gKeys.up)      this.y += -3
    if (gKeys.space && this.reload < 0) {
        this.reload = this.reloadTime
        let cmL = CreateCatMissile(
            game, spriteSheet, this.x, this.y
        )
        let cmR = CreateCatMissile(
            game, spriteSheet, this.x+this.w, this.y
        )
        this.board.add(cmL)
        this.board.add(cmR)
        this.game.keys.space = false
    }
}

