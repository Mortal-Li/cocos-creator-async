/**
 * 
 * @author Mortal-Li
 * @created 2022年3月30日
 */


export const CollisionType = {
    None: 0,
    CollisionEnter: 1,
    CollisionStay: 2,
    CollisionExit: 3
}

export class QContact {

    collider1: any = null;
    collider2: any = null;
    touching: boolean = false;
    testFunc: Function = null;
    
    constructor(collider1: any, collider2: any) {
        this.collider1 = collider1;
        this.collider2 = collider2;

        let isCollider1Polygon = (collider1 instanceof cc.BoxCollider) || (collider1 instanceof cc.PolygonCollider);
        let isCollider2Polygon = (collider2 instanceof cc.BoxCollider) || (collider2 instanceof cc.PolygonCollider);
        let isCollider1Circle = collider1 instanceof cc.CircleCollider;
        let isCollider2Circle = collider2 instanceof cc.CircleCollider;

        if (isCollider1Polygon && isCollider2Polygon) {
            this.testFunc = cc.Intersection.polygonPolygon;
        }
        else if (isCollider1Circle && isCollider2Circle) {
            this.testFunc = cc.Intersection.circleCircle;
        }
        else if (isCollider1Polygon && isCollider2Circle) {
            this.testFunc = cc.Intersection.polygonCircle;
        }
        else if (isCollider1Circle && isCollider2Polygon) {
            this.testFunc = cc.Intersection.polygonCircle;
            this.collider1 = collider2;
            this.collider2 = collider1;
        }
        else {
            cc.error("Invalid Collider")
        }
    }

    test() {
        let world1 = this.collider1.world;
        let world2 = this.collider2.world;

        if (!world1.aabb.intersects(world2.aabb)) {
            return false;
        }

        if (this.testFunc === cc.Intersection.polygonPolygon) {
            return this.testFunc(world1.points, world2.points);
        }
        else if (this.testFunc === cc.Intersection.circleCircle) {
            return this.testFunc(world1, world2);
        }
        else if (this.testFunc === cc.Intersection.polygonCircle) {
            return this.testFunc(world1.points, world2);
        }

        return false;
    }

    updateState() {
        let result = this.test();

        let type = CollisionType.None;
        if (result && !this.touching) {
            this.touching = true;
            type = CollisionType.CollisionEnter;
        }
        else if (result && this.touching) {
            type = CollisionType.CollisionStay;
        }
        else if (!result && this.touching) {
            this.touching = false;
            type = CollisionType.CollisionExit;
        }

        return type;
    }
}
