/**
 * 管理所有manager
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import EventManager from "./manager/EventManager";
import HttpManager from "./manager/HttpManager";
import LayerManager from "./manager/LayerManager";
import LocalManager from "./manager/LocalManager";
import PopupManager from "./manager/PopupManager";
import SoundManager from "./manager/SoundManager";


const ceo = {
    eventMgr : new EventManager(),
    localMgr : new LocalManager(),
    layerMgr : new LayerManager(),
    popupMgr : new PopupManager(),
    soundMgr : new SoundManager(),
    httpMgr  : new HttpManager(),
    
    godNode  : <cc.Node> null,
    init: ()=>{
        ceo.godNode = cc.find("Canvas");
    }
}

export default ceo;