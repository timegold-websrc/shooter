cc.Class({
    extends: cc.Component,

    properties: {
        gunPrefab : {
            default: null,
            type: cc.Prefab
        },
        correct: 1,
        health: 2
    },

    onCollisionEnter: function (other, self) {
        console.log('Shooter OK');
        
        var pos = other.world.position;
        var node_pos = self.node.getPosition();
        // var p_y = selfCollider.node.parent.y;

        var game = this.node.parent.getComponent('bgMap');
        game.spawnCircle(pos);

        other.node.removeFromParent();
        // //. not killed
        // this.updatePos();
        game.hasEnemy = true;
        game.enemyHitedOK();

    },

    onLoad () {
        this.stepTime = 0.1
        this.R = {
            alpha: 0,
            coff: 1,
            step: 5,
            delta: 0,
            rr: 30
        };
        this.shooterReady = false;
        this.game = null;
        this.bonus = [];
        var files = [
            'boss1.png', 'boss2.png', 'boss3.png'
        ];
        var idx = Math.floor(files.length * cc.random0To1());
        var texture = cc.textureCache.addImage(cc.url.raw("resources/img/boss/" + files[idx]));
        this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        this.gun;
        this.setGun();
   
    },

    start () {
        var b = [0, 0, 1, 0, 1, 2, 0, 0];
        this.stopShooter();
        this.bonus.push(b[Math.floor(b.length * cc.random0To1())]);
    },

    update (dt) {
        if (this.shooterReady) {
            this.drawShooter(dt);
        }
    },

    drawShooter(dt) {
        this.R.delta += dt;
        if (this.R.delta < 0.1) {
            return;
        }

        if (this.R.alpha < 0) {
            this.R.coff = 1;
        } else if (this.R.alpha > 45) {
            this.R.coff = -1;
        }
        this.R.alpha += this.R.step * this.R.coff;
        var a = this.R.alpha * this.correct * -1;
        this.gun.setRotation(a);
        this.R.delta = 0;
        var alpha = this.calcAlpha(this.R.alpha);

        if (alpha > this.targetAngle - 0.05 && alpha < this.targetAngle + 0.05) {
            this.gun.getComponent('gun').setAngle(this.calcAlpha(a));
            this.gun.getComponent('gun').startShoot();
            this.shooterReady = false;
        }

    },

    calcAlpha(a) {
        return a * Math.PI / 180;
    },

    stopShooter() {
        this.shooterReady = false;
        this.R = {
            alpha: 0,
            coff: 1,
            step: 5,
            delta: 0,
            rr: 30
        };
        this.gun.setRotation(0);
    },

    display(info) {
        var pos = info.paths[info.paths.length - 1];
        var w = this.node.parent.width;
        this.node.x = w / 2 * (info.coff + 1);
        this.node.y = pos.y;
        this.node.setScale(info.coff, 1);

        var s1 = cc.jumpTo(0.5, cc.v2(pos.x + 50 * info.coff, pos.y), 50, 1);
        var se = cc.sequence(s1, cc.callFunc(this.endDisplay, this));
        this.node.runAction(se);
    },

    endDisplay() {
        this.node.parent.getComponent('bgMap').readyPlayerShoot();

    },

    updatePos() {
        var game = this.node.parent.getComponent('bgMap');
        
        this.pathInfo = game.stairsPath[1];
        this.runStaus = 1;
        this.step = game.stepH;
        this.runMove();
    },

    runMove() {
        this.stopShooter();
        var w_runsArray = [];
        var p = this.pathInfo.paths;
        var coff = this.pathInfo.coff;
        var w_t = Math.abs((this.node.x - p[0].x) / this.step) * this.stepTime;

        console.log('time: ' + w_t);
        
        w_runsArray.push(cc.moveTo(w_t, p[0]));

        for (var i = 1; i < p.length; i++) {
            w_runsArray.push(cc.moveTo(this.stepTime, p[i]));
        }
        w_runsArray.push(cc.moveBy(this.stepTime, this.step * coff, 0));
        w_runsArray.push(cc.callFunc(this.endMove, this));
        var se = cc.sequence(w_runsArray);
        this.node.runAction(se);
        
        this.runStaus = 0;

    },
    endMove() {
        this.node.setScale(this.pathInfo.coff, 1);
        this.node.parent.getComponent('bgMap').readyPlayerShoot();
    },

    readyShooter(playPos) {
        var vect = cc.pSub(playPos, this.node.position);
        var angle = cc.pToAngle(cc.pCompOp(vect, Math.abs));
        this.targetAngle = angle;
        this.shooterReady = true;
    },

    setGun() {
        this.gun = cc.instantiate(this.gunPrefab);
        this.node.addChild(this.gun);
        this.gun.position = cc.v2(-30, 40);
    },


});