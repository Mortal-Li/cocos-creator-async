/**
 * 
 * @author Mortal-Li
 * @created 2022年4月1日
 */

import ceo from "../../ceo";
import { QTBounds, Quadtree } from "../../tools/Quadtree";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("QCollider/QCircleCollider")
export default class QCircleCollider extends cc.CircleCollider {
    
    cid: number = 0;
    bounds: QTBounds = null;
    objs: any[] = null;
    qts: Quadtree[] = [];

    onEnable() {
        ceo.qCollisionMgr.addCollider(this);
    }

    onDisable() {
        ceo.qCollisionMgr.removeCollider(this);
    }
    
}