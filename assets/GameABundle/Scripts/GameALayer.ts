/**
 * 
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { LayerConf } from "../../Boot/Scripts/AssetConfig";
import ceo from "../../sparrow/ceo";
import LayerBase from "../../sparrow/ui/LayerBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameALayer extends LayerBase {
    
    onLoad () {

    }

    start () {

    }

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        switch (name) {
            case "back":
                ceo.uiMgr.goLayerAsync(LayerConf.Hall);
                break;
                
        }
    }
}
