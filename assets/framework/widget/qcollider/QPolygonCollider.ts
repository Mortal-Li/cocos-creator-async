/**
 * 
 * @author Mortal-Li
 * @created 2022年4月1日
 */

import kk from "../../kk";
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
        kk.qCollisionMgr.addCollider(this);
    }

    onDisable() {
        kk.qCollisionMgr.removeCollider(this);
    }

}
