/**
 * 自定义事件管理器：注册和分发消息
 * @author Mortal-Li
 * @created 2021年9月2日
 */

interface EventObj {
    target: any;
    callback: Function;
    once: boolean;
}

export default class EventManager {

    private _eventObjMap: Map<string, EventObj[]> = new Map();

    on(eventName: string, callback: Function, target: any): void {
        this._on(eventName, callback, target, false);
    }

    once(eventName: string, callback: Function, target: any): void {
        this._on(eventName, callback, target, true);
    }

    private _on(eventName: string, callback: Function, target: any, once: boolean): void {
        let T = this;

        let eventObjArr = T._eventObjMap.get(eventName);
        if (!eventObjArr) {
            eventObjArr = [];
            T._eventObjMap.set(eventName, eventObjArr);
        }
        let idx = eventObjArr.findIndex((eventObj) => {
            return eventObj.target === target && eventObj.callback === callback;
        });

        if (idx === -1) {
            eventObjArr.push({
                target: target,
                callback: callback,
                once: once,
            });
        }
    }

    off(eventName: string, callback?: Function, target?: any): void {
        let T = this;

        let eventObjArr = T._eventObjMap.get(eventName);
        if (eventObjArr) {
            if (callback && target) {
                let idx = eventObjArr.findIndex((eventObj) => {
                    return eventObj.target === target && eventObj.callback === callback;
                });
                if (idx !== -1) {
                    eventObjArr.splice(idx, 1);
                }
            } else {
                eventObjArr = null;
                T._eventObjMap.delete(eventName);
            }
        }
    }

    offTargetAll(target: any): void {
        this._eventObjMap.forEach((eventObjArr, eventName) => {
            if (eventObjArr) {
                for (let i = eventObjArr.length - 1; i >= 0; i--) {
                    if (eventObjArr[i].target === target) {
                        eventObjArr.splice(i, 1);
                    }
                }
            }
        });
    }

    emit(eventName: string, ...param: any[]): void {
        let eventObjArr = this._eventObjMap.get(eventName);
        if (eventObjArr) {
            let eventObj: EventObj = null;
            for (let i = eventObjArr.length - 1; i >= 0; i--) {
                eventObj = eventObjArr[i];
                eventObj.callback.apply(eventObj.target, param);

                if (eventObj.once) {
                    eventObjArr.splice(i, 1);
                }
            }
        }
    }
}
