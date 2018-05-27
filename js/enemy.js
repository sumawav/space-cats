// A Constant horizontal velocity
// B Strength of horizontal sinusoidal velocity
// C Period of horizontal sinusoidal velocity
// D Time shift of horizontal sinusoidal velocity
// E Constant vertical velocity
// F Strength of vertical sinusoidal velocity
// G Period of vertical sinusoidal velocity

const EnemyStep = function(dt){
    this.t += dt
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D)
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H)
  
    this.x += this.vx * dt
    this.y += this.vy * dt
}

const CreateEnemy = function(game, spriteSheet, blueprint, override) {
    let en = Object
        .create(Sprite)
        .init(spriteSheet, blueprint.enemyType)   
    Object.assign(en, {
        A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0,t:0, // defaults
        type: OBJECT_ENEMY
    }, blueprint, override)
    Object.assign(en, {
        draw: SpriteDraw,
        step: EnemyStep
    })
    return en
}