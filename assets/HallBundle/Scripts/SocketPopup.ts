/**
 * 
 * @author Mortal-Li
 * @created 2022年6月15日
 */

import { CMDID, socketCenter } from "../../MainBundle/Scripts/common/SocketCenter";
import PopupBase from "../../framework/ui/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SocketPopup extends PopupBase {

    @property(cc.EditBox)
    private urlEB: cc.EditBox = null;

    @property(cc.EditBox)
    private txtEB: cc.EditBox = null;
    
    @property(cc.Node)
    private loNd: cc.Node = null;

    onLoad () {

    }

    start () {

    }

    async onBtnClick(evt: cc.Event.EventTouch, name: string) {
        switch (name) {
            case "close":
                socketCenter.clear();
                this.close();
                break;

            case "conn":
                if (this.urlEB.string.length > 0) {
                    await socketCenter.connect(this.urlEB.string);
                    let lblNd = cc.instantiate(this.getObj("help.txt"));
                    lblNd.getComponent(cc.Label).string = "Connected!";
                    lblNd.parent = this.loNd;
                }
                break;

            case "send":
                if (this.txtEB.string.length > 0) {
                    let ret = await socketCenter.req(CMDID.CMD_HELLO, this.txtEB.string);
                    let lblNd = cc.instantiate(this.getObj("help.txt"));
                    lblNd.getComponent(cc.Label).string = "response:" + ret;
                    lblNd.parent = this.loNd;
                }
                break;
        }
    }

}
