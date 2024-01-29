/**
 * 通过限制节点的宽或高来限制节点的显示大小
 * @author Mortal-Li
 * @created 2024年1月19日
 */

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("Tools/NodeSizeLimit")
export default class NodeSizeLimit extends cc.Component {
    
    @property(cc.Integer)
    len: number = 9999;

    @property(cc.Boolean)
    isHorizon: boolean = true;

    onLoad () {
        let T = this;
        T.node.on(cc.Node.EventType.SIZE_CHANGED, T.onResize, T);
        T.onResize();
    }

    onResize () {
        let T = this;

        let curLen = T.isHorizon ? T.node.width : T.node.height;
        if (curLen > T.len) {
            T.node.scale = T.len / curLen;
        } else {
            T.node.scale = 1;
        }
    }

}
