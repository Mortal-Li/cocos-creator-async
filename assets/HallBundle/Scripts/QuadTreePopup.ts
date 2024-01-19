/**
 * 
 * @author Mortal-Li
 * @created 2022年3月30日
 */


import fw from "../../framework/fw";
import MathHelper from "../../framework/tools/MathHelper";
import PopupBase from "../../framework/ui/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class QuadTreePopup extends PopupBase {

    @property(cc.Node)
    ballNd: cc.Node = null;

    @property(cc.Node)
    ballNd2: cc.Node = null;

    onLoad () {
        
    }

    start () {

    }

    onBtnClick(evt: cc.Event.EventTouch, name: string): void {
        let T = this;

        T.reset();

        switch (name) {
            case "normal":
                T.showNormal();
                break;

            case "quad":
                T.showQuad();
                break;

            case "close":
                T.close();
                break;
        }
    }

    showNormal() {
        let T = this;

        cc.director.getCollisionManager().enabled = true;

        T.initBalls(T.ballNd);
    }

    reset() {
        fw.qCollisionMgr.enabled = false;
        cc.director.getCollisionManager().enabled = false;
        this.getObj("bg").removeAllChildren();
    }

    showQuad() {
        let T = this;
        
        fw.qCollisionMgr.resetQt(T.getObj("bg").getBoundingBoxToWorld());
        fw.qCollisionMgr.enabled = true;

        T.initBalls(T.ballNd2);
    }

    initBalls(target: cc.Node) {
        let T = this;

        let bg = T.getObj("bg");
        for (let i = 0; i < 1500; ++i) {
            let ball = cc.instantiate(target);
            ball.parent = bg;
            
            let startPos = MathHelper.randomV2(bg.width, bg.height);
            let endPos = MathHelper.randomV2(bg.width, bg.height);

            ball.setPosition(startPos);
            cc.tween(ball).to(6, { x: endPos.x, y: endPos.y }).to(6, { x: startPos.x, y: startPos.y }).union().repeatForever().start();
        }
    }
}
