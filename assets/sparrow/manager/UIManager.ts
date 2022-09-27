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
import { IUIConfig, LAYER_PATH, PANEL_PATH, POPUP_PATH, UICacheMode, WIDGET_PATH } from "../ui/UIConfig";



export default class UIManager {

    // ********************* Layer *********************
    private _curLayerConf : IUIConfig;

    getCurLayerConf() {
        return this._curLayerConf;
    }

    /**
     * 跳转到下一个Layer
     */
    async gotoLayer(newConf: IUIConfig, data?: any) {
        let T = this;

        let preConf = T._curLayerConf;
        if (preConf && preConf.name === newConf.name) {
            T.resetCurLayer(data);
            return ;
        }

        T._curLayerConf = newConf;

        if (newConf.cacheMode == UICacheMode.Stay) {
            let layer = ceo.godNode.getChildByName(newConf.name);
            if (layer) {
                layer.active = true;
                let scptName = newConf.script ? newConf.script : newConf.name;
                let scpt: LayerBase = layer.getComponent(scptName);
                scpt.recvData = data;
                scpt.refresh();
                cc.log("show Layer", newConf.name);
                T.clearLayer(preConf);
                return ;
            }
        }

        let layer = await T._initUIBase(newConf, LAYER_PATH, data);
        layer.parent = ceo.godNode;
        cc.log("create Layer", newConf.name);

        T.clearLayer(preConf);
    }

    private clearLayer(preConf: IUIConfig) {
        if (preConf) {
            let curLayer = ceo.godNode.getChildByName(preConf.name);
            if (preConf.cacheMode == UICacheMode.Stay) {
                curLayer.active = false;
                cc.log("hide Layer", preConf.name);
            } else {
                curLayer.destroy();
                cc.log("destroy Layer", preConf.name);
            }
        }
    }

    /**
     * 刷新、重置当前Layer
     */
    async resetCurLayer(data?: any) {
        let T = this;

        let conf = T._curLayerConf;
        if (conf) {
            let layer = await T._initUIBase(conf, LAYER_PATH, data);
            layer.parent = ceo.godNode;
            layer.name = "tempName";
    
            ceo.godNode.getChildByName(conf.name).destroy();
            layer.name = conf.name;
            
            cc.log("reset Layer", conf.name);
        }

    }

    async preLoadLayer(conf: IUIConfig, onCompleted?: (error?: Error) => void, onProgress?: (finish: number, total: number) => void) {
        let bundle = await CocosHelper.getBundle(conf.bundle);
        bundle.preload(LAYER_PATH + conf.name, cc.Prefab, (cur: number, all: number, _ignore) => {
            if (onProgress) {
                onProgress(cur, all);
            }
        }, (err: Error, _ignores) => {
            if (onCompleted) {
                onCompleted(err);
            }
        });
    }

    // ********************* Popup *********************
    /**
     * 可返回弹窗界面中用户设置的数据
     */
    async showPopup(conf: IUIConfig, data?: any, parent?: cc.Node) {
        let T = this;

        let zIdx = 99;
        let p = parent;
        if (!p) p = ceo.godNode.getChildByName(T._curLayerConf.name);

        let popNd = new cc.Node();
        popNd.name = conf.name;
        popNd.zIndex = zIdx;
        popNd.parent = p;
        let wgt = popNd.addComponent(cc.Widget);
        wgt.isAlignTop = wgt.isAlignBottom = wgt.isAlignLeft = wgt.isAlignRight = true;
        wgt.top = wgt.bottom = wgt.left = wgt.right = 0;
        wgt.updateAlignment();
        popNd.addComponent(cc.BlockInputEvents);

        CocosHelper.getGrayBg().parent = popNd;

        let popup = await T._initUIBase(conf, POPUP_PATH, data);
        let scptName = conf.script ? conf.script : conf.name;
        let scpt: PopupBase = popup.getComponent(scptName);
        popup.parent = popNd;
        scpt.showAnim();
        cc.log("show Popup", conf.name);

        return new Promise<any>((resolve, reject) => {
            scpt.onDestroyCall = resolve;
        });
    }

    autoRemovePopup(p: cc.Node) {
        p?.destroy();
        cc.log("close Popup", p.name);
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
        return await this._initUIBase(conf, PANEL_PATH, data);
    }

    // ********************* Widget *********************
    async createWidget(conf: IUIConfig, data?: any) {
        return await this._initUIBase(conf, WIDGET_PATH, data);
    }

    // ********************* Common ********************* 
    private async _initUIBase(conf: IUIConfig, prefixPath: string, data?: any) {
        let bundle = await CocosHelper.getBundle(conf.bundle);
        let prefab = await CocosHelper.asyncLoadPrefab(bundle, prefixPath + conf.name);
        let node = cc.instantiate(prefab);
        let scptName = conf.script ? conf.script : conf.name;
        let scpt: UIBase = node.getComponent(scptName);
        if (!scpt) scpt = node.addComponent(UIBase);
        scpt.recvData = data;
        if (conf.cacheMode == UICacheMode.Cache) {
            if (prefab.refCount == 0) prefab.addRef();
        } else {
            prefab.addRef();
            scpt.refAssets.push(prefab);
        }
        return node;
    }
}
