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
        this.scale,
        this.scale,
        0,0,1,1
    )        
}
const CardStep = function(dt) {
    if (this.rot > Math.PI/40)
        this.rotationDir = false
    if (this.rot < -Math.PI/40)
        this.rotationDir = true
    this.rot += this.rotationDir ? .00009 : -.00009
    if (this.scale > 1.05)
        this.scaleDir = false
    if (this.scale < .95)
        this.scaleDir = true
    this.scale += this.scaleDir ? .0001 : -.0001
    
    if (!this.game.keys["enter"])
        this.up = true
    if (this.up && this.game.keys["enter"]) {
        if (typeof this.callback === "function")
            this.callback()
    }
}
const Card = {
    init: function(game, title, subtitle, callback) {
        let c = document.createElement("canvas")
        let fontSize = Math.floor(game.maxX/7)
        c.width = game.maxX
        c.height = 200
        const ctx = c.getContext("2d")
        ctx.fillStyle = "#00FFFF"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "normal bold " + fontSize + "px kremlin"
        ctx.fillText(title, c.width/2, c.height/2)
        ctx.font = "normal bold 20px kremlin"
        ctx.fillText(subtitle, c.width/2, (c.height/2) + fontSize)
        const cTexture = TCTex(game.gl, c, c.width, c.height)
        // document.body.appendChild(c)
        c = null

        this.up = false
        this.game = game
        this.x = game.maxX / 2
        this.y = game.maxY / 2
        this.tex = cTexture
        this.rot = 0
        this.scale = 1
        this.callback = callback || null
        return this
    }
}

const CreateCard = (game, title, subtitle, callback) => {
    let card = Object
        .create(Card)
        .init(game, title, subtitle, callback)

    card.x = game.maxX/2
    card.y = game.maxY/4
    Object.assign(card, {
        draw: CardDraw,
        step: CardStep,
    })
    return card
    
}

const MainTitleDraw = function() {
    var cacheCol = this.game.renderer.col
    for(let i = 5; i > 0; i--){
        this.game.renderer.col = createHexColor(255,255,255,120 - i*20)
        this.game.renderer.img(
            this.tex,
            -this.tex.width/2,
            -this.tex.height/2,
            this.tex.width,
            this.tex.height,
            this.rot * i,
            this.x, //x
            this.y, //y
            this.scale + this.scale * i * 0.2,
            this.scale + this.scale * i * 0.2,
            0,0,1,1
        )        
    }
    this.game.renderer.col = cacheCol
    this.game.renderer.img(
        this.tex,
        -this.tex.width/2,
        -this.tex.height/2,
        this.tex.width,
        this.tex.height,
        this.rot,
        this.x, //x
        this.y, //y
        this.scale + 0.1,
        this.scale + 0.1,
        0,0,1,1
    ) 
}

const MainTitleStep = function(dt) {
    if (this.rot > Math.PI/40)
        this.rotationDir = false
    if (this.rot < -Math.PI/40)
        this.rotationDir = true
    this.rot += this.rotationDir ? .00009 : -.00009
    if (this.scale > 1.05)
        this.scaleDir = false
    if (this.scale < .95)
        this.scaleDir = true
    this.scale += this.scaleDir ? .0001 : -.0001

    if (!this.game.keys["enter"])
        this.up = true
    if (this.up && this.game.keys["enter"]) {
        if (typeof this.callback === "function")
            this.callback()
    }    
}
const CreateMainTitle = (game, title, subtitle, callback) => {
    let card = Object
        .create(Card)
        .init(game, title, subtitle, callback)

    card.x = game.maxX/2
    card.y = game.maxY/4

    const rotRange = Math.floor(PI*10000/40)
    card.rot = randomInt(-rotRange,rotRange)/10000

    Object.assign(card, {
        draw: MainTitleDraw,
        step: MainTitleStep,
    })
    return card
}
