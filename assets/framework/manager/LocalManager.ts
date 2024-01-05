/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import Xor from "../tools/Xor";


const Secret_Key = "any string";

export default class LocalManager {

    getItem(key: string, encrypt: boolean = false): any {
        let v = cc.sys.localStorage.getItem(key);
        if (v === null || v === undefined) return null;
        if (encrypt) v = Xor.xor(v, Secret_Key);
        return JSON.parse(v);
    }

    getItemWithDefault(key: string, defaultValue: any, encrypt: boolean = false): any {
        let v = cc.sys.localStorage.getItem(key);
        if (v === null || v === undefined) {
            this.setItem(key, defaultValue, encrypt);
            return defaultValue;
        };
        if (encrypt) v = Xor.xor(v, Secret_Key);
        return JSON.parse(v);
    }

    setItem(key: string, value: any, encrypt: boolean = false): void {
        let v = JSON.stringify(value);
        if (encrypt) v = Xor.xor(v, Secret_Key);
        cc.sys.localStorage.setItem(key, v);
    }

    removeItem(key: string) {
        cc.sys.localStorage.removeItem(key);
    }
}
