/**
 * 
 * @author Mortal-Li
 * @created 2022年4月1日
 */

import kk from "../../kk";
import { QTBounds, QTObject, Quadtree } from "../../tools/Quadtree";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("QCollider/QBoxCollider")
export default class QBoxCollider extends cc.BoxCollider implements QTObject {
    
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
