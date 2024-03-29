/**
 * 
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { LayerConf } from "../../Boot/Scripts/AssetConfig";
import kk from "../../framework/kk";
import LayerBase from "../../framework/ui/LayerBase";

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
                kk.uiMgr.goLayerAsync(LayerConf.Hall);
                break;
                
        }
    }
}
