const LevelStep = function(dt){
    let idx = 0,
        remove = [],
        curShip = null
    this.t += dt * 1000

    while( (curShip = this.levelData[idx]) && (curShip[0] < this.t + 2000)) {
        if (this.t > curShip[1]){
            remove.push(curShip)
        } else if (curShip[0] < this.t){
            let bluePrint = enemies(this.game, curShip[3])
            let override = curShip[4]
            const enemy = CreateEnemy(this.game, this.spriteSheet, bluePrint, override)
            
            if (curShip[3] === "left_up_right_toss")
                window.Q = enemy

            this.board.add(enemy)
            curShip[0] += curShip[2]
        }
        idx++
    }

    remove.forEach((e) => {
        let remIdx = this.levelData.indexOf(e)
        if (remIdx !== -1){
            this.levelData.splice(remIdx, 1)
        }
    })

    if (this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
        this.board.remove(this)
        if (typeof this.callback === "function" && !this.game.gameOver) 
            this.callback();
    }
}

const CreateLevel = (game, spriteSheet, levelData, callback) => {
    let level = {
        game: game,
        spriteSheet, spriteSheet,
        levelData: levelData.map((e) => {
            return Object.create(e)
        }),
        t: 0,
        callback: callback
    }
    Object.assign(level, {
        draw: ()=>{},
        step: LevelStep
    })
    return level
}
