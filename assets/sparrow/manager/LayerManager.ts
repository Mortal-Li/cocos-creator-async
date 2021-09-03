/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import ceo from "../ceo";
import CocosHelper from "../tools/CocosHelper";
import LayerBase from "../ui/LayerBase";
import { PRE_PATH, UIConfigInterface } from "../ui/UIConfig";

export default class LayerManager {
    
    private _curLayerConf : UIConfigInterface;

    getCurLayerName(): string {
        return this._curLayerConf.name;
    }

    getCurLayer() {
        return ceo.godNode.getChildByName(this._curLayerConf.name);
    }

    getCurBundle() {
        return this._curLayerConf.bundle;
    }

    async gotoLayer(conf: UIConfigInterface, data?: any) {
        let T = this;

        if (conf.stay) {
            let layer = ceo.godNode.getChildByName(conf.name);
            if (layer) {
                layer.active = true;
                let scpt: LayerBase = layer.getComponent(conf.name);
                scpt.recvData = data;
                scpt.refresh();
                T.exchangeLayer(conf);
                cc.log("show Layer", conf.name);
                return ;
            }
        }

        let bundle = await T.getBundle(conf.bundle);
        let prefab = await CocosHelper.asyncLoadPrefab(bundle, PRE_PATH + conf.name);
        
        let layer = cc.instantiate(prefab);
        let scpt: LayerBase = layer.getComponent(conf.name);
        scpt.recvData = data;
        
        layer.parent = ceo.godNode;
        cc.log("create Layer", conf.name);

        T.exchangeLayer(conf);
    }

    private exchangeLayer(conf: UIConfigInterface) {
        let T = this;

        if (T._curLayerConf) {
            let curLayer = ceo.godNode.getChildByName(T._curLayerConf.name);
            if (T._curLayerConf.stay) {
                curLayer.active = false;
                cc.log("hide Layer", T._curLayerConf.name);
            } else {
                curLayer.destroy();
                cc.log("destroy Layer", T._curLayerConf.name);
            }
        }

        T._curLayerConf = conf;
    }

    async preLoadLayer(conf: UIConfigInterface, onCompleted?: (error?: Error) => void) {
        let T = this;
        
        let bundle = await T.getBundle(conf.bundle);
        bundle.preload(PRE_PATH + conf.name, cc.Prefab, (err: Error)=>{
            if (onCompleted) {
                onCompleted(err);
            }
        });
    }

    private async getBundle(bundleName: string) {
        let bundle = cc.assetManager.getBundle(bundleName);
        if (!bundle) {
            cc.log("load bundle", bundleName);
            return await CocosHelper.asyncLoadBundle(bundleName);
        }
        return bundle;
    }

}
