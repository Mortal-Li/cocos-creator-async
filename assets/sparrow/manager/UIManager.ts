/**
 * 管理所有UI
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import ceo from "../ceo";
import CocosHelper from "../tools/CocosHelper";
import LayerBase from "../ui/LayerBase";
import PopupBase from "../ui/PopupBase";
import UIBase from "../ui/UIBase";
import { IUIConfig, LAYER_PATH, PANEL_PATH, POPUP_PATH, WIDGET_PATH } from "../ui/UIConfig";



export default class UIManager {
    
    // ********************* Layer *********************
    private _curLayerConf : IUIConfig;

    getCurBundleName() {
        return this._curLayerConf.bundle;
    }

    async gotoLayer(conf: IUIConfig, data?: any) {
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
        let prefab = await CocosHelper.asyncLoadPrefab(bundle, LAYER_PATH + conf.name);
        
        let layer = cc.instantiate(prefab);
        let scpt: LayerBase = layer.getComponent(conf.name);
        scpt.recvData = data;
        
        layer.parent = ceo.godNode;
        cc.log("create Layer", conf.name);

        T.exchangeLayer(conf);
    }

    private exchangeLayer(conf: IUIConfig) {
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

    async preLoadLayer(conf: IUIConfig, onCompleted?: (error?: Error) => void) {
        let T = this;
        
        let bundle = await T.getBundle(conf.bundle);
        bundle.preload(LAYER_PATH + conf.name, cc.Prefab, (err: Error)=>{
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


    // ********************* Popup *********************
    /**
     * 可返回弹窗界面中用户设置的数据
     */
     async showPopup(conf: IUIConfig, data?: any) {
        let popup = await CocosHelper.createPrefabs(POPUP_PATH + conf.name, conf.bundle);
        popup.zIndex = 99;
        let scpt: PopupBase = popup.getComponent(conf.name);
        scpt.recvData = data;

        popup.parent = ceo.godNode.getChildByName(this._curLayerConf.name);
        cc.log("show Popup", conf.name);

        return await new Promise<any>((resolve, reject) => {
            scpt.onDestroyCall = resolve;
        });
    }


    // ********************* Panel *********************
    async createPanel(conf: IUIConfig, data?: any) {
        let panel = await CocosHelper.createPrefabs(PANEL_PATH + conf.name, conf.bundle);
        let scpt: UIBase = panel.getComponent(conf.name);
        scpt.recvData = data;
        return panel;
    }


    // ********************* Widget *********************
    async createWidget(conf: IUIConfig) {
        return await CocosHelper.createPrefabs(WIDGET_PATH + conf.name, conf.bundle);
    }
}
