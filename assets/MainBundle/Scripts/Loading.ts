/**
 * 
 * @author Mortal-Li
 * @created 2021年9月22日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    
    @property(cc.Node)
    private bg: cc.Node = null;
    
    @property(cc.Node)
    private loadNode: cc.Node = null;

    private delay: number = 1;

    static def: number = 0;
    static self: cc.Node;
    static init(self: cc.Node) {
        self.active = false;
        Loading.self = self;
    }

    onLoad () {
        cc.tween(this.loadNode)
            .by(1, { angle: -360 })
            .union()
            .repeatForever()
            .start();
    }
    
    static show() {
        Loading.def++;
        if (Loading.def === 1) {
            Loading.self.active = true;
            Loading.self.getComponent(Loading).showL();
        }
    }

    static hide() {
        Loading.def--;
        if (Loading.def === 0) {
            Loading.self.getComponent(Loading).hideL();
        }
    }

    showL() {
        let T = this;
        T.bg.active = false;
        T.loadNode.active = false;
        T.scheduleOnce(T._show, T.delay);
    }

    private _show() {
        let T = this;
        T.bg.active = true;
        T.loadNode.active = true;
    }

    hideL() {
        let T = this;
        T.unschedule(T._show);
        Loading.self.active = false;
    }

}
