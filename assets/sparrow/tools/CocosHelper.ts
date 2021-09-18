/**
 * 对cocos api的一些功能性封装
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import ceo from "../ceo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CocosHelper {
    
    static asynSleep = function(t: number) {
        return new Promise((resolve, reject) => {
            cc.Canvas.instance.scheduleOnce(() => {
                resolve(null);
            }, t);
        });
    }

    static asyncTween<T>(node: T, tween: cc.Tween<T>) {
        return new Promise((resolve) => {
            cc.tween(node).then(tween).call(resolve).start();
        })
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
    
    static async createPrefabs(prefabPath: string, bundleName?: string) {
        let bundle = cc.assetManager.getBundle(bundleName ? bundleName : ceo.uiMgr.getCurBundleName());
        if (!bundle) {
            cc.warn("Bundle Miss!");
            return ;
        }
        const prefab = await CocosHelper.asyncLoadPrefab(bundle, prefabPath);
        return cc.instantiate(prefab);
    }

}

