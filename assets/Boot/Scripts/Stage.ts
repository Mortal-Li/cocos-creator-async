/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import fw from "../../framework/fw";
import { LayerConf } from "./AssetConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Stage extends cc.Component {

    start () {
        fw.init({
            qt: true,
            socket: true,
        });
        fw.uiMgr.goLayerAsync(LayerConf.Load);
    }

}

fw.log("Welcome~ https://github.com/Mortal-Li/cocos-creator-async");