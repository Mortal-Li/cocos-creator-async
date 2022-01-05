/**
 * 异形屏幕适配，挂载在需要适配的节点上
 * @author Mortal-Li
 * @created 2021年12月29日
 */

const {ccclass, property} = cc._decorator;

const WidgetDir = cc.Enum({
    None: 0,
    Top: 1,
    Bottom: 2,
    Left: 3,
    Right: 4
});

@ccclass
export default class WidgetAdapter extends cc.Component {
    
    @property({
        type: WidgetDir,
        tooltip: "需要适配的方向"
    })
    dir = WidgetDir.None;

    private preValue = 0;
    private wgt: cc.Widget = null;

    onLoad() {
        let T = this;

        let wgt = T.node.getComponent(cc.Widget);
        if (!wgt) {
            cc.warn("There is no cc.Widget.");
            return;
        }
        T.wgt = wgt;

        let dir = T.dir;
        if (dir == WidgetDir.Top) T.preValue = wgt.top;
        else if (dir == WidgetDir.Bottom) T.preValue = wgt.bottom;
        else if (dir == WidgetDir.Left) T.preValue = wgt.left;
        else if (dir == WidgetDir.Right) T.preValue = wgt.right;

        T.onResize();
        T.node.on(cc.Node.EventType.SIZE_CHANGED, T.onResize, T);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this.onResize, this);
    }

    onResize() {
        let T = this;

        let safeArea = cc.sys.getSafeAreaRect();
        let top = cc.winSize.height - safeArea.height - safeArea.y;
        let bottom = safeArea.y;
        let left = safeArea.x;
        let right = cc.winSize.width - safeArea.width - safeArea.x;

        let dir = T.dir;
        if (dir == WidgetDir.Top) T.wgt.top = top < 1 ? T.preValue : (T.preValue + top);
        else if (dir == WidgetDir.Bottom) T.wgt.bottom = bottom < 1 ? T.preValue : (T.preValue + bottom);
        else if (dir == WidgetDir.Left) T.preValue = left < 1 ? T.preValue : (T.preValue + left);
        else if (dir == WidgetDir.Right) T.preValue = right < 1 ? T.preValue : (T.preValue + right);
    }

}
