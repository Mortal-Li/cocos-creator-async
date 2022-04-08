/**
 * 场景适配器，挂载在场景下即可
 * @author Mortal-Li
 * @created 2021年9月2日
 */

const {ccclass, menu} = cc._decorator;

@ccclass
@menu("Adapter/Adapter")
export default class Adapter extends cc.Component {

    onLoad () {
        let T = this;
        T.node.on(cc.Node.EventType.SIZE_CHANGED, T.onResize, T);
        T.onResize();
    }

    onDestroy() {
        let T = this;
        T.node.off(cc.Node.EventType.SIZE_CHANGED, T.onResize, T);
    }

    onResize() {
        let cvs = cc.find("Canvas").getComponent(cc.Canvas);
        let dr = cvs.designResolution;
        let fs = cc.view.getFrameSize();

        if (fs.height / fs.width < dr.height / dr.width) {
            cvs.fitWidth = false;
            cvs.fitHeight = true;
        }
        else {
            cvs.fitWidth = true;
            cvs.fitHeight = false;
        }
    }

}
