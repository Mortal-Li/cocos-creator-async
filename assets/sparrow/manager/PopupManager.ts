/**
 * 弹窗管理
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import ceo from "../ceo";
import CocosHelper from "../tools/CocosHelper";
import PopupBase from "../ui/PopupBase";
import { UIConfigInterface } from "../ui/UIConfig";


export default class PopupManager {

    /**
     * 可返回弹窗界面中用户设置的数据
     */
    async showPopup(conf: UIConfigInterface, data?: any) {
        let T = this;

        let popup = await CocosHelper.createPrefabs(conf.name, conf.bundle);
        popup.zIndex = 99;
        let scpt: PopupBase = popup.getComponent(conf.name);
        scpt.recvData = data;

        popup.parent = ceo.layerMgr.getCurLayer();
        cc.log("show Popup", conf.name);

        return await new Promise<any>((resolve, reject) => {
            scpt.onDestroyCall = resolve;
        });
    }


}
