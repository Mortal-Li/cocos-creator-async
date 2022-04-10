/**
 * 四叉树
 * @author Mortal-Li
 * @created 2022年3月30日
 */

export interface QTBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface QTObject {
    /**
     * 唯一标志
     */
    cid: number;

    /**
     * 碰撞结点当前包围盒
     */
    bounds: QTBounds;
    
    /**
     * 当前碰撞结点所在四叉树结点集合
     */
    qts: Quadtree[];

    /**
     * 当前可能会和自己产生碰撞的结点集合
     */
    objs?: QTObject[];
}

export class Quadtree {

    max_objects: number = 10;
    max_levels: number = 4;
    level: number = 0;
    bounds: QTBounds = null;

    objects: QTObject[] = [];
    nodes: Quadtree[] = [];
    
    constructor(bounds: QTBounds, max_objects?: number, max_levels?: number, level?: number) {
        this.bounds = bounds;
        if (max_objects) this.max_objects;
        if (max_levels) this.max_levels = max_levels;
        if (level) this.level = level;
    }

    /**
     * 生成子树
     */
    split() {
        let nextLevel = this.level + 1,
            subWidth = this.bounds.width / 2,
            subHeight = this.bounds.height / 2,
            x = this.bounds.x,
            y = this.bounds.y;

        //top right
        this.nodes[0] = new Quadtree({
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //top left
        this.nodes[1] = new Quadtree({
            x: x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //bottom left
        this.nodes[2] = new Quadtree({
            x: x,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //bottom right
        this.nodes[3] = new Quadtree({
            x: x + subWidth,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
    }

    /**
     * 查找归属哪些象限
     */
    getIndex(bounds: QTBounds) :number[] {
        let indexes: number[] = [],
            verticalMidpoint = this.bounds.x + (this.bounds.width / 2),
            horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);

        let startIsNorth = bounds.y + bounds.height > horizontalMidpoint,
            startIsWest = bounds.x < verticalMidpoint,
            endIsEast = bounds.x + bounds.width > verticalMidpoint,
            endIsSouth = bounds.y < horizontalMidpoint;

        //top-right quad
        if (startIsNorth && endIsEast) {
            indexes.push(0);
        }

        //top-left quad
        if (startIsWest && startIsNorth) {
            indexes.push(1);
        }

        //bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.push(2);
        }

        //bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.push(3);
        }

        return indexes;
    }

    /**
     * 插入碰撞结点到四叉树中
     */
    insert(qtObj: QTObject) {
        let i = 0,
            indexes: number[];

        if (this.nodes.length) {
            indexes = this.getIndex(qtObj.bounds);

            for (i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insert(qtObj);
            }
            return;
        }

        qtObj.qts.push(this);
        this.objects.push(qtObj);

        // 如果当前结点需要分裂
        if (this.objects.length > this.max_objects && this.level < this.max_levels) {

            if (!this.nodes.length) {
                this.split();
            }

            for (i = 0; i < this.objects.length; i++) {
                let one = this.objects[i];
                one.qts.slice(one.qts.indexOf(this), 1);

                indexes = this.getIndex(one.bounds);
                for (let k = 0; k < indexes.length; k++) {
                    this.nodes[indexes[k]].insert(one);
                }
            }
            
            this.objects = [];
        }
    }

    /**
     * 获取所有可能产生碰撞的对象
     */
    retrieve(qtObj: QTObject) :QTObject[] {
        let returnObjects: QTObject[] = [];
        qtObj.qts.forEach((qt: Quadtree, idx) => {
            returnObjects = returnObjects.concat(qt.objects);
        });

        // 去重
        returnObjects = returnObjects.filter(function (item, index) {
            return returnObjects.indexOf(item) >= index;
        });

        return returnObjects;
    }

    /**
     * 清空四叉树
     */
    clear() {
        this.objects.forEach((qtObj, idx) => {
            qtObj.qts = [];
        })
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes.length) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    };
}
