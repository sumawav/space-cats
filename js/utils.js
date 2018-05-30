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