/**
 * UI资源配置
 * @author Mortal-Li
 * @created 2021年9月2日
 */


/**
 * 缓存模式
 */
export const UICacheMode = {
    /**
     * 不缓存加载的资源
     */
    NoCache: 0,
    /**
     * 缓存加载的资源
     */
    Cache: 1,
    /**
     * 常驻节点 (用于Layer)
     */
    Stay: 2
};

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
     * 所加载资源的缓存模式，默认为 UICacheMode.NoCache，不缓存
     */
    cacheMode?: number;
}


// ***************** prefab 各类型路径配置 *****************
const PRE_PATH = "Prefabs/";
export const LAYER_PATH = PRE_PATH + "Layer/";
export const POPUP_PATH = PRE_PATH + "Popup/";
export const PANEL_PATH = PRE_PATH + "Panel/";
export const WIDGET_PATH = PRE_PATH + "Widget/";