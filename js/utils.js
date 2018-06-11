const randomInt = (minVal,maxVal) => {
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
    return (Math.abs(b-a) < 0.9)
}
// this returns random coordinates
// at section (n3, n4) f grid created 
// after board is split into n1 x  n2 grid
const nnBnn = (game, n1, n2, n3, n4) => {
    n3 = n3 === "random" ? randomInt(0,n1-1) : n3
    n4 = n4 === "random" ? randomInt(0,n2-1) : n4
    let bin_w = game.maxX / n1
    let bin_h = game.maxY / n2
    return {
        x: randomInt(
            Math.floor(bin_w * n3), 
            Math.floor(bin_w * (n3 + 1))
        ),
        y: randomInt(
            Math.floor(bin_h * n4),
            Math.floor(bin_h * (n4 + 1)),
        ),
    }
}