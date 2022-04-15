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
     * 当cacheMode为UICacheMode.Stay，并从其他Layer切回来时，
     * 会自动调用，以便做刷新操作
     */
    refresh() {}

}
