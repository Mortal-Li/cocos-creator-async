/**
 * 基于四叉树的碰撞检测管理器
 * 使用方式和引擎自带的碰撞管理器一样
 * 1、先打开项目设置面板，(项目 -> 项目设置...)，在分组管理中添加分组并设置哪些组可以产生碰撞;
 * 2、给碰撞节点添加对应的碰撞组件，如 QCircleCollider、QBox;
 * 3、开启碰撞：ceo.qCollisionMgr.enabled = true;
 * 4、碰撞回调函数和引擎自带的也一样, onCollisionEnter、onCollisionStay、onCollisionExit
 * @author Mortal-Li
 * @created 2022年3月30日
 */

import { CollisionType, QContact } from "../tools/QContact";
import { Quadtree } from "../tools/Quadtree";

let _gIdx = 0;

export default class QCollisionManager {
    
    enabled: boolean = false;
    enabledDebugDraw: boolean = false;

    private _qt: Quadtree = null;
    private _colliders: cc.Collider[] = [];
    // private _contacts: QContact[] = [];
    private _mapI2C: any[] = [];

    updateCollider: Function = null;
    initCollider: Function = null;

    constructor() {
        this._qt = new Quadtree({
            x: 0,
            y: 0,
            width: cc.winSize.width,
            height: cc.winSize.height
        });
        
        this.initCollider = cc.director.getCollisionManager()["initCollider"];
        this.updateCollider = cc.director.getCollisionManager()["updateCollider"];

        // register id, set update
        cc.director.getScheduler().enableForTarget(this);
        cc.director.getScheduler().scheduleUpdate(this, cc.Scheduler.PRIORITY_SYSTEM, false);
    }

    resetQt(bounds) {
        if (this._qt) {
            this._qt.clear();
            this._qt = null;
        }
        this._qt = new Quadtree(bounds);
    }

    onNodeGroupChanged(node) {
        let colliders = node.getComponents(cc.Collider);

        for (let i = 0, l = colliders.length; i < l; i++) {
            let collider = colliders[i];
            if(cc.PhysicsCollider && collider instanceof cc.PhysicsCollider) {
                continue;
            }
            this.removeCollider(collider);
            this.addCollider(collider);
        }
    }

    addCollider(collider: cc.Collider) {
        let colliders = this._colliders;
        let index = colliders.indexOf(collider);
        if (index === -1) {
            collider["cid"] = ++_gIdx;
            this._mapI2C[_gIdx] = [];
            for (let i = 0, l = colliders.length; i < l; i++) {
                let other = colliders[i];
                if (this.shouldCollide(collider, other)) {
                    let contact = new QContact(collider, other);
                    // this._contacts.push(contact);
                    this._mapI2C[_gIdx][other["cid"]] = contact;
                }
            }

            colliders.push(collider);
            this.initCollider(collider);
        }

        collider.node.on(cc.Node.EventType.GROUP_CHANGED, this.onNodeGroupChanged, this);
    }

    removeCollider(collider: cc.Collider) {
        let colliders = this._colliders;
        let index = colliders.indexOf(collider);
        if (index >= 0) {
            colliders.splice(index, 1);

            // let contacts = this._contacts;
            // for (let i = contacts.length - 1; i >= 0; i--) {
            //     let contact = contacts[i];
            //     if (contact.collider1 === collider || contact.collider2 === collider) {
            //         if (contact.touching) {
            //             this._doCollide(CollisionType.CollisionExit, contact);
            //         }

            //         contacts.splice(i, 1);
            //     }
            // }

            let cid = collider["cid"]
            for (let i = cid - 1; i > 1; --i) {
                let contact = this._mapI2C[cid][i];
                if (contact) {
                    if (contact.touching) {
                        this._doCollide(CollisionType.CollisionExit, contact);
                    }
                    this._mapI2C[cid][i] = null;
                }
            }


            collider.node.off(cc.Node.EventType.GROUP_CHANGED, this.onNodeGroupChanged, this);
        }
        else {
            cc.warn("Not Found");
        }
    }

    _doCollide(collisionType: number, contact: QContact) {
        let contactFunc;
        switch (collisionType) {
            case CollisionType.CollisionEnter:
                contactFunc = 'onCollisionEnter';
                break;
            case CollisionType.CollisionStay:
                contactFunc = 'onCollisionStay';
                break;
            case CollisionType.CollisionExit:
                contactFunc = 'onCollisionExit';
                break;
        }

        let collider1 = contact.collider1;
        let collider2 = contact.collider2;

        let comps1 = collider1.node._components;
        let comps2 = collider2.node._components;

        let i, l, comp;
        for (i = 0, l = comps1.length; i < l; i++) {
            comp = comps1[i];
            if (comp[contactFunc]) {
                comp[contactFunc](collider2, collider1);
            }
        }

        for (i = 0, l = comps2.length; i < l; i++) {
            comp = comps2[i];
            if (comp[contactFunc]) {
                comp[contactFunc](collider1, collider2);
            }
        }
    }

    shouldCollide(c1: cc.Collider, c2: cc.Collider) {
        let node1 = c1.node, node2 = c2.node;
        let collisionMatrix = cc.game["collisionMatrix"];
        return node1 !== node2 && collisionMatrix[node1.groupIndex][node2.groupIndex];
    }

    update(dt) {
        if (!this.enabled) {
            return;
        }
        
        let i, l;

        // update collider
        let colliders = this._colliders;
        for (i = 0, l = colliders.length; i < l; ++i) {
            this.updateCollider(colliders[i]);
            colliders[i]["bounds"] = colliders[i].node.getBoundingBoxToWorld();
        }

        this._qt.clear();
        for (i = 0, l = colliders.length; i < l; ++i) {
            this._qt.insert(colliders[i]);
        }

        let contacts: QContact[] = [];
        let mapI2C = this._mapI2C;
        let cid1, cid2;
        for (i = 0, l = colliders.length; i < l; ++i) {
            let c = colliders[i];
            let objs = this._qt.retrieve(c["bounds"]);
            cid1 = c["cid"];
            for (let j = 0, l2 = objs.length; j < l2; ++j) {
                cid2 = objs[j]["cid"];
                if (cid1 === cid2 || !mapI2C[cid1][cid2]) continue;
                contacts.push(mapI2C[cid1][cid2]);
            }
            
            if (c["objs"]) {
                c["objs"].forEach((v, idx) => {
                    let ret = objs.indexOf(v);
                    if (ret == -1) {
                        if (mapI2C[cid1][v["cid"]]) contacts.push(mapI2C[cid1][v["cid"]]);
                    }
                });
            }
            c["objs"] = objs;
        }
        
        // do collide
        let results = [];
        for (i = 0, l = contacts.length; i < l; i++) {
            let collisionType = contacts[i].updateState();
            if (collisionType === CollisionType.None) {
                continue;
            }

            results.push([collisionType, contacts[i]]);
        }
        
        // handle collide results, emit message
        for (i = 0, l = results.length; i < l; i++) {
            let result = results[i];
            this._doCollide(result[0], result[1]);
        }

        // draw colliders
        if (this.enabledDebugDraw) cc.director.getCollisionManager()["drawColliders"]();
    }
}
