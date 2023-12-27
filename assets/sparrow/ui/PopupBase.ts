/**
 * 弹窗基类
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import ceo from "../ceo";
import UIBase from "./UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupBase extends UIBase {

    /**
     * 关闭弹窗返回的数据
     */
    ret?: any;

    onDestroyCall: (value?: any) => void = () => {};

    onDestroy() {
        ceo.uiMgr.autoRemovePopup(this.node.parent);
        this.onDestroyCall(this.ret);
        super.onDestroy();
    }

    /**
     * 关闭弹窗请调用此方法
     */
    close() {
        this.closeAnim();
    }

    /**
     * 打开弹窗的动画，如果不需要或另外实现则子类中覆盖
     */
    showAnim() {
        this.node.scale = 0;
        cc.tween(this.node)
            .set({ width: ceo.godNode.width, height: ceo.godNode.height })    // bug fix, scale may cause cc.Widget wrong
            .to(0.2, { scale: 1 }, cc.easeBackOut()).start();
    }

    /**
     * 关闭弹窗的动画，如果不需要或另外实现则子类中覆盖并调用destroy
     */
    closeAnim() {
        cc.tween(this.node).to(0.2, { scale: 0 }, cc.easeBackIn()).call(()=>{ this.node.destroy(); }).start();
    }


    setGrayBgOpacity(opacity: number) {
        this.node.parent.getChildByName("gray").opacity = opacity;
    }
}
