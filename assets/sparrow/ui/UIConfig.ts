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
     * prefab资源名
     */
    name: string;
    /**
     * 挂载的脚本名, 可选；缺省表示和prefab资源名一致
     */
    script?: string;
    /**
     * 是否常驻内存或保留缓存，可选；默认false
     * 对于layer类型，如果为true，切换layer时，不会remove当前layer结点和decRef对应的prefab；
     * 对于其他类型，如果为true，如Popup，表示会remove当前结点，但是不会decRef对应的prefab；
     */
    stay?: boolean;
}


// ***************** prefab 各类型路径配置 *****************
const PRE_PATH = "Prefabs/";
export const LAYER_PATH = PRE_PATH + "Layer/";
export const POPUP_PATH = PRE_PATH + "Popup/";
export const PANEL_PATH = PRE_PATH + "Panel/";
export const WIDGET_PATH = PRE_PATH + "Widget/";