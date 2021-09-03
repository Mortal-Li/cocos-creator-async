/**
 * UI基类
 * @author Mortal-Li
 * @created 2021年9月2日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBase extends cc.Component {

    /**
     * 传递的数据
     */
    recvData?: any;

    /**
     * 在UI树下检索对应的节点或组件
     * @param pathStr "node1name.node2name.node3name$componetName"
     * @param parentNode 从哪个节点开始检索，默认根节点
     */
    getUIObj<T = cc.Node>(pathStr: string) : T;
    getUIObj<T = cc.Node>(parentNode: cc.Node, pathStr: string) : T;
    getUIObj(param1: any, param2?: any) : any {
        let p: cc.Node;
        let pathStr: string;
        if (typeof(param1) === "string") {
            p = this.node;
            pathStr = param1;
        } else {
            p = param1;
            pathStr = param2;
        }

        let strs = pathStr.split('.');
        for (let i = 0; i < strs.length - 1; ++i) {
            p = p.getChildByName(strs[i]);
            if (!p) {
                cc.warn("Child is NULL!");
                return null;
            }
        }

        let last = strs.pop();
        let idx = last.indexOf('$');
        if (idx == -1) {
            return p.getChildByName(last);
        } else {
            let infos = last.split('$');
            return p.getChildByName(infos[0]).getComponent(cc[infos[1]]);
        }
    }

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        
    }
}
