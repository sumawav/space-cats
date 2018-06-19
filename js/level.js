const LevelStep = function(dt){
    let idx = 0,
        remove = [],
        curWave = null
    this.t += dt * 1000

    while( (curWave = this.levelData[idx]) && (curWave[0] < this.t + 2000)) {
        if (this.t > curWave[1]){
            remove.push(curWave)
        } else if (curWave[0] < this.t){
            let bluePrint = enemies(this.game, curWave[3])
            let override = curWave[4]
            const enemy = CreateEnemy(this.game, this.spriteSheet, bluePrint, override)
            
            this.board.add(enemy)
            curWave[0] += curWave[2]
        }
        idx++
    }

    remove.forEach((e) => {
        let remIdx = this.levelData.indexOf(e)
        if (remIdx !== -1){
            this.levelData.splice(remIdx, 1)
        }
    })

    if (this.levelData.length === 0 && this.appendQueue.length){
        this.levelData = this.appendQueue.shift()
        this.t = 0
        return
    }

    if (this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
        this.board.remove(this)
        if (typeof this.callback === "function" && !this.game.gameOver) 
            this.callback();
    }
}

const QueueAppendLevel = function(levelData) {
    this.appendQueue.push(levelData)
}

const CreateLevel = (game, spriteSheet, levelData, callback) => {
    let level = {
        game: game,
        spriteSheet, spriteSheet,
        levelData: levelData.map((e) => {
            return Object.create(e)
        }),
        t: 0,
        callback: callback,
        appendQueue: [],
    }
    Object.assign(level, {
        draw: ()=>{},
        step: LevelStep,
        queue: QueueAppendLevel
    })
    return level
}
