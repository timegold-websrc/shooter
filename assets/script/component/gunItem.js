

cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        detailLabel: cc.Label,
        bgGraphics: cc.Graphics
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gun = null;
        this.idx = 0;
        this.selColor = cc.color(51, 58, 66, 255);
        
        this.namePosY = this.nameLabel.node.y;
        this.enabledStatus = false;


    },

    start () {
        this.node.on("touchend", function() {
            this.drawSelected();
            this.updateItemsPos();
            var event = new cc.Event.EventCustom("selectGunItem", true);
            event.setUserData(this.idx);
            this.node.dispatchEvent(event);
        }, this);
    },

    setItem(gun, idx, status) {
        
        this.idx = idx;

        this.gun = cc.instantiate(gun);
        this.node.addChild(this.gun);
        this.gun.setRotation(20);
        this.gun.setScale(1.2);
        var gunComp = this.gun.getComponent('gun');
        var enable = (status == 1) ? true: false;
        
        //. set gun detail information.
        this.nameLabel.string = gunComp.gunName;
        this.detailLabel.string = "子弹     " + gunComp.bulletBuff + "\n伤害     " + gunComp.power;
        this.detailLabel.node.active = false;
        this.drawUnSelect(enable);
        this.setItemEnable(enable);
    },

    setItemEnable(enable) {        
        var w_color = cc.color(255, 255, 255, 255);
        if (!enable) {
            var w_color = cc.color(184, 132, 132, 255);
        }
        this.gun.color = w_color;
        this.nameLabel.node.color = w_color;
        this.detailLabel.node.color = w_color;

        this.enabledStatus = enable;
    },
    drawUnSelect(active) {
        var g = this.bgGraphics;
        var x = -80;
        var w = 160;
        g.clear();
        if (active) {
            g.fillColor = this.selColor;
            g.lineWidth = 5;
        } else {
            g.fillColor = cc.color(0, 0, 0, 100);
            g.lineWidth = 0;
        }
        g.roundRect(x, x, w, w, 5);
        g.fill();
        g.stroke();
        g.close();
    },

    drawSelected() {
        var g = this.bgGraphics;
        var x = -85;
        var y = -100;
        g.clear();
        g.fillColor = this.selColor;
        g.lineWidth = 5;
        g.roundRect(x, y, -2 * x, -2 * y, 5);
        g.fill();
        g.stroke();
        g.close();
    },
    updateItemsPos() {
        this.nameLabel.node.y = this.namePosY + 20;
        this.detailLabel.node.active = true;
        this.gun.y = 30;
        this.gun.setScale(1.4);
        
    },
    initItemPos() {
        this.nameLabel.node.y = this.namePosY;
        this.gun.y = 0;
        this.gun.setScale(1.2);
        this.detailLabel.node.active = false;
    },

    

    // update (dt) {},
});
