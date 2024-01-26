/**
 * 对SocketManager进行项目相关的封装 DEMO
 * @author Mortal-Li
 * @created 2022年5月7日
 */

import fw from "../../../framework/fw";

export const CMDID = {
     CMD_HELLO: 1000,
};

class SocketCenter {

    private tips = {
        showConnecting: (isShow: boolean) => {
            
        },
        showReconnecting: (isShow: boolean) => {
            
        },
        showRequesting: (isShow: boolean) => {
            
        },
        manualReconnect: () => {
            
        }
    }
    
    async connect(url: string) {
        await fw.socketMgr.connectAsync({
            url: url,
            getHeartbeat: () => {
                cc.log(">>> heartbeat")
                return "";
            },
            parseNetData: (data: any) => {
                return {
                    cmd: CMDID.CMD_HELLO,
                    content: data
                }
            },
            tips: this.tips
        });
    }

    clear() {
        fw.socketMgr.close(true);
    }

    on(cmd: number, callback: (data: any) => void, target: any) {
        fw.socketMgr.on(cmd, callback, target);
    }

    off(cmd: number, callback: (data: any) => void, target: any) {
        fw.socketMgr.off(cmd, callback, target);
    }

    async req(cmd: number, args?: any) {
        let content: string = "";

        switch (cmd) {
            case CMDID.CMD_HELLO:
                content = "Hello~" + args;
                break;
        }
        cc.log("---> send ", content);
        return await fw.socketMgr.reqAsync(cmd, JSON.stringify({
            cmd: cmd,
            data: content
        }));
    }
    
    
}


export const socketCenter = new SocketCenter();