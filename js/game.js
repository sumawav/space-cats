const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy: 32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy: 64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy: 96, w: 32, h: 32, frames: 1 },
};

var game = CreateGame({
    debug: true
})
var spriteSheet = CreateSpriteSheet()
var startGame = () => {
    console.log("DONE")
}
var loadSprites = () => {
    spriteSheet.load(SPRITES, game.gl, startGame)

    // testing
    var test = document.createElement("canvas")
    test.width = game.maxX
    test.height = game.maxY
    var testCtx = test.getContext("2d")
    
    testCtx.fillStyle = "#000000"
    testCtx.textAlign = "center"
    testCtx.font = "normal bold 40px kremlin"
    testCtx.fillText("hello world", game.maxX/2, game.maxY/2);
    
    var testTexture = TCTex(game.gl, test, test.width, test.height)    

    game.renderer.img(
        testTexture,
        0,
        0,
        test.width,
        test.height,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        1
    )
    game.renderer.flush()
}



window.addEventListener("load", () => { 
    game.initialize("canvas", loadSprites) 
})
