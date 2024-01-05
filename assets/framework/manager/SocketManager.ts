/**
 * 
 * @author Mortal-Li
 * @created 2022年5月7日
 */

import { BaseSocket, IConnectOptions } from "../tools/BaseSocket";


export default class SocketManager {
    
    private _sockets: { [socketId: number]: BaseSocket } = {};

    asyncConnect(options: IConnectOptions, connectedCB?: Function, socketId: number = 0) {
        return new Promise<any>((resolve, reject) => {
            if (!this._sockets[socketId]) {
                this._sockets[socketId] = new BaseSocket();
            }
            this._sockets[socketId].asyncConnect(options, connectedCB).then(resolve).catch(reject);
        });
    }

    close(isClean: boolean = false, socketId: number = 0) {
        if (this._sockets[socketId]) {
            this._sockets[socketId].close(isClean);
            if (isClean) {
                delete this._sockets[socketId];
            }
        }
    }

    asyncReq(cmd: number, data: any, showWaiting: boolean = false, socketId: number = 0) {
        return new Promise<any>((resolve, reject) => {
            if (this._sockets[socketId]) {
                this._sockets[socketId].asyncReq(cmd, data, showWaiting).then(resolve).catch(reject);
            } else {
                cc.warn("This ws does not exist!");
                reject(101);
            }
        });
    }

    on(cmd: number, callback: Function, target: any, socketId: number = 0) {
        if (this._sockets[socketId]) {
            this._sockets[socketId].on(cmd, callback, target);
        }
    }

    off(cmd: number, callback: Function, target: any, socketId: number = 0) {
        if (this._sockets[socketId]) {
            this._sockets[socketId].off(cmd, callback, target);
        }
    }

}
