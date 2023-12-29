/**
 * UI基类
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import CompBase from "./CompBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBase extends CompBase {

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
}
