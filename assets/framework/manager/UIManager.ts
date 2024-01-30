/**
 * 管理所有UI
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import kk from "../kk";
import AsyncHelper from "../tools/AsyncHelper";
import CocosHelper from "../tools/CocosHelper";
import LayerBase from "../ui/LayerBase";
import PopupBase from "../ui/PopupBase";
import UIBase from "../ui/UIBase";
import { IUIConfig, LAYER_PATH, PANEL_PATH, POPUP_PATH, UICacheMode, WIDGET_PATH } from "../ui/UIConfig";



export default class UIManager {

    //////////////////////////////////////////// Layer ////////////////////////////////////////////
    private _curLayerConf : IUIConfig;

    getCurLayerConf() {
        return this._curLayerConf;
    }

    getCurLayer() {
        return kk.godNode.getChildByName(this._curLayerConf.name);
    }
    
    /**
     * 切换Layer
     * @param newConf 要切换的Layer配置
     * @param data 传给Layer的数据，可选
     */
    async goLayerAsync(newConf: IUIConfig, data?: any) {
        let T = this;

        let preConf = T._curLayerConf;
        if (preConf && preConf.name === newConf.name) {
            T.resetCurLayerAsync(data);
            return ;
        }

        T._curLayerConf = newConf;

        if (newConf.cacheMode == UICacheMode.Stay) {
            let layer = kk.godNode.getChildByName(newConf.name);
            if (layer) {
                layer.active = true;
                let scptName = newConf.script ? newConf.script : newConf.name;
                let scpt: LayerBase = layer.getComponent(scptName);
                scpt.recvData = data;
                scpt.refresh();
                cc.log("show Layer", newConf.name);
                T._clearLayer(preConf);
                return ;
            }
        }

        let layer = await T._genUIBaseAsync(newConf, LAYER_PATH, data);
        layer.parent = kk.godNode;
        cc.log("create Layer", newConf.name);

        T._clearLayer(preConf);
    }

    /**
     * 刷新、重置当前Layer
     * @param data 传给Layer的数据，可选
     */
    async resetCurLayerAsync(data?: any) {
        let T = this;

        let conf = T._curLayerConf;
        if (conf) {
            if (conf.cacheMode == UICacheMode.Stay) {
                let layer = kk.godNode.getChildByName(conf.name);
                let scptName = conf.script ? conf.script : conf.name;
                let scpt: LayerBase = layer.getComponent(scptName);
                scpt.recvData = data;
                scpt.refresh();
                cc.log("refresh Layer", conf.name);
            } else {
                let delLayer = kk.godNode.getChildByName(conf.name);
                delLayer.name = "removed";

                let layer = await T._genUIBaseAsync(conf, LAYER_PATH, data);
                layer.parent = kk.godNode;
                delLayer.destroy();
                
                cc.log("reset Layer", conf.name);
            }

        }

    }

    /**
     * 预加载指定的layer
     */
    async preLoadLayerAsync(conf: IUIConfig, onProgress?: (cur: number, total: number) => void) {
        let bundle = cc.assetManager.getBundle(conf.bundle);
        if (!bundle) bundle = await AsyncHelper.loadBundleAsync(conf.bundle);
        await AsyncHelper.preloadAsync(bundle, LAYER_PATH + conf.name, cc.Prefab, onProgress);
    }

    private _clearLayer(preConf: IUIConfig) {
        if (preConf) {
            let layer = kk.godNode.getChildByName(preConf.name);
            if (preConf.cacheMode == UICacheMode.Stay) {
                layer.active = false;
                cc.log("hide Layer", preConf.name);
            } else {
                layer.destroy();
                cc.log("destroy Layer", preConf.name);
            }
        }
    }

    //////////////////////////////////////////// Popup ////////////////////////////////////////////
    /**
     * 显示对应配置的弹窗，可返回弹窗界面中用户设置的数据
     * @param conf 要显示的弹窗配置
     * @param data 传给弹窗的数据，可选
     * @returns 当关闭弹窗时，可返回弹窗脚本中用户设置的任意数据
     */
    async showPopupAsync(conf: IUIConfig, data?: any) {
        let T = this;

        let nd = new cc.Node(conf.name);
        T.getCurLayer().addChild(nd, 99);
        nd.addComponent(cc.BlockInputEvents);
        
        CocosHelper.addWidget(nd, { left: 0, right: 0, top: 0, bottom: 0 });

        let darkBg = new cc.Node("dark");
        darkBg.opacity = 200;
        darkBg.addComponent(cc.Sprite).spriteFrame = CocosHelper.genPureColorSpriteFrame();
        darkBg.parent = nd;
        CocosHelper.addWidget(darkBg, { left: 0, right: 0, top: 0, bottom: 0 });

        let popup = await T._genUIBaseAsync(conf, POPUP_PATH, data);
        let scptName = conf.script ? conf.script : conf.name;
        let scpt: PopupBase = popup.getComponent(scptName);
        popup.parent = nd;
        scpt.showAnim();
        cc.log("show Popup", conf.name);

        return new Promise<any>((resolve, reject) => {
            scpt.onDestroyCall = resolve;
        });
    }

    /**
     * 根据配置获取已展示的弹窗
     */
    getPopup(popupConf: IUIConfig, layerConf: IUIConfig = null) {
        if (!layerConf) layerConf = this._curLayerConf;
        
        let layer = kk.godNode.getChildByName(layerConf.name);
        if (layer) {
            return layer.getChildByName(popupConf.name);
        }

        return null;
    }

    /**
     * 关闭所有已展示的弹窗
     */
    closeAllPopup() {
        let layer = kk.godNode.getChildByName(this._curLayerConf.name);
        if (layer) {
            layer.children.forEach((nd, i) => {
                if (nd.name.endsWith("Popup")) {
                    nd.destroy();
                }
            });
        }
    }

    _autoRemovePopup(p: cc.Node) {
        p?.destroy();
        cc.log("close Popup", p.name);
    }

    //////////////////////////////////////////// Panel ////////////////////////////////////////////
    async createPanelAsync(conf: IUIConfig, data?: any) {
        return await this._genUIBaseAsync(conf, PANEL_PATH, data);
    }

    //////////////////////////////////////////// Widget ////////////////////////////////////////////
    async createWidgetAsync(conf: IUIConfig, data?: any) {
        return await this._genUIBaseAsync(conf, WIDGET_PATH, data);
    }

    //////////////////////////////////////////// Common //////////////////////////////////////////// 
    private async _genUIBaseAsync(conf: IUIConfig, prefixPath: string, data?: any) {
        let bundle = cc.assetManager.getBundle(conf.bundle);
        if (!bundle) bundle = await AsyncHelper.loadBundleAsync(conf.bundle);

        let prefab = await AsyncHelper.loadAsync<cc.Prefab>(bundle, prefixPath + conf.name, cc.Prefab);
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

    //////////////////////////////////////////// Other ////////////////////////////////////////////
    /**
     * 屏蔽UI触摸
     */
    banTouch() {
        let ban = kk.godNode.getChildByName("_ban");
        if (!ban) {
            let node = new cc.Node("_ban");
            node.setContentSize(kk.godNode.getContentSize());
            kk.godNode.addChild(node, 9);
            node.addComponent(cc.BlockInputEvents);
        }
    }

    /**
     * 恢复UI触摸
     */
    unbanTouch() {
        let ban = kk.godNode.getChildByName("_ban");
        if (ban) ban.destroy();
    }
}
