/**
 * 
 * @author Mortal-Li
 * @created 2022年5月7日
 */

import ceo from "../../../sparrow/ceo";

export const CMDID = {
     CMD_HELLO: 1000,
};

class SocketCenter {

    private tips = {
        showConnecting: (isShow: boolean) => {
            if (isShow) cc.log("net is connecting!");
        },
        showReconnecting: (isShow: boolean) => {
            if (isShow) cc.log("net is reconnecing!");
        },
        showRequesting: (isShow: boolean) => {
            if (isShow) cc.log("send request...");
        },
        manualReconnect: () => {
            cc.log("need reconnect manually!");
        }
    }
    
    async connect(url: string) {
        await ceo.socketMgr.asyncConnect({
            url: url,
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
        ceo.socketMgr.close(true);
    }

    on(cmd: number, callback: Function, target: any) {
        ceo.socketMgr.on(cmd, callback, target);
    }

    off(cmd: number, callback: Function, target: any) {
        ceo.socketMgr.off(cmd, callback, target);
    }

    async req(cmd: number, args?: any) {
        let content: string = "";

        switch (cmd) {
            case CMDID.CMD_HELLO:
                content = "Hello~" + args;
                break;
        }
        cc.log("-----------> send ", content);
        return await ceo.socketMgr.asyncReq(cmd, JSON.stringify({
            cmd: cmd,
            data: content
        }));
    }
    
    
}


export const socketCenter = new SocketCenter();