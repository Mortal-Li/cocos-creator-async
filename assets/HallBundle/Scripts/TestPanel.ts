/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { PopupConf } from "../../Boot/Scripts/AssetConfig";
import { GameCustomEvent, TxtConst } from "../../MainBundle/Scripts/common/MainConst";
import Util from "../../MainBundle/Scripts/common/Util";
import kk from "../../framework/kk";
import UIBase from "../../framework/ui/UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestPanel extends UIBase {
    
    onLoad () {

    }

    start () {

    }
    
    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        switch (name) {
            case "set":
                kk.uiMgr.showPopupAsync(PopupConf.Settings);
                break;
        
            case "toast":
                Util.showToast(TxtConst.Hello);
                break;

            case "common":
                Util.showCommonPopup({
                    msg: TxtConst.AddGems,
                    btnTxtOK: TxtConst.Sure,
                    btnCallOK: () => {
                        kk.eventMgr.emit(GameCustomEvent.Update_GEM, 10, true);
                    }
                });
                break;

            case "table":
                kk.uiMgr.showPopupAsync(PopupConf.TableView);
                break;

            case "adapter":
                kk.uiMgr.showPopupAsync(PopupConf.SafeAdapter);
                break;

            case "quad":
                kk.uiMgr.showPopupAsync(PopupConf.QuadTree);
                break;

            case "socket":
                kk.uiMgr.showPopupAsync(PopupConf.Socket);
                break;

            case "debug":
                kk.debugMgr.switchDebugLogBtn();
                break;

            case "frame":
                kk.uiMgr.showPopupAsync(PopupConf.Framing);
                break;
        }
    }
}
