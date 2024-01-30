/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import kk from "../../framework/kk";
import { LayerConf } from "./AssetConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Stage extends cc.Component {

    start () {
        kk.init({
            qt: true,
            socket: true,
        });
        kk.uiMgr.goLayerAsync(LayerConf.Load);
    }

}

cc.log("Welcome~ https://github.com/Mortal-Li/cocos-creator-async");