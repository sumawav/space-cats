const SpriteDraw = function() {
    this.spriteSheet.draw(
        this.sprite, this.x, this.y, this.scale, this.tint, this.center
    )
}
const Sprite = {
    init: function(spriteSheet, sprite, props) {
        this.spriteSheet = spriteSheet
        this.sprite = sprite || ""
        this.w = spriteSheet.map[sprite].w
        this.h = spriteSheet.map[sprite].h
        props = props || {}
        Object.assign(this, props)
        return this
    }
}
