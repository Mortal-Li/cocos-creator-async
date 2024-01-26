/**
 * Socket异步封装
 * @author Mortal-Li
 * @created 2022年5月7日
 */


/**
 * 网络提示相关接口
 */
interface INetworkTips {
    showConnecting?: (isShow: boolean) => void;
    showReconnecting?: (isShow: boolean) => void;
    showRequesting?: (isShow: boolean) => void;
    manualReconnect?: () => void;
}

/**
 * 响应回调
 */
type RespCallback = (data: any) => void;

/**
 * 服务器推送响应对象
 */
interface S2CCallbackObj {
    target: any;
    callback: RespCallback;
}

export const SocketErrCode = {
    NoThisSocket: 100,
    SendFailure: 101,
};

/**
 * socket通信相关配置
 */
export interface IConnectOptions {
    ip?: string;
    port?: number;

    /**
     * url，与 ip + port 二选一
     */
    url?: string;

    /**
     * 协议名：默认"ws"
     */
    protocol?: string;

    /**
     * 证书：默认空
     */
    ca?: any;

    /**
     * 默认 "arraybuffer"
     */
    binaryType?: BinaryType;

    /**
     * 表示网络断开，尝试重连的次数，次数用尽后需手动重连；
     * 默认为0，表示不自动重连，需手动重连；
     * 为-1，表示永久尝试重连
     */
    autoReconnect?: number;

    /**
     * 等待多长时间进行下一次重连，默认6s
     */
    reconnectTime?: number;

    /**
     * 心跳间隔，默认 3s
     */
    heartTime?: number;

    /**
     * 心跳超时计数，默认3次；超过这个数则进行重连，收到任意消息会重置为0
     */
    heartOutCount?: number;

    /**
     * 获取自定义的心跳包数据的方法，默认返回空字符串 ""
     */
    getHeartbeat?: () => any;

    /**
     * 对接收的数据进行自定义解包，返回空null表示解析失败；
     * 默认cmd为0，content返回原数据
     */
    parseNetData?: (data: any) => {
        cmd: number | string;
        content: any;
    };

    /**
     * 网络提示及相关回调接口，默认为空对象
     */
    tips?: INetworkTips;
}

export class BaseSocket {

    private _ws: WebSocket = null;
    private _connectOptions: IConnectOptions = null;
    private _heartTimer: any = null;
    private _curHeartOutCnt: number = 0;
    private _curAutoReconnect: number = 0;
    private _reconnectTimer: any = 0;

    private _req2respCallbacks: { [cmd: number | string]: RespCallback[] } = {};
    private _server2ClientListeners: { [cmd: number | string]: S2CCallbackObj[] } = {};

    private _connectedCB: Function = null;

