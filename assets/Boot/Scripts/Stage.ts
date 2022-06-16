/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import ceo from "../../sparrow/ceo";
import { LayerConf } from "./AssetConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Stage extends cc.Component {

    start () {
        ceo.init({
            qt: true,
            socket: true,
        });
        ceo.uiMgr.gotoLayer(LayerConf.Load);
    }

}

cc.log("Welcome~");