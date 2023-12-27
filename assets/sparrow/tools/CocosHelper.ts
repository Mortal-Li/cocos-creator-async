/**
 * 对cocos api的一些功能性封装
 * @author Mortal-Li
 * @created 2021年9月2日
 */


export default class CocosHelper {
    
    static asynSleep = function(t: number, target: cc.Component = null) {
        return new Promise((resolve, reject) => {
            if (!target) target = cc.Canvas.instance;
            target.scheduleOnce(() => {
                resolve(null);
            }, t);
        });
    }

    static asyncTween<T>(node: T, tween: cc.Tween<T>) {
        return new Promise((resolve) => {
            cc.tween(node).then(tween).call(resolve).start();
        })
    }

    static preload(bundle: cc.AssetManager.Bundle, dirPath: string, type: typeof cc.Asset, onProgress?: Function) {
        return new Promise<void>((resolve, reject) => {
            bundle.preload(dirPath, type, (cur, total, itm) => {
                if (onProgress) onProgress(cur / total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    static preloadDir(bundle: cc.AssetManager.Bundle, dirPath: string, onProgress?: Function) {
        return new Promise<void>((resolve, reject) => {
            bundle.preloadDir(dirPath, (cur, total, itm) => {
                if (onProgress) onProgress(cur / total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    static asyncLoadBundle(bundleName: string) {
        return new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
            cc.assetManager.loadBundle(bundleName, (error: Error, bundle: cc.AssetManager.Bundle) => {
                error ? reject(error) : resolve(bundle);
            });
        });
    }

    static asyncLoadPrefab(bundle: cc.AssetManager.Bundle, prefabPath: string) {
        return new Promise<cc.Prefab>((resolve, reject) => {
            bundle.load(prefabPath, cc.Prefab, (err: Error, prefab: cc.Prefab) => {
                err ? reject(err) : resolve(prefab);
            });
        });
    }

    static asyncLoadSpriteFrame(pathStr: string, bundle: cc.AssetManager.Bundle) {
        return new Promise<cc.SpriteFrame>((resolve, reject) => {
            bundle.load(pathStr, cc.SpriteFrame, (err: Error, frame: cc.SpriteFrame) => {
                err ? reject(err) : resolve(frame);
            });
        });
    }

    static async getBundle(bundleName: string, needLoad: boolean = true) {
        let bundle = cc.assetManager.getBundle(bundleName);
        if (!bundle && needLoad) {
            cc.log("load bundle", bundleName);
            return await CocosHelper.asyncLoadBundle(bundleName);
        }
        return bundle;
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

    static getGrayBg() {
        let ttx = new cc.Texture2D();
        ttx.initWithData(new Uint8Array([0, 0, 0]), cc.Texture2D.PixelFormat.RGB888, 1, 1);

        let sprFrm = new cc.SpriteFrame();
        sprFrm.setTexture(ttx);
        sprFrm.setRect(cc.rect(0, 0, cc.winSize.width, cc.winSize.height));

        let grayBg = new cc.Node("gray");
        grayBg.opacity = 200;
        grayBg.addComponent(cc.Sprite).spriteFrame = sprFrm;

        return grayBg;
    }
}

