/**
 * 对cocos api的一些功能性封装
 * @author Mortal-Li
 * @created 2021年9月2日
 */


export default class CocosHelper {

    static addSprite(nd: cc.Node, options: {
        spriteFrame: cc.SpriteFrame;
        /**
         * 默认值 cc.Sprite.Type.SIMPLE
         */
        type?: cc.Sprite.Type;
        /**
         * 默认值 cc.Sprite.SizeMode.TRIMMED
         */
        sizeMode?: cc.Sprite.SizeMode;
        /**
         * 默认值 true
         */
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
        /**
         * 默认值 40
         */
        fontSize?: number;
        /**
         * 默认值 cc.Color.WHITE
         */
        color?: cc.Color;
        /**
         * 默认值 等于fontSize
         */
        lineHeight?: number;
        /**
         * 默认值 cc.Label.HorizontalAlign.CENTER
         */
        horizontalAlign?: cc.Label.HorizontalAlign;
        /**
         * 默认值 cc.Label.VerticalAlign.CENTER
         */
        verticalAlign?: cc.Label.VerticalAlign;
        /**
         * 默认值 cc.Label.Overflow.NONE
         */
        overflow?: cc.Label.Overflow;
        /**
         * 默认值 cc.Label.CacheMode.NONE
         */
        cacheMode?: cc.Label.CacheMode;
        enableBold?: boolean;
        enableItalic?: boolean;
        enableUnderline?: boolean;
        /**
         * 默认值 false
         */
        enableWrapText?: boolean;
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

    static addLayout(nd: cc.Node, options: {
        type: cc.Layout.Type;
        /**
         * 默认值 cc.Layout.ResizeMode.CONTAINER
         */
        resizeMode?: cc.Layout.ResizeMode;
        /**
         * 默认值 false
         */
        affectedByScale?: boolean;
        width?: number;
        height?: number;
        spacingX?: number;
        paddingLeft?: number;
        paddingRight?: number;
        /**
         * 默认值 cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
         */
        horizontalDirection?: cc.Layout.HorizontalDirection;
        spacingY?: number;
        paddingTop?: number;
        paddingBottom?: number;
        /**
         * 默认值 cc.Layout.VerticalDirection.TOP_TO_BOTTOM
         */
        verticalDirection?: cc.Layout.VerticalDirection;
        /**
         * 默认值 cc.Layout.AxisDirection.HORIZONTAL
         */
        startAxis?: cc.Layout.AxisDirection;
    }) {
        if (!nd) return;

        if (typeof options.resizeMode !== "number") options.resizeMode = cc.Layout.ResizeMode.CONTAINER;

        if (options.width) nd.width = options.width;
        if (options.height) nd.height = options.height;

        let lo = nd.addComponent(cc.Layout);
        lo.type = options.type;
        lo.resizeMode = options.resizeMode;
        lo.affectedByScale = !!options.affectedByScale;

        if (lo.type == cc.Layout.Type.HORIZONTAL) {
            lo.horizontalDirection = (typeof options.horizontalDirection === "number") ? options.horizontalDirection : cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            lo.spacingX = options.spacingX ? options.spacingX : 0;
            lo.paddingLeft = options.paddingLeft ? options.paddingLeft : 0;
            lo.paddingRight = options.paddingRight ? options.paddingRight : 0;
        } else if (lo.type == cc.Layout.Type.VERTICAL) {
            lo.verticalDirection = (typeof options.verticalDirection === "number") ? options.verticalDirection : cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
            lo.spacingY = options.spacingY ? options.spacingY : 0;
            lo.paddingTop = options.paddingTop ? options.paddingTop : 0;
            lo.paddingBottom = options.paddingBottom ? options.paddingBottom : 0;
        } else if (lo.type == cc.Layout.Type.GRID) {
            lo.startAxis = (typeof options.startAxis === "number") ? options.startAxis : cc.Layout.AxisDirection.HORIZONTAL;
            lo.horizontalDirection = (typeof options.horizontalDirection === "number") ? options.horizontalDirection : cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            lo.verticalDirection = (typeof options.verticalDirection === "number") ? options.verticalDirection : cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
            lo.spacingX = options.spacingX ? options.spacingX : 0;
            lo.paddingLeft = options.paddingLeft ? options.paddingLeft : 0;
            lo.paddingRight = options.paddingRight ? options.paddingRight : 0;
            lo.spacingY = options.spacingY ? options.spacingY : 0;
            lo.paddingTop = options.paddingTop ? options.paddingTop : 0;
            lo.paddingBottom = options.paddingBottom ? options.paddingBottom : 0;
        }

        return lo;
    }

    /**
     * 递归置灰或还原节点
     */
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

    /**
     * 生成一张纯色的图片帧，默认黑色
     * @param color 图片的颜色
     */
    static genPureColorSpriteFrame(color: cc.Color = cc.Color.BLACK) {
        let ttx = new cc.Texture2D();
        ttx.initWithData(new Uint8Array([color.r, color.g, color.b]), cc.Texture2D.PixelFormat.RGB888, 1, 1);

        let sprFrm = new cc.SpriteFrame();
        sprFrm.setTexture(ttx);
        sprFrm.setRect(cc.rect(0, 0, 8, 8));

        return sprFrm;
    }

}

