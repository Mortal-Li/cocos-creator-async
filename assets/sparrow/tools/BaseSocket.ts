/**
 * 
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

interface S2CCallbackObj {
    target: any;
    callback: Function;
}

export type ReqCallback = (data?: any) => void;

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
     * 等待多长时间进行下一次重连，默认10s
     */
    reconnectTime?: number;

    /**
     * 心跳间隔，默认 3s
     */
    heartTime?: number;

    /**
     * 心跳超时计数，默认3次；超过这个数则断开连接，收到任意消息会重置为0
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
        cmd: number;
        content: any;
    };

    /**
     * 网络提示相关回调接口，默认为空对象
     */
    tips?: INetworkTips;
}

export class BaseSocket {

    private _ws: WebSocket = null;
    private _connectOptions: IConnectOptions = null;
    private _inPromise: boolean = true;
    private _heartTimer: any = null;
    private _curHeartOutCnt: number = 0;
    private _curAutoReconnect: number = 0;
    private _reconnectTimer: any = 0;

    private _req2respCallbacks: { [cmd: number]: ReqCallback[] } = {};
    private _server2ClientListeners: { [cmd: number]: S2CCallbackObj[] } = {};

    private _connectedCB: Function = null;

    asyncConnect(options: IConnectOptions, connectedCB?: Function) {
        if (this._connectOptions == null) {
            this._connectOptions = {
                url: options.url ? options.url : `${(options.protocol ? options.protocol : "ws")}://${options.ip}:${options.port}`,
                binaryType: options.binaryType ? options.binaryType : "arraybuffer",
                autoReconnect: options.autoReconnect ? options.autoReconnect : 0,
                reconnectTime: options.reconnectTime ? options.reconnectTime : 10,
                heartTime: options.heartTime ? options.heartTime : 3,
                heartOutCount: options.heartOutCount ? options.heartOutCount : 3,
                getHeartbeat: options.getHeartbeat ? options.getHeartbeat : () => "",
                parseNetData: options.parseNetData ? options.parseNetData : (data: any) => { return { cmd: 0, content: data } },
                tips: options.tips ? options.tips : {}
            };
        }

        this._connectedCB = connectedCB ? connectedCB : ()=>{};
        this._inPromise = true;

        return new Promise<any>((resolve, reject) => {
            if (this._ws) {
                if (this._ws.readyState === WebSocket.CONNECTING) {
                    cc.log("ws connecting, wait for a moment...");
                    resolve(null);
                    return ;
                } else if (this._ws.readyState === WebSocket.OPEN) {
                    cc.log("ws has connected!");
                    resolve(null);
                    return ;
                }
            }

            this._connectOptions.tips?.showConnecting(true);
    
            this._ws = new WebSocket(this._connectOptions.url);
            this._ws.binaryType = this._connectOptions.binaryType;
            
            this._ws.onopen = (ev) => {
                if (this._inPromise) {
                    this._inPromise = false;
                    this._connectOptions.tips?.showConnecting(false);
                    resolve(null);
                }

                this._connectedCB();
                this._onOpen(ev);
            };

            this._ws.onmessage = (ev) => {
                this._onMessage(ev.data);
            };

            this._ws.onerror = (ev) => {
                if (this._inPromise) {
                    this._inPromise = false;
                    this._connectOptions.tips?.showConnecting(false);
                    reject(ev);
                }

                this._onError(ev);
            };

            this._ws.onclose = (ev) => {
                if (this._inPromise) {
                    this._inPromise = false;
                    this._connectOptions.tips?.showConnecting(false);
                    reject(ev);
                }

                this._onClose(ev);
            };

        });
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
        this._doReconnect();
    }

    asyncReq(cmd: number, data: any, showWaiting: boolean) {
        if (showWaiting) this._connectOptions.tips?.showRequesting(true);
        
        return new Promise<any>((resolve, reject) => {
            if (!this.send(data)) {
                if (showWaiting) this._connectOptions.tips?.showRequesting(false);
                reject();
                return ;
            }

            if (!this._req2respCallbacks[cmd]) {
                this._req2respCallbacks[cmd] = [];
            }

            this._req2respCallbacks[cmd].push((d?: any) => {
                if (showWaiting) this._connectOptions.tips?.showRequesting(false);
                resolve(d);
            });
        });
    }

    send(data: any) {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(data);
            return true;
        } else {
            cc.warn("send exceptionally");
            return false;
        }
    }

    /**
     * 主动断开
     */
    close(isClean: boolean = false) {
        this._stopHeartTimer();
        this._stopReconnectTimer();

        if (this._ws && this._ws.readyState != WebSocket.CLOSED) {
            
            this._req2respCallbacks = {};
            if (isClean) this._server2ClientListeners = {};
            this._ws.onopen = (ev) => {};
            this._ws.onmessage = (ev) => {};
            this._ws.onerror = (ev) => {};
            this._ws.onclose = (ev) => {};
            
            this._ws.close();
            cc.log("ws closed manually");
        }
    }

    private _onRecv(data: any) {
        let ret = this._connectOptions.parseNetData(data);
        
        if (ret === null || ret === undefined) {
            cc.error("ParseNetData Error!", data);
            return;
        }

        if (ret.cmd >= 0) {
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

    }

    private _doReconnect() {
        let limitReconnect = this._connectOptions.autoReconnect;
        if (limitReconnect == 0 || (limitReconnect > 0 && this._curAutoReconnect >= limitReconnect)) {
            this._connectOptions.tips?.manualReconnect();
        } else {
            if (limitReconnect > 0) ++this._curAutoReconnect;
            this._connectOptions.tips?.showReconnecting(true);
            this._reconnectTimer = setTimeout(() => {
                this._connectOptions.tips?.showReconnecting(false);
                this.asyncConnect(this._connectOptions, this._connectedCB);
            }, this._connectOptions.reconnectTime * 1000);
        }
    }

    on(cmd: number, callback: Function, target: any) {
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

    off(cmd: number, callback: Function, target: any) {
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
            
            this.send(this._connectOptions.getHeartbeat());
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
