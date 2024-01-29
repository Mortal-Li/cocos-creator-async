/**
 * 图片数字组件，可做滚动动画
 * @author Mortal-Li
 * @created 2024年1月29日
 */

import CocosHelper from "../tools/CocosHelper";

 const {ccclass, property, menu} = cc._decorator;

 @ccclass
 @menu("Tools/SpriteNumber")
export default class SpriteNumber extends cc.Component {

    @property({
        type: cc.Integer,
        tooltip: "数字图片间隔距离"
    })
    private divX: number = 0;

    @property({
        type: cc.Integer,
        tooltip: "小数点或逗号垂直方向偏移"
    })
    private dotOffsetY: number = 0;

    @property({
        type: [cc.SpriteFrame],
        tooltip: "按顺序为0123456789.,+-"
    })
    private numFrms: cc.SpriteFrame[] = [];

    private _v: string = "";
    
    public get value() : string {
        return this._v;
    }
    
    public set value(v: string | number) {
        let T = this;

        let s = String(v);
        T._v = s;

        for (let l = T.node.childrenCount - 1; l >= 0; --l) {
            T.removeOne(T.node.children[l]);
        }

        for (let i = 0; i < s.length; ++i) {
            let spr = T.getOne();
            spr.node.y = 0;
            if (s[i] == '+') {
                spr.spriteFrame = T.numFrms[12];
            } else if (s[i] == '-') {
                spr.spriteFrame = T.numFrms[13];
            } else {
                let isDot = s[i] == '.';
                let isComma = s[i] == ',';
                spr.spriteFrame = isDot ? T.numFrms[10] : (isComma ? T.numFrms[11] : T.numFrms[Number(s[i])]);

                if (isDot || isComma) spr.node.y = T.dotOffsetY;
            }
            spr.node.parent = T.node;
        }
    }

    private ndPool: cc.NodePool = new cc.NodePool();

    private getOne(): cc.Sprite {
        if (this.ndPool.size() == 0) {
            return (new cc.Node()).addComponent(cc.Sprite);
        } else {
            return this.ndPool.get().getComponent(cc.Sprite);
        }
    }

    private removeOne(one: cc.Node) {
        this.ndPool.put(one);
    }

    start() {
        CocosHelper.addLayout(this.node, {
            type: cc.Layout.Type.HORIZONTAL,
            spacingX: this.divX,
        });
    }

    onDestroy() {
        this.ndPool.clear();
        this.ndPool = null;
    }

    /**
     * 数字滚动动画，t 时间内从 from 变化到 to，数字用函数 wrap 修饰
     * @param from 起始数值
     * @param to 最终数值
     * @param wrap 对数字的修饰函数，比如 n => n.toFixed(2)
     * @param t 可选，动画时间，默认1s
     */
    numVarTween(from: number, to: number, wrap: (n: number) => number | string, t: number = 1) {
        let times = Math.round(20 * t);
        let perT = 1 / 20;
        let perNum = (to - from) / times;
        cc.tween(this.node).delay(perT).call(()=>{
            from += perNum;
            this.value = wrap(from);
        }).union().repeat(times).call(() => {
            this.value = wrap(to);
        }).start();
    }
}
