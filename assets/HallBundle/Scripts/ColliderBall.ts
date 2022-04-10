/**
 * 
 * @author Mortal-Li
 * @created 2022年3月30日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColliderBall extends cc.Component {
    
    private numOfContacts = 0;

    onLoad () {

    }

    start () {

    }

    onCollisionEnter(other, self) {
        this.updateNum(1);
    }

    onCollisionStay(other, self) {

    }

    onCollisionExit(other, self) {
        this.updateNum(-1);
    }

    onCollisionHappened(other, self) {
        this.updateNum(0);
    }

    updateNum(diff: number) {
        this.numOfContacts += diff;
        this.node.color = this.numOfContacts > 0 ? cc.Color.BLACK : cc.Color.WHITE;
    }
}
