const EnemyStep = function(){
    this.t += dt
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
  
    this.x += this.vx * dt;
    this.y += this.vy * dt;
}

const CreateEnemy = function(game, spriteSheet, blueprint, override) {
    let en = Object
        .create(Sprite)
        .init(spriteSheet, blueprint.type)   
    Object.assign(this, {
        A:0,B:0,C:0,D:0,E:0,F:0,G:0,H:0 // defaults
    }, blueprint, override)
    this.w = this.spritesheet

}