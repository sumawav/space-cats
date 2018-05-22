const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy: 32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy: 64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy: 96, w: 32, h: 32, frames: 1 },
};

const game = CreateGame({
    debug: true
})
const spriteSheet = CreateSpriteSheet()

const startGame = () => {
    // game.renderer.bkg(0.227, 0.227, 0.227);
    let titleScreenBoard = CreateTitleScreen(
        "hello world",
        "foo bar baz",
        game,
        playGame
    )
    game.setBoard(0, titleScreenBoard)
}

const playGame = () => {
    let board = CreateGameBoard();
    console.log(board)
    game.setBoard(0, board)
}


const loadSprites = () => {
    spriteSheet.load(SPRITES, game.gl, startGame)    
}



window.addEventListener("load", () => { 
    game.initialize("canvas", loadSprites) 
})
