const CardDraw = function() {
    this.game.renderer.img(
        this.tex,
        -this.tex.width/2,
        -this.tex.height/2,
        this.tex.width,
        this.tex.height,
        this.rot,
        this.x, //x
        this.y, //y
        1,
        1,
        0,0,1,1
    )        
}
const CardStep = function(dt) {
    if (!this.game.keys["z"])
        this.up = true
    if (this.up && this.game.keys["z"]) {
        if (typeof this.callback === "function")
            this.callback()
    }
}
const Card = {
    init: function(game, title, subtitle, callback) {
        let c = document.createElement("canvas")
        c.width = game.maxX
        c.height = 200
        const ctx = c.getContext("2d")
        ctx.fillStyle = "#00FFFF"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "normal bold 40px kremlin"
        ctx.fillText(title, c.width/2, c.height/2)
        ctx.font = "normal bold 20px kremlin"
        ctx.fillText(subtitle, c.width/2, (c.height/2) + 40)
        const cTexture = TCTex(game.gl, c, c.width, c.height)
        // document.body.appendChild(c)
        c = null

        this.up = false
        this.game = game
        this.x = game.maxX / 2
        this.y = game.maxY / 2
        this.tex = cTexture
        this.rot = 0
        this.callback = callback || null
        return this
    }
}
const MainTitleStep = function(dt) {
    if (this.y >= (this.game.maxY - this.tex.height/4))   
        this.scrollYDirection = false
    if (this.y <= 0 + this.tex.height/4)           
        this.scrollYDirection = true
    if (this.x >= this.game.maxX - this.tex.width/4)   
        this.scrollXDirection = false
    if (this.x <= 0 + this.tex.width/4)           
        this.scrollXDirection = true
    if (this.rot > Math.PI/14)
        this.rotationDir = false
    if (this.rot < -Math.PI/14)
        this.rotationDir = true
    this.rot += this.rotationDir ? .009 : -.01

    let dY = this.scrollYDirection ? 6 : -4
    let dX = this.scrollXDirection ? 7 : -8 
    this.y += dY/2
    this.x += dX/2

    if (!this.game.keys["z"])
        this.up = true
    if (this.up && this.game.keys["z"]) {
        if (typeof this.callback === "function")
            this.callback()
    }    
}
const CreateMainTitle = (game, title, subtitle, callback) => {
    let card = Object
        .create(Card)
        .init(game, title, subtitle, callback)

    Object.assign(card, {
        draw: CardDraw,
        step: MainTitleStep,
    })
    return card
}
