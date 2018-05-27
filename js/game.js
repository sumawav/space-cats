const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy: 32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy: 64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy: 96, w: 32, h: 32, frames: 1 },
    cat_missile:{ sx: 8, sy:32 + 8, w: 4, h: 16, frames: 1 },
};

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
        centerY: game.maxY/4,
        speed: 10 
    })
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
const CreateCat = (game, spriteSheet, catType, props) => {
    let cat = Object
        .create(Sprite,)
        .init(spriteSheet, catType)
    cat.game = game
    cat.x = game.maxX / 2
    cat.y = game.maxY / 2
    cat.reloadTime = 1000
    cat.reload = cat.reloadTime / 4

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

