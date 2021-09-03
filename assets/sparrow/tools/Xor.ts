/**
 * 简单的异或加密
 * @author Mortal-Li
 * @created 2021年9月2日
 */

export default class Xor {

    static xor(data: string, key: string): string {
        let base = 0;
        for (let i = key.length - 1; i >= 0; --i) {
            base += key.charCodeAt(i);
        }
        let ret = '';
        for (let i = data.length - 1; i >= 0; --i) {
            let x = data.charCodeAt(i) ^ base;
            ret += String.fromCharCode(x);
        }
        return ret;
    }
}
