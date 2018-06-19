const GetLevel = (game, level, props) => {
    let offset = props.offset || 0
    switch(level){
        case "HERDING_CATS":
            return [
                [0, 8000, 200, "horizontal_arc", { y: offset + game.maxY/16 }],
                [0, 8000, 200, "horizontal_arc", { y: offset + 2*game.maxY/16 }],
                [0, 8000, 200, "horizontal_arc", { y: offset + 3*game.maxY/16 }],
                [1000, 9000, 200, "horizontal_arc", { y: offset + 4*game.maxY/16 }],
                [1000, 9000, 200, "horizontal_arc", { y: offset + 5*game.maxY/16 }],
                [1000, 9000, 200, "horizontal_arc", { y: offset + 6*game.maxY/16 }],
                [2000, 10000, 200, "horizontal_arc", { y: offset + 7*game.maxY/16 }],
                [2000, 10000, 200, "horizontal_arc", { y: offset + 8*game.maxY/16 }],
                [10000, 10500, 500, "pingpong"],
            ]
        case "STICKY_SITUATION":
            return [
                [0, 500, 500, "pingpong"],
                [1500, 9500,  125, 'snake', { x: 100, y: -100} ],
            ]
        case "EXAMPLE_LEVEL":
            return [
                // Start,   End, Gap,  Type,   Override
                [ 0,      4000,  500, 'step' ],
                [ 6000,   13000, 800, 'ltr' ],
                [ 10000,  16000, 400, 'circle' ],
                [ 17800,  20000, 500, 'straight', { x: 50 } ],
                [ 18200,  20000, 500, 'straight', { x: 90 } ],
                [ 18200,  20000, 500, 'straight', { x: 10 } ],
                [ 22000,  25000, 400, 'wiggle', { x: 150 }],
                [ 22000,  25000, 400, 'wiggle', { x: 100 }],
                [ 26000,  26500, 500, "still"]
                // [ 26000,  27000, 500, ]
            ]
        case "ARCS":
            return assembleLevel([
                // [startOffset, duration, spawn frequency, pattern name, overrides]
                // squadron of tri shooter teal cats
                [500, 1000, 1000, "straight", { x: nnBnn(game,7,1,3,0).x, E:50, enemyType: "teal_cat", danmaku: 8 }],
                [500, 1000, 1000, "straight", { x: nnBnn(game,7,1,1,0).x, E:85, enemyType: "teal_cat", danmaku: 8 }],
                [-500, 1000, 1000, "straight", { x: nnBnn(game,7,1,5,0).x, E:85, enemyType: "teal_cat", danmaku: 8 }],
                [500, 1000, 1000, "ltr", { x: 1*game.maxX/8 - 16, E:90, enemyType: "teal_cat", danmaku: 8 }],
                [-500, 1000, 1000, "ltr", { x: 7*game.maxX/8 - 16, B: -75, E:90, enemyType: "teal_cat", danmaku: 8 }],
                // // --- set of orange catsneks
                [3000, 1000, 150, "horizontal_arc", { y: 4*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [200, 1000, 150, "horizontal_arc", { y: 4*game.maxY/12, enemyType: "orange_cat", danmaku: 0 }],
                [200, 1000, 150, "horizontal_arc", { y: 4*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [1000, 1000, 150, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [200, 1000, 150, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, enemyType: "orange_cat", danmaku: 0 }],
                [200, 1000, 150, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 } ],
                // sharpshooter purple cats
                [1000, 1000, 1000, "ltr", { x: 2*game.maxX/8 - 16, E:60, enemyType: "purple_cat", danmaku: 2 }],
                [1000, 1000, 1000, "ltr", { x: 6*game.maxX/8 - 16, B: -75, E:60, enemyType: "purple_cat", danmaku: 2 }],
                // --- set of orange catsneks
                [1000, 1000, 300, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [200, 1000, 300, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, enemyType: "orange_cat", danmaku: 0 }],
                [200, 1000, 300, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 } ],
                // sharpshooter purple 
                [1000, 1000, 1000, "straight", { x: 2*game.maxX/8 - 16, E:20, enemyType: "purple_cat", danmaku: 2 }],
                [-1000, 1000, 1000, "straight", { x: 6*game.maxX/8 - 16, E:20, enemyType: "purple_cat", danmaku: 2 }],
                // --- set of orange catsneks catsneks coming in early to block for sharpshooters
                [-1000, 2000, 100, "horizontal_arc", { y: 4*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [200, 2000, 100, "horizontal_arc", { y: 4*game.maxY/12, enemyType: "orange_cat", danmaku: 0 }],
                [200, 2000, 300, "horizontal_arc", { y: 4*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [200, 2000, 300, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [200, 2000, 400, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, enemyType: "orange_cat", danmaku: 0 }],
                [200, 2000, 400, "horizontal_arc", { A: -400, x: game.maxX, y: 5*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 } ],
                // surrounded by orange catsneks
                [1000, 2000, 150, "horizontal_arc", { y: 4*game.maxY/12, H:PI, enemyType: "black_cat" }],
                [-1000, 2000, 150, "horizontal_arc", { y: 11*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [200, 2000, 150, "horizontal_arc", { y: 4*game.maxY/12, enemyType: "orange_cat", danmaku: 0  }],
                [-2000, 2000, 150, "horizontal_arc", { y: 11*game.maxY/12, enemyType: "black_cat"}],
                [200, 2000, 150, "horizontal_arc", { y: 4*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                [-2000, 2000, 150, "horizontal_arc", { y: 11*game.maxY/12, H:PI, enemyType: "orange_cat", danmaku: 0 }],
                // --- set of teals
                [500, 1000, 1000, "straight", { x: 4*game.maxX/8 - 16, E:50, enemyType: "teal_cat", danmaku: 8 }],
                [500, 1000, 1000, "straight", { x: 3*game.maxX/8 - 16, E:90, enemyType: "teal_cat", danmaku: 8 }],
                [-1000, 1000, 1000, "straight", { x: 5*game.maxX/8 - 16, E:90, enemyType: "teal_cat", danmaku: 8 }],
                // vertical black cats
                [1000, 10000, 100, "vertical_arc", { x: 4*game.maxX/8, enemyType: "black_cat"}],
                // sharpshooter purple 
                [-10000, 1000, 1000, "straight", { x: 1*game.maxX/8 - 16, E:50, enemyType: "purple_cat", danmaku: 2 }],
                [-300, 1000, 1000, "straight", { x: 7*game.maxX/8 - 16, E:60, enemyType: "purple_cat", danmaku: 2 }],

            ])
        case "TESTING":
            return [
                // Start,   End, Gap,  Type,   Override
                [0, 1000, 1000, "straight_with_breaks", { x: 1*game.maxX/8, danmaku: 9 }],
                [0, 1000, 1000, "straight", { x: 4*game.maxX/8, E:50 }],
                [0, 1000, 1000, "straight", { x: 7*game.maxX/8, E:50 }],
            ]
    }
}

const assembleLevel = (levels) => {
    let time = 0
    return levels.map((level) => {
        let start = Math.abs(time + level[0]) // prevent negative start time
        let end = start + level[1]
        let out = [start, end, level[2], level[3], level[4] || {}]
        time = end
        return out
    })
}



const DEBUG_LEVEL = [
    // [0, 2000, 500, "straight", { x: 0 }],
    // [0, 2000, 500, "straight", { x: game.maxX/4 }],
    // [0, 2000, 500, "straight", { x: game.maxX/2 }],
    // [0, 2000, 500, "straight", { x: 3*game.maxX/4 }],
    [0, 8000, 100, "left_up_right_toss"],
    [0, 8000, 100, "left_up_right_toss", { }],
    // [4000, 4500, 500, "pingpong"],
    // [11500, 19500,  125, 'snake', { x: 100, y: -100} ],
]


var level1 = [
    // Start,   End, Gap,  Type,   Override
    [ 0,      4000,  500, 'step' ],
    [ 6000,   13000, 800, 'ltr' ],
    [ 10000,  16000, 400, 'circle' ],
    [ 17800,  20000, 500, 'straight', { x: 50 } ],
    [ 18200,  20000, 500, 'straight', { x: 90 } ],
    [ 18200,  20000, 500, 'straight', { x: 10 } ],
    [ 22000,  25000, 400, 'wiggle', { x: 150 }],
    [ 22000,  25000, 400, 'wiggle', { x: 100 }],
    [ 26000,  26500, 500, "still"]
    // [ 26000,  27000, 500, ]
];