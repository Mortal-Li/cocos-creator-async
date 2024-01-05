/**
 * 
 * @author Mortal-Li
 * @created 2022年3月30日
 */


import ceo from "../../framework/ceo";
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

        let bg = T.getObj("bg");
        for (let i = 0; i < 1500; ++i) {
            let ball = cc.instantiate(T.ballNd);
            ball.parent = bg;
            
            let startPos = cc.v2(bg.width * (Math.random() - 0.5), bg.height * (Math.random() - 0.5));
            let endPos = cc.v2(bg.width * (Math.random() - 0.5), bg.height * (Math.random() - 0.5));

            ball.setPosition(startPos);
            cc.tween(ball).to(6, { x: endPos.x, y: endPos.y }).to(6, { x: startPos.x, y: startPos.y }).union().repeatForever().start();
        }
    }

    reset() {
        ceo.qCollisionMgr.enabled = false;
        cc.director.getCollisionManager().enabled = false;
        this.getObj("bg").removeAllChildren();
    }

    showQuad() {
        let T = this;

        let bg = T.getObj("bg");
        ceo.qCollisionMgr.resetQt(bg.getBoundingBoxToWorld());
        ceo.qCollisionMgr.enabled = true;

        for (let i = 0; i < 1500; ++i) {
            let ball = cc.instantiate(T.ballNd2);
            ball.parent = bg;
            
            let startPos = cc.v2(bg.width * (Math.random() - 0.5), bg.height * (Math.random() - 0.5));
            let endPos = cc.v2(bg.width * (Math.random() - 0.5), bg.height * (Math.random() - 0.5));

            ball.setPosition(startPos);
            cc.tween(ball).to(6, { x: endPos.x, y: endPos.y }).to(6, { x: startPos.x, y: startPos.y }).union().repeatForever().start();
        }
    }
}
