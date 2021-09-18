/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { PopupConf } from "../../Boot/Scripts/AssetConfig";
import GameData from "../../MainBundle/Scripts/common/GameData";
import { GameCustomEvent } from "../../MainBundle/Scripts/common/MainConst";
import Util from "../../MainBundle/Scripts/common/Util";
import ceo from "../../sparrow/ceo";
import UIBase from "../../sparrow/ui/UIBase";

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
                ceo.uiMgr.showPopup(PopupConf.Settings);
                break;
        
            case "toast":
                Util.showToast("Toast test.");
                break;

            case "common":
                Util.showCommonPopup({
                    msg: "Add 10 Gems.",
                    btnTxtOK: "Sure",
                    btnCallOK: () => {
                        GameData.gems += 10;
                        ceo.eventMgr.emit(GameCustomEvent.Update_GEM);
                    }
                });
                break;
        }
    }
}
