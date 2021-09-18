/**
 * 管理所有manager
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import EventManager from "./manager/EventManager";
import HttpManager from "./manager/HttpManager";
import LocalManager from "./manager/LocalManager";
import SoundManager from "./manager/SoundManager";
import UIManager from "./manager/UIManager";


const ceo = {
    uiMgr: new UIManager(),
    eventMgr : new EventManager(),
    localMgr : new LocalManager(),
    soundMgr : new SoundManager(),
    httpMgr  : new HttpManager(),
    
    godNode  : <cc.Node> null,
    init: ()=>{
        ceo.godNode = cc.find("Canvas");
    }
}

export default ceo;