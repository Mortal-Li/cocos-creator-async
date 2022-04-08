/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { PopupConf } from "../../Boot/Scripts/AssetConfig";
import GameData from "../../MainBundle/Scripts/common/GameData";
import { GameCustomEvent, TxtConst } from "../../MainBundle/Scripts/common/MainConst";
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
                Util.showToast(TxtConst.Hello);
                break;

            case "common":
                Util.showCommonPopup({
                    msg: TxtConst.AddGems,
                    btnTxtOK: TxtConst.Sure,
                    btnCallOK: () => {
                        GameData.gems += 10;
                        ceo.eventMgr.emit(GameCustomEvent.Update_GEM);
                    }
                });
                break;

            case "table":
                ceo.uiMgr.showPopup(PopupConf.TableView);
                break;

            case "adapter":
                ceo.uiMgr.showPopup(PopupConf.SafeAdapter);
                break;

            case "quad":
                ceo.uiMgr.showPopup(PopupConf.QuadTree);
                break;
        }
    }
}
