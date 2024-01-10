/**
 * 跟时间相关的方法
 * @author Mortal-Li
 * @created 2024年1月8日
 */


export default class TimeHelper {

    /**
     * 年月日 eg: 2024/01/08
     * @param milSec 毫秒，可选
     * @param div 分隔符，默认'/'
     */
    static getCurFullDate(milSec?: number, div = '/') {
        let ret = '';

        let d = milSec ? new Date(milSec) : new Date();
        ret += (d.getFullYear() + div);

        let month = d.getMonth() + 1;
        if (month < 10) ret += ('0' + month);
        else ret += month;
        ret += div;

        let day = d.getDate();
        if (day < 10) ret += ('0' + day);
        else ret += day;

        return ret;
    }

    /**
     * 月日 eg: 01/08
     * @param milSec 毫秒，可选
     * @param div 分隔符，默认'/'
     */
     static getCurDate(milSec?: number, div = '/') {
        let ret = '';

        let d = milSec ? new Date(milSec) : new Date();

        let month = d.getMonth() + 1;
        if (month < 10) ret += ('0' + month);
        else ret += month;
        ret += div;

        let day = d.getDate();
        if (day < 10) ret += ('0' + day);
        else ret += day;

        return ret;
    }

    /**
     * 当月第几天
     * @param milSec 毫秒，可选
     */
    static getDayOfMonth(milSec?: number) {
        let d = milSec ? new Date(milSec) : new Date();
        return d.getDate();
    }
    
    /**
     * eg: 17:45:33:952
     * @param milSec 毫秒，可选
     * @param div 分隔符，默认':'
     */
    static getCurDetailTime(milSec?: number, div = ':') {
        let d = milSec ? new Date(milSec) : new Date();
        return d.getHours() + div + d.getMinutes() + div + d.getSeconds() + div + d.getMilliseconds();
    }

    /**
     * eg: 17:45:33
     * @param milSec 毫秒，可选
     * @param div 分隔符，默认':'
     */
    static getCurNormalTime(milSec?: number, div = ':') {
        let d = milSec ? new Date(milSec) : new Date();
        return d.getHours() + div + d.getMinutes() + div + d.getSeconds();
    }

    /**
     * eg: 17:45
     * @param milSec 毫秒，可选
     * @param div 分隔符，默认':'
     */
    static getCurShortTime(milSec?: number, div = ':') {
        let d = milSec ? new Date(milSec) : new Date();
        return d.getHours() + div + d.getMinutes();
    }

    /**
     * 获取时间戳
     */
    static getTimeStamp() {
        return Date.now();
    }
}
