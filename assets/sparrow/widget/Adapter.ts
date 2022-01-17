/**
 * 场景适配器，挂载在场景下即可
 * @author Mortal-Li
 * @created 2021年9月2日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Adapter extends cc.Component {

    private originDesign: cc.Size = null;

    onLoad () {
        this.refreshSize = this.refreshSize.bind(this);
        this.refreshSize();
    }

    onEnable() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.refreshSize, this);
        window.addEventListener("orientationchange", this.refreshSize);
    }

    onDisable() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.refreshSize, this);
        window.removeEventListener("orientationchange", this.refreshSize);
    }

    refreshSize() {
        let T = this;

        let cvs = cc.find("Canvas").getComponent(cc.Canvas);
        if (!T.originDesign) {
            T.originDesign = cvs.designResolution.clone();
        }
        
        let fs = cc.view.getFrameSize();
        let dw = T.originDesign.width, dh = T.originDesign.height;
        let f_hw = fs.height / fs.width, d_hw = dh / dw;
        let w = f_hw < d_hw ? dh / f_hw : dw;
        let h = f_hw < d_hw ? dh : dw * f_hw;
        let policy = f_hw < d_hw ? cc.ResolutionPolicy.FIXED_HEIGHT : cc.ResolutionPolicy.FIXED_WIDTH;
        cc.view.setDesignResolutionSize(w, h, policy);
    }
}
