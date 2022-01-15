/**
 * 场景适配器，挂载在场景下即可
 * @author Mortal-Li
 * @created 2021年9月2日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Adapter extends cc.Component {

    onLoad () {
        let cvs = cc.find("Canvas").getComponent(cc.Canvas);
        cvs.fitWidth = true;
        cvs.fitHeight = true;
        this.refreshSize();
    }

    onEnable() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.refreshSize, this);
    }

    onDisable() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.refreshSize, this);
    }

    refreshSize() {
        let dr = cc.view.getDesignResolutionSize();
        let fs = cc.view.getFrameSize();

        let scale = Math.max(dr.width / fs.width, dr.height / fs.height);
        this.node.width = fs.width * scale;
        this.node.height = fs.height * scale;
    }
}
