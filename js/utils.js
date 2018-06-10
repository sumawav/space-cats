const randomRangeInt = (minVal,maxVal) => {
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

const createHexColor = (red, green, blue, alpha) => {
    alpha = alpha || 255
    let aHex = alpha.toString(16).padStart(2,"0")
    let rHex = red.toString(16).padStart(2,"0")
    let gHex = green.toString(16).padStart(2,"0")
    let bHex = blue.toString(16).padStart(2,"0")
    return "0x" + aHex + bHex + gHex + rHex
}

const closeEnough = (a,b) => {
    return (Math.abs(b-a) < .5)
}


// easing functions
const basicEasing = function(dt, t_x,t_y){
    const vx = (this.target_x - this.x) * this.ease,
        vy = (this.target_y - this.y) * this.ease
        this.x += vx * dt * 60
        this.y += vy * dt * 60
        return (closeEnough(this.y,this.target_y) && closeEnough(this.x, this.target_x))
}
const basicWait = function(dt){
    this.wait -= dt * 60
    this.runnerActive = true
    return this.wait < 0
}
