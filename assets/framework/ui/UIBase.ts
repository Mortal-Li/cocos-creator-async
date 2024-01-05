/**
 * UI基类
 * @author Mortal-Li
 * @created 2021年9月2日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBase extends cc.Component {

    /**
     * 动态加载的资源
     */
    refAssets: cc.Asset[] = [];

    /**
     * 传递进来的数据
     */
    recvData?: any;

    /**
     * 按钮点击监听
     */
    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        
    }

    onDestroy() {
        this.refAssets.forEach((ast, i)=>{
            ast.decRef();
        });
        this.refAssets = null;
    }

    /**
     * 在UI树下检索对应的节点或组件
     * @param pathStr "node1name.node2name.node3name"
     * @param parentNode 从哪个节点开始检索，默认根节点
     * @param type 组件类型，可选
     */
     getObj<T = cc.Node>(pathStr: string, type?: {prototype: T}) : T;
     getObj<T = cc.Node>(parentNode: cc.Node, pathStr: string, type?: {prototype: T}) : T;
     getObj(param1: any, param2?: any, param3?: any) : any {
         let p: cc.Node;
         let pathStr: string;
         let typ: any;
         if (typeof(param1) === "string") {
             p = this.node;
             pathStr = param1;
             typ = param2;
         } else {
             p = param1;
             pathStr = param2;
             typ = param3;
         }
 
         let strs = pathStr.split('.');
         for (let i = 0; i < strs.length; ++i) {
             p = p.getChildByName(strs[i]);
             if (!p) {
                 if (strs.length > 1) cc.warn("Child is NULL!", strs[i]);
                 return null;
             }
         }
 
         if (typ) return p.getComponent(typ);
         else return p;
     }
}
