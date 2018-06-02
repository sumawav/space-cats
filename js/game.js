const OBJECT_PLAYER             = 1,
      OBJECT_PLAYER_PROJECTILE  = 2,
      OBJECT_ENEMY              = 4,
      OBJECT_ENEMY_PROJECTILE   = 8,
      OBJECT_POWERUP            = 16

const SPRITES = {
    cat:        { sx: 0, sy: 0, w: 32, h: 32, frames: 1 },
    orange_cat: { sx: 0, sy:32, w: 32, h: 32, frames: 1 },
    black_cat:  { sx: 0, sy:64, w: 32, h: 32, frames: 1 },
    purple_cat: { sx: 0, sy:96, w: 32, h: 32, frames: 1 },
    cat_missile:{ sx: 8, sy:32 + 8, w: 2, h:16, frames: 1 },
    square:     { sx:16, sy: 0 +10, w: 1, h: 1, frames: 1 }
}

var danmaku1
var danmakuConfig

var deleteme

// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity
// H Time shift of vertical
const enemies = (type) => {
    let text = {}
    switch(type){
        case "straight": 
            text = { 
                x: 0, y: -50, enemyType: "orange_cat", health: 10, 
                E: 100 
            }
            break
        case "ltr": 
            text = { 
                x: 0, y: -100, enemyType: "purple_cat", health: 10, 
                B: 75, C: 1, E: 100 
            }
            break
        case "circle": 
            text = { 
                x: 250, y: -50, enemyType: "black_cat", health: 10, 
                A: 0, B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 
            }
            break
        case "wiggle": 
            text = { 
                x: 100, y: -50, enemyType: "cat", health: 20, 
                B: 50, C: 4, E: 100 
            }
            break
        case "step": 
            text = { 
                x: 0, y: -50, enemyType: "cat", health: 10, 
                B: 150, C: 1.2, E: 75
            }
            break
        case "still":
            let x = game ? game.maxX / 2 : 100
            let y = game ? game.maxY / 4: 100
            text = {
                x: x, y: y, enemyType: "cat", health: 10
            }
        break
        default:
            text = {
                x: game ? game.maxX : 100, y: game ? game.maxY : 100, enemyType: "cat", health: 10, 
                E: 75
            }
    }
    return text
};

var level1 = [
    // Start,   End, Gap,  Type,   Override
    [ 0,      4000,  500, 'step' ],
    [ 6000,   13000, 800, 'ltr' ],
    [ 10000,  16000, 400, 'circle' ],
    [ 17800,  20000, 500, 'straight', { x: 50 } ],
    [ 18200,  20000, 500, 'straight', { x: 90 } ],
    [ 18200,  20000, 500, 'straight', { x: 10 } ],
    [ 22000,  25000, 400, 'wiggle', { x: 150 }],
    [ 22000,  25000, 400, 'wiggle', { x: 100 }]
];

DEBUG_LEVEL = [
    [0, 4000, 500, "still"]
]

var gameBoard
const game = CreateGame({debug: false})
const spriteSheet = CreateSpriteSheet()
var cat

const startGame = () => {
    game.renderer.bkg(0.0, 0.0, 0.0)
    game.setBoard(0, CreateStarField(game, { 
        centerX: game.maxX/4,
        centerY: game.maxY/4,
        speed: 10
    }))
    game.setBoard(2, CreateMainTitle(
        game,
        "space cats",
        "PRESS Z TO PLAY",
        PlayGame
    ))
    const touchControls = CreateTouchControls(game, spriteSheet)
    touchControls.init()
    if (game.mobile)
        game.setBoard(3, touchControls)
}

