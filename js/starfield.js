const CreateStarField = (game, opt) => {
    var options = {
        count: opt.count || 512,
        depth: opt.depth || 32,
        density: opt.density || 128,
        centerX: opt.centerX || game.maxX/2,
        centerY: opt.centerY || game.maxY,
        speed: opt.speed || 1
    }
    let stars = []

    const randomRange = (minVal,maxVal) => {
        return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
    }

    for (let i = 0; i < options.count; ++i){
        stars[i] = {
            x: randomRange(-25,25),
            y: randomRange(-25,25),
            z: randomRange(0, options.depth)
        }
    }

    let c = document.createElement("canvas")
    c.width = 1
    c.height = 1
    const ctx = c.getContext("2d")
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0,0,c.width,c.height)
    const cTexture = TCTex(game.gl, c, c.width, c.height)
    c = null

    let state = {
        stars: stars,
        depth: options.depth,
        density: options.density,
        centerX: options.centerX,
        centerY: options.centerY,
        speed: options.speed,
        step: (dt) => {
            state.stars.forEach((star, i, a) => {
                star.z -= state.speed * dt
                if (star.z <= 0)
                    star = {
                        x: randomRange(-25,25),
                        y: randomRange(-25,25),
                        z: state.depth
                    }
                let k = state.density / star.z
                star.px = k * star.x + state.centerX 
                star.py = k * star.y + state.centerY
                star.size = (1 - star.z / state.depth) * 2
                a[i] = star
            })
        },
        draw: () => {
            let cacheCol = game.renderer.col
            state.stars.forEach((star) => {
                if (star.px >= 0 && star.px <= game.maxX && 
                    star.py >= 0 && star.py <= game.maxY) {
                    // let shade = parseInt(Math.min((1 - star.z / depth)*1.5,1) * 255);
                    // let shadeStr = shade.toString(16)
                    // game.renderer.col = "0xFF" + shadeStr + shadeStr + shadeStr
                    game.renderer.img(
                        cTexture,
                        0,
                        0,
                        cTexture.width,
                        cTexture.height,
                        0,
                        star.px,
                        star.py,
                        star.size,
                        star.size,
                        0,0,1,1
                    )
                }
            })
            game.renderer.col = cacheCol
        }
    }
    return Object.assign(state)
}