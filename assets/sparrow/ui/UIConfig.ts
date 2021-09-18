/**
 * UI资源配置
 * @author Mortal-Li
 * @created 2021年9月2日
 */


export interface IUIConfig {
    /**
     * Bundle包名
     */
    bundle: string;
    /**
     * prefab资源名和挂载的脚本名，两者名字一样
     */
    name: string;
    /**
     * 是否常驻内存，可选；true表示常驻
     */
    stay?: boolean;
}


// ***************** prefab 各类型路径配置 *****************
const PRE_PATH = "Prefabs/";
export const LAYER_PATH = PRE_PATH + "Layer/";
export const POPUP_PATH = PRE_PATH + "Popup/";
export const PANEL_PATH = PRE_PATH + "Panel/";
export const WIDGET_PATH = PRE_PATH + "Widget/";