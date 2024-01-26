/**
 * 
 * @author Mortal-Li
 * @created 2022年5月7日
 */

import { BaseSocket, IConnectOptions, SocketErrCode } from "../tools/BaseSocket";


export default class SocketManager {
    
    private _sockets: { [socketId: number]: BaseSocket } = {};

    /**
     * 异步连接socket
     * @param options socket相关配置
     * @param connectedCB 可选，连接成功时的回调，一般只有选择自动重连时，才用得到
     * @param socketId 默认为0，表示socket id；若同时连接多个socket，用于区分
     */
    connectAsync(options: IConnectOptions, connectedCB?: Function, socketId: number = 0) {
        return new Promise<any>((resolve, reject) => {
            if (!this._sockets[socketId]) {
                this._sockets[socketId] = new BaseSocket();
            }
            this._sockets[socketId].connectAsync(options, connectedCB).then(resolve).catch(reject);
        });
    }

    /**
     * 主动断开连接
     * @param isClean 默认false，不清空服务器推送监听
     * @param socketId 默认为0，表示socket id；若同时连接多个socket，用于区分
     */
    close(isClean: boolean = false, socketId: number = 0) {
        if (this._sockets[socketId]) {
            this._sockets[socketId].close(isClean);
            if (isClean) {
                delete this._sockets[socketId];
            }
        }
    }

    /**
     * 异步向服务器发送请求，异步返回响应结果
     * @param cmd 协议号
     * @param data 请求数据
     * @param showWaiting 默认false，不显示loading
     * @param socketId 默认为0，表示socket id；若同时连接多个socket，用于区分
     */
    reqAsync(cmd: number | string, data: any, showWaiting: boolean = false, socketId: number = 0) {
        return new Promise<any>((resolve, reject) => {
            if (this._sockets[socketId]) {
                this._sockets[socketId].reqAsync(cmd, data, showWaiting).then(resolve).catch(reject);
            } else {
                cc.warn("This ws does not exist!");
                reject(SocketErrCode.NoThisSocket);
            }
        });
    }

    /**
     * 监听服务器推送
     * @param cmd 协议号
     * @param callback 监听者的响应回调
     * @param target 监听者
     * @param socketId 默认为0，表示socket id；若同时连接多个socket，用于区分
     */
    on(cmd: number | string, callback: (data: any) => void, target: any, socketId: number = 0) {
        if (this._sockets[socketId]) {
            this._sockets[socketId].on(cmd, callback, target);
        }
    }

    /**
     * 取消服务器推送监听
     * @param cmd 协议号
     * @param callback 监听者的响应回调
     * @param target 监听者
     * @param socketId 默认为0，表示socket id；若同时连接多个socket，用于区分
     */
    off(cmd: number | string, callback: (data: any) => void, target: any, socketId: number = 0) {
        if (this._sockets[socketId]) {
            this._sockets[socketId].off(cmd, callback, target);
        }
    }

}