    connectAsync(options: IConnectOptions, connectedCB?: Function) {
        if (this._connectOptions == null) {
            this._connectOptions = {
                url: options.url ? options.url : `${(options.protocol ? options.protocol : "ws")}://${options.ip}:${options.port}`,
                ca: options.ca,
                binaryType: options.binaryType ? options.binaryType : "arraybuffer",
                autoReconnect: options.autoReconnect ? options.autoReconnect : 0,
                reconnectTime: options.reconnectTime ? options.reconnectTime : 6,
                heartTime: options.heartTime ? options.heartTime : 3,
                heartOutCount: options.heartOutCount ? options.heartOutCount : 3,
                getHeartbeat: options.getHeartbeat ? options.getHeartbeat : () => "",
                parseNetData: options.parseNetData ? options.parseNetData : (data: any) => { return { cmd: 0, content: data } },
                tips: options.tips ? options.tips : {}
            };
            this._connectedCB = connectedCB ? connectedCB : ()=>{};
        }

        let inPromise = true;

        return new Promise<void>((resolve, reject) => {
            if (this._ws) {
                if (this._ws.readyState === WebSocket.CONNECTING) {
                    cc.log("ws connecting, wait for a moment...");
                    resolve();
                    return ;
                } else if (this._ws.readyState === WebSocket.OPEN) {
                    cc.log("ws has connected!");
                    resolve();
                    return ;
                }
            }

            cc.log("net is connecting!");
            this._connectOptions.tips?.showConnecting(true);
    
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                //@ts-ignore
                this._ws = new WebSocket(this._connectOptions.url, null, this._connectOptions.ca);
            } else {
                this._ws = new WebSocket(this._connectOptions.url);
            }
            this._ws.binaryType = this._connectOptions.binaryType;
            
            this._ws.onopen = (ev) => {
                inPromise = false;
                this._connectOptions.tips?.showConnecting(false);
                resolve();

                this._connectedCB();
                this._onOpen(ev);
            };

            this._ws.onmessage = (ev) => {
                this._onMessage(ev.data);
            };

            this._ws.onerror = (ev) => {
                if (inPromise) {
                    inPromise = false;
                    this._connectOptions.tips?.showConnecting(false);
                    reject(ev);
                }

                this._onError(ev);
            };

            this._ws.onclose = (ev) => {
                if (inPromise) {
                    inPromise = false;
                    this._connectOptions.tips?.showConnecting(false);
                    reject(ev);
                }

                this._onClose(ev);
            };

        });
    }

    reqAsync(cmd: number | string, data: any, showWaiting: boolean = false) {
        if (showWaiting) this._connectOptions.tips?.showRequesting(true);
        
        return new Promise<any>((resolve, reject) => {
            if (!this._send(data)) {
                if (showWaiting) this._connectOptions.tips?.showRequesting(false);
                reject(SocketErrCode.SendFailure);
                return ;
            }

            if (!this._req2respCallbacks[cmd]) {
                this._req2respCallbacks[cmd] = [];
            }
            
            this._req2respCallbacks[cmd].push((d: any) => {
                if (showWaiting) this._connectOptions.tips?.showRequesting(false);
                resolve(d);
            });
        });
    }

    close(isClean: boolean = false) {
        this._stopHeartTimer();
        this._stopReconnectTimer();

        if (this._ws) {
            if (this._ws.readyState == WebSocket.CONNECTING || this._ws.readyState == WebSocket.CLOSING) {
                this._connectOptions.tips?.showConnecting(false);
            }

            this._clearReqList();
            if (isClean) this._server2ClientListeners = {};

            this._ws.onopen = (ev) => {};
            this._ws.onmessage = (ev) => {};
            this._ws.onerror = (ev) => {};
            this._ws.onclose = (ev) => {};
            
            if (this._ws.readyState != WebSocket.CLOSED) this._ws.close();
            cc.log("ws closed manually");
        }
    }

    on(cmd: number | string, callback: RespCallback, target: any) {
        if (!this._server2ClientListeners[cmd]) {
            this._server2ClientListeners[cmd] = [];
        }

        let idx = this._server2ClientListeners[cmd].findIndex((obj) => {
            return obj.target === target && obj.callback === callback;
        });

        if (idx === -1) {
            this._server2ClientListeners[cmd].push({
                target: target,
                callback: callback
            });
        }
    }

    off(cmd: number | string, callback: RespCallback, target: any) {
        let s2cCallbacks = this._server2ClientListeners[cmd];
        if (s2cCallbacks) {
            let idx = s2cCallbacks.findIndex((obj) => {
                return obj.target === target && obj.callback === callback;
            });
            if (idx !== -1) {
                s2cCallbacks.splice(idx, 1);
            }
        }
    }

    private _onOpen(ev) {
        cc.log("ws connected!");
        this._stopReconnectTimer();
        this._startHeartTimer();
    }

    private _onMessage(data: any) {
        this._curHeartOutCnt = 0;
        if (data) {
            this._onRecv(data);
        }
    }

    private _onError(ev) {
        cc.error("ws error!", ev);
    }

    private _onClose(ev) {
        cc.log("ws closed!", ev.code, ev.reason);
        this._stopHeartTimer();
        this._stopReconnectTimer();
        this._clearReqList();

        this._doReconnect();
    }

    private _send(data: any) {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(data);
            return true;
        } else {
            cc.warn("send exceptionally");
            return false;
        }
    }

    private _clearReqList() {
        for (const cmd in this._req2respCallbacks) {
            const reqs = this._req2respCallbacks[cmd];
            reqs.forEach((cb, i) => { cb(null); });
        }
        this._req2respCallbacks = {};
    }

    private _onRecv(data: any) {
        let ret = this._connectOptions.parseNetData(data);
        
        if (ret === null || ret === undefined) {
            cc.error("ParseNetData Error! ", data);
            return;
        }

        let reqCallbacks = this._req2respCallbacks[ret.cmd];
        if (reqCallbacks && reqCallbacks.length > 0) {
            let cb = reqCallbacks.shift();
            cb(ret.content);
        }

        let s2cCallbacks = this._server2ClientListeners[ret.cmd];
        if (s2cCallbacks) {
            for (const obj of s2cCallbacks) {
                obj.callback.call(obj.target, ret.content);
            }
        }

    }

    private _doReconnect() {
        let limitReconnect = this._connectOptions.autoReconnect;
        if (limitReconnect == 0 || (limitReconnect > 0 && this._curAutoReconnect >= limitReconnect)) {
            this._connectOptions.tips?.manualReconnect();
        } else {
            if (limitReconnect > 0) ++this._curAutoReconnect;
            cc.log("net is reconnecting!");
            this._connectOptions.tips?.showReconnecting(true);
            this._reconnectTimer = setTimeout(() => {
                this._connectOptions.tips?.showReconnecting(false);
                this.connectAsync(this._connectOptions, this._connectedCB);
            }, this._connectOptions.reconnectTime * 1000);
        }
    }

    private _startHeartTimer() {
        this._curHeartOutCnt = 0;
        this._stopHeartTimer();
        this._heartTimer = setInterval(() => {

            ++this._curHeartOutCnt;
            if (this._curHeartOutCnt > this._connectOptions.heartOutCount) {
                cc.log("ws disconnected! -- heart out");
                this.close();
                this._doReconnect();
                return;
            }
            
            this._send(this._connectOptions.getHeartbeat());
        }, this._connectOptions.heartTime * 1000);
    }

    private _stopHeartTimer() {
        this._heartTimer && clearInterval(this._heartTimer);
        this._heartTimer = null;
    }

    private _stopReconnectTimer() {
        this._reconnectTimer && clearTimeout(this._reconnectTimer);
        this._reconnectTimer = null;
    }
}
