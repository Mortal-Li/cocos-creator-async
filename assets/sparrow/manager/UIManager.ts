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

    async gotoLayer(newConf: IUIConfig, data?: any) {
        let T = this;

        if (newConf.stay) {
            let layer = ceo.godNode.getChildByName(newConf.name);
            if (layer) {
                layer.active = true;
                let scptName = newConf.script ? newConf.script : newConf.name;
                let scpt: LayerBase = layer.getComponent(scptName);
                scpt.recvData = data;
                scpt.refresh();
                cc.log("show Layer", newConf.name);
                T.exchangeLayer(newConf);
                return ;
            }
        }

        let prefab = await CocosHelper.getPrefab(newConf.bundle, LAYER_PATH + newConf.name);
        let layer = cc.instantiate(prefab);
        let scptName = newConf.script ? newConf.script : newConf.name;
        let scpt: LayerBase = layer.getComponent(scptName);
        scpt.pfb = newConf.stay ? null : prefab;
        scpt.recvData = data;
        
        layer.parent = ceo.godNode;
        cc.log("create Layer", newConf.name);

        T.exchangeLayer(newConf);
    }

    private exchangeLayer(newConf: IUIConfig) {
        let T = this;

        let curConf = T._curLayerConf;
        if (curConf) {
            let curLayer = ceo.godNode.getChildByName(curConf.name);
            if (curConf.stay) {
                curLayer.active = false;
                cc.log("hide Layer", curConf.name);
            } else {
                curLayer.destroy();
                cc.log("destroy Layer", curConf.name);
            }
        }

        T._curLayerConf = newConf;
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
        let T = this;

        let zIdx = 99;
        let p = ceo.godNode.getChildByName(T._curLayerConf.name);

        let grayBg = CocosHelper.getGrayBg();
        grayBg.name = "gray" + conf.name;
        grayBg.zIndex = zIdx;
        grayBg.addComponent(cc.BlockInputEvents);
        grayBg.parent = p;

        let prefab = await CocosHelper.getPrefab(conf.bundle, POPUP_PATH + conf.name);
        let popup = cc.instantiate(prefab);
        popup.zIndex = zIdx;
        let scptName = conf.script ? conf.script : conf.name;
        let scpt: PopupBase = popup.getComponent(scptName);
        scpt.pfb = conf.stay ? null : prefab;
        scpt.recvData = data;
        popup.parent = p;
        scpt.showAnim();
        cc.log("show Popup", conf.name);

        return await new Promise<any>((resolve, reject) => {
            scpt.onDestroyCall = resolve;
        });
    }

    removePopup(name: string) {
        let grayBg = ceo.godNode.getChildByName(this._curLayerConf.name).getChildByName("gray" + name);
        grayBg.destroy();
        cc.log("close Popup", name);
    }

    getPopup(popupConf: IUIConfig, layerConf: IUIConfig = null) {
        if (!layerConf) layerConf = this._curLayerConf;
        
        let layer = ceo.godNode.getChildByName(layerConf.name);
        if (layer) {
            return layer.getChildByName(popupConf.name);
        }

        return null;
    }

    // ********************* Panel *********************
    async createPanel(conf: IUIConfig, data?: any) {
        let prefab = await CocosHelper.getPrefab(conf.bundle, PANEL_PATH + conf.name);
        let panel = cc.instantiate(prefab);
        let scptName = conf.script ? conf.script : conf.name;
        let scpt: UIBase = panel.getComponent(scptName);
        scpt.pfb = conf.stay ? null : prefab;
        scpt.recvData = data;
        return panel;
    }


    // ********************* Widget *********************
    async createWidget(conf: IUIConfig) {
        let prefab = await CocosHelper.getPrefab(conf.bundle, WIDGET_PATH + conf.name);
        let wgt = cc.instantiate(prefab);
        let scptName = conf.script ? conf.script : conf.name;
        let scpt: UIBase = wgt.getComponent(scptName);
        scpt.pfb = conf.stay ? null : prefab;
        return wgt;
    }
}
