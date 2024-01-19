/**
 * 跟数学相关的方法
 * @author Mortal-Li
 * @created 2024年1月17日
 */


export default class MathHelper {

    /**
     * 返回 [0, max) 之间的随机整数
     */
    static randomInt0(max: number) {
        return Math.floor(Math.random() * max);
    }

    /**
     * 返回 [1, max] 之间的随机整数
     */
    static randomInt1(max: number) {
        return Math.ceil(Math.random() * max);
    }

    /**
     * 返回 [min, max] 之间的随机整数
     */
    static randomInt2(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 返回 (0, max) 之间的随机浮点数
     */
    static randomFloat(max: number) {
        return Math.random() * max;
    }

    /**
     * 返回 (min, max) 之间的随机浮点数
     */
    static randomFloat2(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    /**
     * 返回 数组中随机的一个元素
     */
    static randomArray(arr: any[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * 返回 一个区域内的随机坐标点
     * @param w 区域的宽
     * @param h 区域的高
     * @param centerP 区域的中点，默认cc.v2(0, 0)
     */
    static randomV2(w: number, h: number, centerP: cc.Vec2 = cc.Vec2.ZERO) {
        return cc.v2(w * (Math.random() - 0.5), h * (Math.random() - 0.5)).add(centerP);
    }

    /**
     * 保留n位小数位，返回字符串形式
     * @param num 要操作的数
     * @param n 保留n位小数，默认 2位
     * @param isRound 是否四舍五入，默认false，不四舍五入
     */
    static toFixed(num: number, n: number = 2, isRound: boolean = false) {
        if (n < 0) return num;

        if (isRound) {
            return num.toFixed(n);
        } else {
            let b = 1;
            for (let i = 0; i < n; ++i) b *= 10;
            return (Math.floor(num * b) / b).toFixed(n);
        }
    }

    /**
     * 将数num限制在 min 和 max 之间
     */
    static limit(num: number, min: number, max: number) {
        return Math.min(max, Math.max(min, num));
    }
}
