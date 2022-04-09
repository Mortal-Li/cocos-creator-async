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

export class Quadtree {

    max_objects: number = 10;
    max_levels: number = 4;
    level: number = 0;
    bounds: QTBounds = null;

    objects: any[] = [];
    nodes: Quadtree[] = [];
    
    constructor(bounds: QTBounds, max_objects?: number, max_levels?: number, level?: number) {
        this.bounds = bounds;
        if (max_objects) this.max_objects;
        if (max_levels) this.max_levels = max_levels;
        if (level) this.level = level;
    }

    /**
     * Split the node into 4 subnodes
     */
    split() {
        let nextLevel = this.level + 1,
            subWidth = this.bounds.width / 2,
            subHeight = this.bounds.height / 2,
            x = this.bounds.x,
            y = this.bounds.y;

        //top right node
        this.nodes[0] = new Quadtree({
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //top left node
        this.nodes[1] = new Quadtree({
            x: x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //bottom left node
        this.nodes[2] = new Quadtree({
            x: x,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);

        //bottom right node
        this.nodes[3] = new Quadtree({
            x: x + subWidth,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
    }

    /**
     * Determine which node the object belongs to
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
     * Insert the object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     */
    insert(qtObj: any) {
        let i = 0,
            indexes: number[];

        //if we have subnodes, call insert on matching subnodes
        if (this.nodes.length) {
            indexes = this.getIndex(qtObj.bounds);

            for (i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insert(qtObj);
            }
            return;
        }

        //otherwise, store object here
        qtObj.qts.push(this);
        this.objects.push(qtObj);

        //max_objects reached
        if (this.objects.length > this.max_objects && this.level < this.max_levels) {

            //split if we don't already have subnodes
            if (!this.nodes.length) {
                this.split();
            }

            //add all objects to their corresponding subnode
            for (i = 0; i < this.objects.length; i++) {
                let one = this.objects[i];
                one.qts.slice(one.qts.indexOf(this), 1);

                indexes = this.getIndex(one.bounds);
                for (let k = 0; k < indexes.length; k++) {
                    this.nodes[indexes[k]].insert(one);
                }
            }

            //clean up this node
            this.objects = [];
        }
    }

    /**
     * Return all objects that could collide with the given object
     */
    retrieve(qtObj: any) :any[] {
        let returnObjects = [];
        qtObj.qts.forEach((qt: Quadtree, idx) => {
            returnObjects = returnObjects.concat(qt.objects);
        });

        //remove duplicates
        returnObjects = returnObjects.filter(function (item, index) {
            return returnObjects.indexOf(item) >= index;
        });

        return returnObjects;
    }


    /**
     * Clear the quadtree
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
