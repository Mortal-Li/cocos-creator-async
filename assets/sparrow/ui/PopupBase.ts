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
        ceo.uiMgr._autoRemovePopup(this.node.parent);
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
            .to(0.2, { scale: 1 }, cc.easeBackOut())
            .start();
    }

    /**
     * 关闭弹窗的动画，如果不需要或另外实现则子类中覆盖并调用destroy
     */
    closeAnim() {
        cc.tween(this.node).to(0.2, { scale: 0 }, cc.easeBackIn()).call(()=>{ this.node.destroy(); }).start();
    }

    /**
     * 设置黑色背景透明度，默认200
     */
    setDarkBgOpacity(opacity: number) {
        this.node.parent.getChildByName("dark").opacity = opacity;
    }

    /**
     * 点击非nds数组中的对象，则关闭弹窗，需手动调用开启;
     * 其他触摸控件如Button、Toggle等会优先响应，不用加到数组
     * @param nds ;
     */
    enableClickToClose(nds: cc.Node[]) {
        this.node.on(cc.Node.EventType.TOUCH_END, (evt: cc.Event.EventTouch) => {
            let startPos = evt.getStartLocation();
            let endPos = evt.getLocation();
            let subPos = endPos.sub(startPos);
            if (Math.abs(subPos.x) < 15 && Math.abs(subPos.y) < 15) {
                let needClose = true;
                for (let i = 0; i < nds.length; ++i) {
                    if (nds[i].getBoundingBoxToWorld().contains(startPos)) {
                        needClose = false;
                        break;
                    }
                }
                
                if (needClose) {
                    this.node.off(cc.Node.EventType.TOUCH_END);
                    this.close();
                }
            }
        }, this);
    }
}
