/**
 * 一些异步方法
 * @author Mortal-Li
 * @created 2023年12月29日
 */


export default class AsyncHelper {
    
    /**
     * 异步等待，示例：等待1秒 await AsyncHelper.sleepAsync(1)
     * @param t 等待时间，秒
     * @param target 可选，利用target的scheduleOnce方法实现等待，默认为UI根节点的画布组件
     */
    static sleepAsync(t: number, target?: cc.Component) {
        return new Promise((resolve, reject) => {
            if (!target) target = cc.Canvas.instance;
            target.scheduleOnce(() => {
                resolve(null);
            }, t);
        });
    }

    /**
     * 异步Tween动画，示例：await AsyncHelper.tweenAsync(node, cc.tween().to(1, { x: 100 }))
     * @param target 动画执行目标
     * @param tween 非永久循环动画
     */
    static tweenAsync<T>(target: T, tween: cc.Tween<T>) {
        return new Promise((resolve) => {
            cc.tween(target).then(tween).call(resolve).start();
        })
    }

    /**
     * 异步加载Bundle
     */
    static loadBundleAsync(bundleName: string) {
        return new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
            cc.assetManager.loadBundle(bundleName, (error: Error, bundle: cc.AssetManager.Bundle) => {
                cc.log("load bundle", bundleName);
                error ? reject(error) : resolve(bundle);
            });
        });
    }

    /**
     * 异步预加载Bundle中指定的单个资源
     */
    static preloadAsync(bundle: cc.AssetManager.Bundle, path: string, type: typeof cc.Asset, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<void>((resolve, reject) => {
            // 预加载的资源的不会出现在cc.assetManager.assets中
            bundle.preload(path, type, (cur, total, itm) => {
                if (onProgress) onProgress(cur, total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    /**
     * 异步预加载Bundle中指定文件夹中的所有资源
     */
    static preloadDirAsync(bundle: cc.AssetManager.Bundle, path: string, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<void>((resolve, reject) => {
            bundle.preloadDir(path, (cur, total, itm) => {
                if (onProgress) onProgress(cur, total);
            }, (err, res) => {
                err ? reject(err) : resolve()
            });
        });
    }

    /**
     * 异步加载Bundle中指定的单个资源
     */
    static loadAsync<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, path: string, type: typeof cc.Asset, onProgress?: (cur: number, total: number)=> void) {
        return new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (cur, total, item) => {
                if (onProgress) onProgress(cur, total);
            }, (err: Error, asset: T) => {
                err ? reject(err) : resolve(asset);
            });
        });
    }

    /**
     * 异步分帧执行，将原本一帧内耗时较长的逻辑，放到多帧执行
     * @param logicGen 逻辑生成器函数
     * @param t 每帧执行时间，单位毫秒ms
     * @param target 可选，利用target的scheduleOnce方法实现跳帧，默认为UI根节点的画布组件
     */
    static execPerFrameAsync(logicGen: Generator, t: number, target?: cc.Component) {
        if (!target) target = cc.Canvas.instance;
        return new Promise<void>((resolve, reject) => {
			let exec = () => {
				let startTime = Date.now();
				for (let iter = logicGen.next(); ; iter = logicGen.next()) {
					if (!iter || iter.done) {
						resolve();
						return;
					}

					if (Date.now() - startTime > t) {
						target.scheduleOnce(() => {
							exec();
						});
						return;
					}
				}
			};
			exec();
		});
    }
    
}
