/**
 * 装饰器
 * @author Mortal-Li
 * @created 2021年9月18日
 */

/**
 * time时间内只执行第一次调用 默认1s
 */
export function doOnceFirst(time = 1) {
    return (target: any, key: string, desc: PropertyDescriptor) => {
        let original: Function = desc.value;
        let doing = false;
        desc.value = function(...args) {
            if (doing) return;
            doing = true;

            original.apply(this, args);

            setTimeout(()=>{
                doing = false;
            }, time * 1000);
        };

    };
}

/**
 * time时间内只执行最后一次调用 默认0.5s
 */
export function doOnceLast(time = 0.5) {
    return (target: any, key: string, desc: PropertyDescriptor) => {
        let original: Function = desc.value;
        let tid: number;
        desc.value = function(...args) {
            if (tid) clearTimeout(tid)
    
            tid = setTimeout(() => {
                original.apply(this, args)
            }, time * 1000);
        };
        
    };
}