/**
 * 弹窗基类
 * @author Mortal-Li
 * @created 2021年9月2日
 */

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
        this.onDestroyCall(this.ret);
    }

}
