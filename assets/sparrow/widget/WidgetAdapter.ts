/**
 * 异形屏幕适配，挂载在需要适配的节点上
 * @author Mortal-Li
 * @created 2021年12月29日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class WidgetAdapter extends cc.Component {
 
    private originValue = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };
    private wgt: cc.Widget = null;
 
    onLoad() {
        let T = this;

        let wgt = T.node.getComponent(cc.Widget);
        if (!wgt) {
            cc.warn("There is no cc.Widget.");
            return;
        }
        T.wgt = wgt;

        T.originValue.top = wgt.top;
        T.originValue.bottom = wgt.bottom;
        T.originValue.left = wgt.left;
        T.originValue.right = wgt.right;

        T.refresh = T.refresh.bind(T);
        T.refresh();
    }

    onEnable() {
        window.addEventListener("orientationchange", this.refresh);
    }

    onDisable() {
        window.removeEventListener("orientationchange", this.refresh);
    }

    refresh() {
        let T = this;

        let wgt = T.wgt;
        if (!wgt) return;

        let safeArea = cc.sys.getSafeAreaRect();
        let visible = cc.view.getVisibleSize();
        let top = visible.height - safeArea.height - safeArea.y;
        let bottom = safeArea.y;
        let left = safeArea.x;
        let right = visible.width - safeArea.width - safeArea.x;
        
        if (wgt.isAlignTop) T.wgt.top = T.originValue.top + top;
        if (wgt.isAlignBottom) T.wgt.bottom = T.originValue.bottom + bottom;
        if (wgt.isAlignLeft) T.wgt.left = T.originValue.left + left;
        if (wgt.isAlignRight) T.wgt.right = T.originValue.right + right;
    }
 
}