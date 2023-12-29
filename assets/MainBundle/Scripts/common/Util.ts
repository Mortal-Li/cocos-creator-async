/**
 * 项目通用的方法
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { PopupConf, WidgetConf } from "../../../Boot/Scripts/AssetConfig";
import ceo from "../../../sparrow/ceo";
import Toast from "../Toast";



export default class Util {
    
    static async showToast(str: string) {
        let tst = await ceo.uiMgr.createWidgetAsync(WidgetConf.Toast);
        let scrpt = tst.getComponent(Toast);
        scrpt.msg = str;
        ceo.godNode.addChild(tst);
    }

    static async showCommonPopup(options: {
        /**
         * 标题 可选
         */
        title?: string;
        /**
         * 内容 必填
         */
        msg: string;
        /**
         * 确认按钮文本 可选 默认"OK"
         */
        btnTxtOK?: string;
        /**
         * 确认按钮回调 可选
         */
        btnCallOK?: Function;
        /**
         * 取消按钮回调 可选
         */
        btnCallNO?: Function;
        /**
         * 是否隐藏取消按钮，默认false
         */
        hideNO?: boolean;
        /**
         * 弹窗高度，默认原始高度
         */
        height?: number;
        }) {

        return await ceo.uiMgr.showPopupAsync(PopupConf.Common, options);
    }

}
