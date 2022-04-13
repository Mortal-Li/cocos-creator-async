/**
 * 基于四叉树的碰撞检测管理器，对于动态结点的碰撞检测效果也有很大提升
 * 使用方式和引擎自带的碰撞管理器一样
 * 1、先打开项目设置面板，(项目 -> 项目设置...)，在分组管理中添加分组并设置哪些组可以产生碰撞;
 * 2、给碰撞节点添加对应的碰撞组件，如 QCircleCollider、QBox;
 * 3、开启碰撞并初始化：ceo.qCollisionMgr.enabled = true; ceo.qCollisionMgr.resetQt(...);
 * 4、碰撞回调函数和引擎自带的也一样, onCollisionEnter、onCollisionStay、onCollisionExit
 * 
 * simple 模式：调用resetQt函数，第二个参数传入true，表示碰撞回调使用简单模式，只会产生onCollisionHappened一个回调，提高一点性能
 * @author Mortal-Li
 * @created 2022年3月30日
 */

import { CollisionType, QContact } from "../tools/QContact";
import { QTBounds, QTObject, Quadtree } from "../tools/Quadtree";

let _gIdx = 0;

export default class QCollisionManager {
    
    enabled: boolean = false;
    private simple: boolean = false;

    private _qt: Quadtree = null;
    private _colliders: QTObject[] = [];
    private _mapI2C: QContact[][] = [];

    shouldCollide: Function = null;
    updateCollider: Function = null;
    initCollider: Function = null;

    constructor() {
        let mgr = cc.director.getCollisionManager();
        this.shouldCollide = mgr["shouldCollide"];
        this.initCollider = mgr["initCollider"];
        this.updateCollider = mgr["updateCollider"];

        // register id, set update
        cc.director.getScheduler().enableForTarget(this);
        cc.director.getScheduler().scheduleUpdate(this, cc.Scheduler.PRIORITY_SYSTEM, false);
    }

    resetQt(bounds: QTBounds, simple: boolean = false) {
        if (this._qt) {
            this._qt.clear();
            this._qt = null;
        }
        this.simple = simple;
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

    addCollider(collider: QTObject) {
        let colliders = this._colliders;
        let index = colliders.indexOf(collider);
        if (index === -1) {
            collider.cid = ++_gIdx;
            this._mapI2C[_gIdx] = [];
            for (let i = 0, l = colliders.length; i < l; i++) {
                let other = colliders[i];
                if (this.shouldCollide(collider, other)) {
                    this._mapI2C[_gIdx][other.cid] = new QContact(collider, other, this.simple);
                }
            }

            colliders.push(collider);
            this.initCollider(collider);
        }

        collider["node"].on(cc.Node.EventType.GROUP_CHANGED, this.onNodeGroupChanged, this);
    }

    removeCollider(collider: QTObject) {
        let colliders = this._colliders;
        let index = colliders.indexOf(collider);
        if (index >= 0) {
            colliders.splice(index, 1);
            collider.qts = [];

            let cid = collider.cid;
            for (let i = cid - 1; i > 1; --i) {
                let contact = this._mapI2C[cid][i];
                if (contact) {
                    if (!this.simple && contact.touching) {
                        this._doCollide(CollisionType.CollisionExit, contact);
                    }
                    this._mapI2C[cid][i] = null;
                }
            }

            if (colliders.length == 0) _gIdx = 0;
            collider["node"].off(cc.Node.EventType.GROUP_CHANGED, this.onNodeGroupChanged, this);
        }
        else {
            cc.warn("Not Found ", collider.cid);
        }
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
            colliders[i].bounds = colliders[i]["node"].getBoundingBoxToWorld();
        }

        // update quadtree
        this._qt.clear();
        for (i = 0, l = colliders.length; i < l; ++i) {
            this._qt.insert(colliders[i]);
        }

        // get contacts
        let contacts: QContact[] = [];
        let mapI2C = this._mapI2C;
        let cid1, cid2;
        for (i = 0, l = colliders.length; i < l; ++i) {
            let c = colliders[i];
            
            let retObjs: QTObject[] = [];
            c.qts.forEach((qt: Quadtree, idx) => {
                retObjs = retObjs.concat(qt.objects);
            });

            // 去重
            retObjs = retObjs.filter(function (item, index) {
                return retObjs.indexOf(item) >= index;
            });

            cid1 = c.cid;
            for (let j = 0, l2 = retObjs.length; j < l2; ++j) {
                cid2 = retObjs[j].cid;
                if (!mapI2C[cid1][cid2]) continue;
                contacts.push(mapI2C[cid1][cid2]);
            }
            
            if (!this.simple) {
                c.objs.forEach((v, idx) => {
                    let ret = retObjs.indexOf(v);
                    if (ret == -1) {
                        if (mapI2C[cid1][v.cid]) contacts.push(mapI2C[cid1][v.cid]);
                    }
                });
                c.objs = retObjs;
            }

        }
        
        // do collide
        let results = [];
        for (i = 0, l = contacts.length; i < l; ++i) {
            let collisionType = contacts[i].updateState();
            if (collisionType === CollisionType.None) {
                continue;
            }

            results.push([collisionType, contacts[i]]);
        }
        
        // handle collide results, emit message
        for (i = 0, l = results.length; i < l; ++i) {
            let result = results[i];
            this._doCollide(result[0], result[1]);
        }
        
    }

    _doCollide(collisionType, contact) {
        let contactFunc;
        switch (collisionType) {
            case CollisionType.CollisionHappened:
                contactFunc = 'onCollisionHappened';
                break;
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
}
