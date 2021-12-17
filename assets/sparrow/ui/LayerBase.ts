/**
 * Layer基类
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import UIBase from "./UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LayerBase extends UIBase {
    
    /**
     * 刷新当前界面 (stay为true时调用)
     */
    refresh() {}

}
