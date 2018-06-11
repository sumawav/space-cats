const GetLevel = (game, level, props) => {
    switch(level){
        case "HERDING_CATS":
            let offset = props.offset || 0
            return [
                [0, 8000, 200, "left_up_right_toss2", { y: offset + game.maxY/16 }],
                [0, 8000, 200, "left_up_right_toss2", { y: offset + 2*game.maxY/16 }],
                [0, 8000, 200, "left_up_right_toss2", { y: offset + 3*game.maxY/16 }],
                [1000, 9000, 200, "left_up_right_toss2", { y: offset + 4*game.maxY/16 }],
                [1000, 9000, 200, "left_up_right_toss2", { y: offset + 5*game.maxY/16 }],
                [1000, 9000, 200, "left_up_right_toss2", { y: offset + 6*game.maxY/16 }],
                [2000, 10000, 200, "left_up_right_toss2", { y: offset + 7*game.maxY/16 }],
                [2000, 10000, 200, "left_up_right_toss2", { y: offset + 8*game.maxY/16 }],
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
    }
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