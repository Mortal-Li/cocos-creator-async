/**
 * 管理所有manager
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import EventManager from "./manager/EventManager";
import HttpManager from "./manager/HttpManager";
import LocalManager from "./manager/LocalManager";
import DebugManger from "./manager/DebugManger";
import QCollisionManager from "./manager/QCollisionManager";
import SocketManager from "./manager/SocketManager";
import SoundManager from "./manager/SoundManager";
import UIManager from "./manager/UIManager";


const ceo = {
    uiMgr: new UIManager(),
    eventMgr: new EventManager(),
    localMgr: new LocalManager(),
    soundMgr: new SoundManager(),
    httpMgr: new HttpManager(),
    debugMgr: new DebugManger(),

    qCollisionMgr: <QCollisionManager> null,
    socketMgr: <SocketManager> null,
    
    godNode: <cc.Node> null,
    
    init: (switchs: {
        /**
         * 是否开启快速碰撞检测模块，默认不开启
         */
        qt?: boolean,
        /**
         * 是否开启socket模块，默认不开启
         */
        socket?: boolean,

    } = {})=>{
        ceo.godNode = cc.find("Canvas");

        const defaultSwitchs = {
            qt: false,
            socket: false,
        }

        switchs = {
            ...defaultSwitchs,
            ...switchs
        }

        if (switchs.qt) {
            ceo.qCollisionMgr = new QCollisionManager();
        }

        if (switchs.socket) {
            ceo.socketMgr = new SocketManager();
        }
    },

    log: function(msg: string | any, ...subst) {
        cc.log(`[${getHMSM()}]`, msg, ...subst);
    },

    warn: function(msg: string | any, ...subst) {
        cc.warn(`[${getHMSM()}]`, msg, ...subst);
    },

    error: function(msg: string | any, ...subst) {
        cc.error(`[${getHMSM()}]`, msg, ...subst);
    },
}

function getHMSM() {
    let d = new Date();
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
}

export default ceo;