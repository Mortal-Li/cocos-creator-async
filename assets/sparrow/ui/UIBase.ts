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
     * 所在的prefab
     */
    pfb: cc.Prefab = null;

    /**
     * 传递的数据
     */
    recvData?: any;

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        
    }

    onDestroy() {
        if (this.pfb) this.pfb.decRef();
    }
}
