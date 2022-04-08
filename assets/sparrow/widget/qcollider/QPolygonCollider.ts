/**
 * 
 * @author Mortal-Li
 * @created 2022年4月1日
 */

import ceo from "../../ceo";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("QCollider/QPolygonCollider")
export default class QPolygonCollider extends cc.PolygonCollider {
    
    onEnable() {
        ceo.qCollisionMgr.addCollider(this);
    }

    onDisable() {
        ceo.qCollisionMgr.removeCollider(this);
    }

}
