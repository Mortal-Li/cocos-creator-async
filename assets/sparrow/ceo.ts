/**
 * 管理所有manager
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import EventManager from "./manager/EventManager";
import HttpManager from "./manager/HttpManager";
import LocalManager from "./manager/LocalManager";
import QCollisionManager from "./manager/QCollisionManager";
import SoundManager from "./manager/SoundManager";
import UIManager from "./manager/UIManager";


const ceo = {
    uiMgr: new UIManager(),
    eventMgr : new EventManager(),
    localMgr : new LocalManager(),
    soundMgr : new SoundManager(),
    httpMgr  : new HttpManager(),

    qCollisionMgr: <QCollisionManager> null,
    
    godNode  : <cc.Node> null,
    init: (switchs = {
        qt: true
    })=>{
        ceo.godNode = cc.find("Canvas");

        if (switchs.qt) {
            ceo.qCollisionMgr = new QCollisionManager();
        }
    }
}

export default ceo;