/**
 * 对cocos api的一些功能性封装
 * @author Mortal-Li
 * @created 2021年9月2日
 */


export default class CocosHelper {

    static addSprite(nd: cc.Node, options: {
        spriteFrame: cc.SpriteFrame;
        type?: cc.Sprite.Type;
        sizeMode?: cc.Sprite.SizeMode;
        trim?: boolean;
    }) {
        if (!nd) return;

        if (typeof options.type !== "number") options.type = cc.Sprite.Type.SIMPLE;
        if (typeof options.sizeMode !== "number") options.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        if (typeof options.trim !== "boolean") options.trim = true;

        let spr = nd.addComponent(cc.Sprite);
        spr.spriteFrame = options.spriteFrame;
        spr.type = options.type;
        spr.sizeMode = options.sizeMode;
        spr.trim = options.trim;

        return spr;
    }
    
    static addLabel(nd: cc.Node, options: {
        string: string;
        fontSize?: number;
        color?: cc.Color;
        lineHeight?: number;
        horizontalAlign?: cc.Label.HorizontalAlign;
        verticalAlign?: cc.Label.VerticalAlign;
        overflow?: cc.Label.Overflow;
        enableBold?: boolean;
        enableItalic?: boolean;
        enableUnderline?: boolean;
        enableWrapText?: boolean;
        cacheMode?: cc.Label.CacheMode;
    }) {
        if (!nd) return;

        if (!options.fontSize) options.fontSize = 40;
        if (!options.color) options.color = cc.Color.WHITE;
        if (!options.lineHeight) options.lineHeight = options.fontSize;
        if (typeof options.horizontalAlign !== "number") options.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        if (typeof options.verticalAlign !== "number") options.verticalAlign = cc.Label.VerticalAlign.CENTER;
        if (typeof options.overflow !== "number") options.overflow = cc.Label.Overflow.NONE;
        if (typeof options.cacheMode !== "number") options.cacheMode = cc.Label.CacheMode.NONE;

        let lbl = nd.addComponent(cc.Label);
        lbl.string = options.string;
        lbl.fontSize = options.fontSize;
        lbl.lineHeight = options.lineHeight;
        lbl.horizontalAlign = options.horizontalAlign;
        lbl.verticalAlign = options.verticalAlign;
        lbl.overflow = options.overflow;
        lbl.enableBold = !!options.enableBold;
        lbl.enableItalic = !!options.enableItalic;
        lbl.enableUnderline = !!options.enableUnderline;
        lbl.enableWrapText = !!options.enableWrapText;
        lbl.cacheMode = options.cacheMode;
        nd.color = options.color;

        return lbl;
    }

    static addWidget(nd: cc.Node, paddings: { left?: number; right?: number; top?: number, bottom?: number}) {
        if (!nd) return;

        let wgt = nd.addComponent(cc.Widget);

        if (typeof paddings.left === "number") {
            wgt.isAlignLeft = true;
            wgt.left = paddings.left;
        }

        if (typeof paddings.right === "number") {
            wgt.isAlignRight = true;
            wgt.right = paddings.right;
        }

        if (typeof paddings.top === "number") {
            wgt.isAlignTop = true;
            wgt.top = paddings.top;
        }

        if (typeof paddings.bottom === "number") {
            wgt.isAlignBottom = true;
            wgt.bottom = paddings.bottom;
        }

        return wgt;
    }

    static grayNode(node: cc.Node, isGray: boolean = true) {
        if (node.getComponent(cc.Sprite)) {
            node.getComponent(cc.Sprite).setMaterial(0, cc.Material.getBuiltinMaterial(isGray ? "2d-gray-sprite" : "2d-sprite"));
        } else if (node.getComponent(cc.Label)) {
            node.getComponent(cc.Label).setMaterial(0, cc.Material.getBuiltinMaterial(isGray ? "2d-gray-sprite" : "2d-sprite"));
        }

        for (let i = node.children.length - 1; i >= 0; --i ) {
            CocosHelper.grayNode(node.children[i], isGray);
        }
    }

    static genDarkSpriteFrame() {
        let ttx = new cc.Texture2D();
        ttx.initWithData(new Uint8Array([0, 0, 0]), cc.Texture2D.PixelFormat.RGB888, 1, 1);

        let sprFrm = new cc.SpriteFrame();
        sprFrm.setTexture(ttx);
        sprFrm.setRect(cc.rect(0, 0, 8, 8));

        return sprFrm;
    }

}

