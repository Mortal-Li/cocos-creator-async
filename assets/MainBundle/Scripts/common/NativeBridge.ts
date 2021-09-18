/**
 * 和原生平台的交互
 * @author Mortal-Li
 * @created 2021年9月18日
 */


// fix ios tip error info
declare namespace jsb {
    export module reflection {
        /**
         * https://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html
         * call OBJC/Java static methods
         * 
         * @param className 
         * @param methodName 
         * @param parameters 
         */
        export function callStaticMethod(className: string, methodName: string, ...parameters: any): any;
    }
}

export default class NativeBridge {

    static isIOS() {
        return cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS;
    }

    static isAndroid() {
        return cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID;
    }


}