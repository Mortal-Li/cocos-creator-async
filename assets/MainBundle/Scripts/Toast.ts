/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import UIBase from "../../framework/ui/UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Toast extends UIBase {
    
    @property(cc.Label)
    private cntLabel: cc.Label = null;

    msg: string = '';
    time: number = 2;

    start () {
        let T = this;

        T.cntLabel.string = T.msg;
        let t  = T.time / 3;
        cc.tween(T.node).by(t, { y: 130 }).delay(t).to(t, { opacity: 0 }).removeSelf().start();
    }

}
