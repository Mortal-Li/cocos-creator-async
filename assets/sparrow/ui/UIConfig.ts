/**
 * UI资源配置
 * @author Mortal-Li
 * @created 2021年9月2日
 */

export interface UIConfigInterface {
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


/**
 * prefab资源路径前缀
 */
export const PRE_PATH = "Prefabs/";