const PlayGame = () => {
    game.gameOver = false
    gameBoard = CreateGameBoard()
    cat = CreateCat(game, spriteSheet, "orange_cat", {
        tint: "0xFF0000FF",
        maxVel: 200
    })
    // need to override SimpleSubRunner to accept dt
    // NOTE: when a bullet's action list < 2, bulletmljs uses SimpleSubRunner
    // NOTE: if a bullet's action list is > 1, SubRunner is used
    bulletml.runner.SimpleSubRunner.prototype.update = function(dt) {
        if (this.deltaX === null) this.deltaX = Math.cos(this.direction) * this.speed;
        if (this.deltaY === null) this.deltaY = Math.sin(this.direction) * this.speed;

        this.x += this.deltaX * this.config.speedRate * dt * 60;
        this.y += this.deltaY * this.config.speedRate * dt * 60;
    };
    bulletml.runner.SubRunner.prototype.update = function(dt) {
        if (this.stop) return;
    
        this.age += dt * 60;
    
        var conf = this.config;
    
        // update direction
        if (this.age < this.chDirEnd) {
            this.direction += this.dirIncr;
        } else if (this.age === this.chDirEnd) {
            this.direction = this.dirFin;
        }
    
        // update speed
        if (this.age < this.chSpdEnd) {
            this.speed += this.spdIncr;
        } else if (this.age === this.chSpdEnd) {
            this.speed = this.spdFin;
        }
    
        // update accel
        if (this.age < this.aclEnd) {
            this.speedH += this.aclIncrH;
            this.speedV += this.aclIncrV;
        } else if (this.age === this.aclEnd) {
            this.speedH = this.aclFinH;
            this.speedV = this.aclFinV;
        }
    
        // move
        this.x += Math.cos(this.direction) * this.speed * conf.speedRate;
        this.y += Math.sin(this.direction) * this.speed * conf.speedRate;
        this.x += this.speedH * conf.speedRate;
        this.y += this.speedV * conf.speedRate;
    
        // proccess walker
        if (this.age < this.waitTo || this.completed) {
            return;
        }
        var cmd;
        while (cmd = this.walker.next()) {
            switch (cmd.commandName) {
            case "fire":
                this.fire(/**@type{bulletml.Fire}*/(cmd));
                break;
            case "wait":
                this.waitTo = this.age + cmd.value;
                return;
            case "changeDirection":
                this.changeDirection(/**@type{bulletml.ChangeDirection}*/(cmd));
                break;
            case "changeSpeed":
                this.changeSpeed(/**@type{bulletml.ChangeSpeed}*/(cmd));
                break;
            case "accel":
                this.accel(/**@type{bulletml.Accel}*/(cmd));
                break;
            case "vanish":
                this.onVanish();
                break;
            case "notify":
                this.notify(/**@type{bulletml.Notify}*/(cmd));
                break;
            }
        }
    
        // complete
        this.completed = true;
        if (this.parentRunner !== null) {
            this.parentRunner.completedChildCount += 1;
        }
    };
    
    bulletml.dsl();
    danmaku1 = new bulletml.Root({
        top: action([
            repeat(999, [
                fire(speed(1.5), bullet()),
                repeat(200, [
                    wait(1),
                    fire(direction(11, "sequence"), speed(0, "sequence"), bullet()),
                ]),
                wait(120),
                repeat(200, [
                    wait(1),
                    fire(direction(-11, "sequence"), speed(0, "sequence"), bullet()),
                ]),
                wait(120)
            ]),
        ]),
    });
    danmakuConfig = {
        target: cat,
        createNewBullet: function(runner, spec) {
            deleteme = runner
            let bullet = CreateBullet(game, spriteSheet, runner.x, runner.y)
            runner.onVanish = function() {
                // bullet.remove();
                bullet.hit(10)
            };
            Object.assign(bullet, {
                step: function (dt) {
                    runner.update(dt)
                    this.x = runner.x
                    this.y = runner.y
                }
            })
            gameBoard.add(bullet)
        }
    };

    gameBoard.add(cat)
    game.setBoard(1, gameBoard)
    game.removeBoard(2)
    gameBoard.add(CreateLevel(game, spriteSheet, DEBUG_LEVEL, WinGame))
    gameBoard.add(CreateLevel(game, spriteSheet, level1, WinGame))
}

const GameOver = () => {
    game.gameOver = true
    game.setBoard(2, CreateMainTitle(
        game,
        "game over",
        "PRESS Z TO PLAY",
        PlayGame
    ))
}

const WinGame = () => {
    game.setBoard(2, CreateMainTitle(
        game,
        "you win!!",
        "PRESS Z TO PLAY AGAIN",
        PlayGame
    ))
}

const loadSprites = () => {


    spriteSheet.load(SPRITES, game.renderer, startGame)
}

window.addEventListener("load", () => { 
    document.getElementById("canvas").focus()
    game.initialize("canvas", loadSprites) 
})
