/**
 * 
 * @author Mortal-Li
 * @created 2022年4月1日
 */

import ceo from "../../ceo";
import { QTBounds, QTObject, Quadtree } from "../../tools/Quadtree";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("QCollider/QPolygonCollider")
export default class QPolygonCollider extends cc.PolygonCollider implements QTObject {
    
    cid: number = 0;
    bounds: QTBounds = null;
    objs: QTObject[] = [];
    qts: Quadtree[] = [];

    onEnable() {
        ceo.qCollisionMgr.addCollider(this);
    }

    onDisable() {
        ceo.qCollisionMgr.removeCollider(this);
    }

}
