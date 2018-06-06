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

const CreateDanmakuConfig = (target) => ({
    target: target,
    createNewBullet: function(runner, spec) {
        let bullet = CreateDanmakuBullet(game, spriteSheet, runner, spec)
        runner.onVanish = function() {
            debugger
        };
        gameBoard.add(bullet)
    }
})

bulletml.dsl("bml_");
Danmaku_00 = new bulletml.Root({
    top: bml_action([
        bml_repeat(3, [
            bml_wait("40 + $rand * 100"),
            bml_fire(bml_speed(1.5), bml_bullet())
        ]),
    ]),
});
Danmaku_01 = new bulletml.Root({
    top: bml_action([
        bml_repeat(999, [
            bml_repeat(5, [
                bml_fire(bml_speed(1.5), bml_bullet()),
                bml_repeat(17, [
                    // bml_wait(1),
                    bml_fire(bml_direction(20, "sequence"), bml_speed(0, "sequence"), bml_bullet()),
                ]),
                bml_wait(20)
            ]),
            bml_wait(120),
            bml_repeat(5, [
                bml_fire(bml_speed(3.5), bml_bullet()),
                bml_repeat(35, [
                    // bml_wait(1),
                    bml_fire(bml_direction(10, "sequence"), bml_speed(0, "sequence"), bml_bullet()),
                ]),
                bml_wait(20)
            ]),
            bml_wait(120),
            bml_fire(bml_speed(1.5), bml_bullet()),
            bml_repeat(200, [
                bml_wait(1),
                bml_fire(bml_direction(-11, "sequence"), bml_speed(0, "sequence"), bml_bullet()),
            ]),
            bml_wait(120)
        ]),
    ]),
});

Danmaku_02 = new bulletml.Root({
    top: bml_action([
        bml_repeat(3, [
            bml_wait(100),
            bml_fire(bml_speed(4.5), bml_bullet({ tint: 0xFF8888FF})),
            bml_repeat(5,[
                bml_wait(5),
                bml_fire(bml_speed(0, "sequence"), bml_direction(0, "sequence"), bml_bullet({ tint: 0xFF8888FF})),
            ])
        ]),
    ]),
});

Danmaku_03 = new bulletml.Root({
    top: bml_action([
        bml_repeat(3, [
            bml_wait(100),
            bml_repeat(1, [
                bml_fire(bml_speed(1.5), bml_direction(45, "absolute"), bml_bullet({ tint: 0xFFFF88FF})),
                bml_repeat(3,[
                    bml_fire(bml_speed(0, "sequence"), bml_direction(90, "sequence"), bml_bullet({ tint: 0xFFFF88FF})),
                ]),
                bml_wait(50)
            ]),
            bml_wait(100),
            bml_repeat(1, [
                bml_fire(bml_speed(1.5), bml_direction(90, "absolute"), bml_bullet({ tint: 0xFF88FF88})),
                bml_repeat(3,[
                    bml_fire(bml_speed(0, "sequence"), bml_direction(90, "sequence"), bml_bullet({ tint: 0xFF88FF88})),
                ]),
                bml_wait(50)
            ])
        ]),
    ]),
});
