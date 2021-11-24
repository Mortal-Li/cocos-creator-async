/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import PopupBase from "../../sparrow/ui/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CommonPopup extends PopupBase {
    
    @property(cc.Label)
    private titleLbl: cc.Label = null;

    @property(cc.Label)
    private msgLbl: cc.Label = null;

    @property(cc.Label)
    private btnLbl: cc.Label = null;

    onLoad () {
        let T = this;

        let d = this.recvData;
        if (d.title) {
            T.titleLbl.string = d.title;
        }
        T.msgLbl.string = d.msg;

        if (d.btnTxtOK) {
            T.btnLbl.string = d.btnTxtOK;
        }

        if (d.hideNO) {
            T.getUIObj("bg.close").active = false;
        }
        if (d.height) {
            T.getUIObj("bg").height = d.height;
        }
    }

    start () {

    }

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        let T = this;

        switch (name) {
            case "close":
                T.ret = false;
                if (T.recvData.btnCallNO) {
                    T.recvData.btnCallNO();
                }
                break;
        
            case "ok":
                T.ret = true;
                if (T.recvData.btnCallOK) {
                    T.recvData.btnCallOK();
                }
                break;
        }

        T.close();
    }

    closeAnim() {
        this.node.destroy();
    }
}
