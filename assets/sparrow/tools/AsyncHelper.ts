/**
 * 一些异步方法
 * @author Mortal-Li
 * @created 2023年12月29日
 */


export default class AsyncHelper {
    
    static sleepAsync(t: number, target: cc.Component = null) {
        return new Promise((resolve, reject) => {
            if (!target) target = cc.Canvas.instance;
            target.scheduleOnce(() => {
                resolve(null);
            }, t);
        });
    }

    static tweenAsync<T>(target: T, tween: cc.Tween<T>) {
        return new Promise((resolve) => {
            cc.tween(target).then(tween).call(resolve).start();
        })
    }

    static loadBundleAsync(bundleName: string) {
        return new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
            cc.assetManager.loadBundle(bundleName, (error: Error, bundle: cc.AssetManager.Bundle) => {
                cc.log("load bundle", bundleName);
                error ? reject(error) : resolve(bundle);
            });
        });
    }

    static preloadAsync(bundle: cc.AssetManager.Bundle, path: string, type: typeof cc.Asset, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<void>((resolve, reject) => {
            bundle.preload(path, type, (cur, total, itm) => {
                if (onProgress) onProgress(cur, total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    static preloadDirAsync(bundle: cc.AssetManager.Bundle, path: string, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<void>((resolve, reject) => {
            bundle.preloadDir(path, (cur, total, itm) => {
                if (onProgress) onProgress(cur, total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    static loadAsync<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, path: string, type: typeof cc.Asset, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (cur, total, item) => {
                if (onProgress) onProgress(cur, total);
            }, (err: Error, asset: T) => {
                err ? reject(err) : resolve(asset);
            });
        });
    }

}
