// For CYKOD_PATTERN:
// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity
// H Time shift of vertical
const enemies = (game, type) => {
    let blueprint = {}
    switch(type){
        case "straight": 
            blueprint = { 
                x: 0, y: -50, enemyType: "teal_cat", health: 5, 
                E: 100, points: 17, patterns: { list: CYKOD_PATTERN, ptr: 0 }
            }
            break
        case "ltr": 
            blueprint = { 
                x: 0, y: -100, enemyType: "purple_cat", health: 5, 
                B: 75, C: 1, E: 100, danmaku: 2, points: 37,
                patterns: { list: CYKOD_PATTERN, ptr: 0 }
            }
            break
        case "circle": 
            blueprint = { 
                x: 250, y: -50, enemyType: "black_cat", health: 5, 
                A: 0, B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2,
                points: 17, patterns: { list: CYKOD_PATTERN, ptr: 0 }
            }
            break
        case "wiggle": 
            blueprint = { 
                x: 100, y: -50, enemyType: "red_orange_cat", health: 5, 
                B: 50, C: 4, E: 100, danmaku: 3, points: 27, 
                patterns: { list: CYKOD_PATTERN, ptr: 0 }
            }
            break
        case "step": 
            blueprint = { 
                x: 0, y: -50, enemyType: "gray_cat", health: 5, 
                B: 150, C: 1.2, E: 75, points: 17, danmaku: 0,
                patterns: { list: CYKOD_PATTERN, ptr: 0 }
            }
            break
        case "still":
            let x = game ? game.maxX / 2 : 100
            let y = game ? game.maxY / 4: 100
            blueprint = {
                x: x, y: y, enemyType: "green_cat", health: 100,
                points: 307, patterns: { list: TEST_PATTERN2, ptr: 0}
            }
            break
        case "pingpong":
            blueprint = {
                x: game ? game.maxX / 2 : 100, 
                y: game ? game.maxY / 4: 100, 
                enemyType: "red_orange_cat", health: 100,
                points: 11111, 
                patterns: { list: PING_PONG_PATTERN, ptr: 0 }
            }
            break
        case "snake":
            blueprint = {
                enemyType: "purple_cat", health: 5, points: 7,
                patterns: { list: SNAKE_PATTERN, ptr: 0 }
            }
            break
        case "left_up_right_toss":
            blueprint = {
                x: -32, y: 4*game.maxY/16, 
                enemyType: "orange_cat", health: 2, points: 7,
                A: 200, F: 100, G:1, H:0,
                patterns: { list: CYKOD_PATTERN, ptr: 0 }
            }
            break
        case "left_up_right_toss2":
            blueprint = {
                x: -32, y: 12*game.maxY/16, 
                enemyType: "black_cat", health: 2, points: 7,
                A: 200, F: 100, G:1, H: PI/2,
                patterns: { list: CYKOD_PATTERN, ptr: 0 }
            }
            break
        default:
            blueprint = {
                x: game ? game.maxX : 100, y: game ? game.maxY : 100, enemyType: "cat", health: 10, 
                E: 75
            }
    }
    return blueprint
};
