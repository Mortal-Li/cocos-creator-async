/**
 * 日志查看开关管理，当不方便查看log时，可以启动此开关，比如已发布的线上游戏
 * @author Mortal-Li
 * @created 2022年9月30日
 */

import ceo from "../ceo";


export default class LogManager {

    switchDebugLogBtn() {
        let logBtn = ceo.godNode.getChildByName("logBtn");
        if (logBtn) {
            logBtn.active = !logBtn.active;
        } else {
            this.initLogPanel();
        }
    }

    private initLogPanel() {
        let logPanel = new cc.Node();
        logPanel.setContentSize(cc.winSize);
        ceo.godNode.addChild(logPanel, 9998);
    
        let spr = logPanel.addComponent(cc.Sprite);
        let ttx = new cc.Texture2D();
        ttx.initWithData(new Uint8Array([0, 0, 0]), cc.Texture2D.PixelFormat.RGB888, 1, 1);
        let sprFrm = new cc.SpriteFrame();
        sprFrm.setTexture(ttx);
        sprFrm.setRect(cc.rect(0, 0, cc.winSize.width, cc.winSize.height));
        spr.spriteFrame = sprFrm;
    
        logPanel.opacity = 180;
    
        let content = new cc.Node();
        content.anchorY = 1;
        content.parent = logPanel;
        let wgt = content.addComponent(cc.Widget);
        wgt.isAlignTop = true;
        wgt.top = 0;
        let lo = content.addComponent(cc.Layout);
        lo.type = cc.Layout.Type.VERTICAL;
        lo.resizeMode = cc.Layout.ResizeMode.CONTAINER;
    
        let scv = logPanel.addComponent(cc.ScrollView);
        scv.horizontal = false;
        scv.vertical = true;
        scv.bounceDuration = 0.23;
        scv.brake = 0.75;
        scv.content = content;
        
        const addLbl = (msg: string, clrIdx?: number) => {
            let nd = new cc.Node();
            if (clrIdx) {
                if (clrIdx == 1) nd.color = cc.Color.RED;
                else nd.color = cc.Color.ORANGE;
            }
            let lbl = nd.addComponent(cc.Label);
            lbl.fontSize = lbl.lineHeight = 24;
            lbl.string = msg;
            lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            lbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            lbl.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            nd.width = cc.winSize.width - 20;
            nd.parent = content;
        }
    
        let oldLog = cc.log;
        cc.log = (msg: string | any, ...subst) => {
            oldLog(msg, ...subst);
            addLbl(JSON.stringify(msg) + '\n' + JSON.stringify(subst));
        }
    
        let oldErr = cc.error;
        cc.error = (msg: string | any, ...subst) => {
            oldErr(msg, ...subst);
            addLbl(JSON.stringify(msg) + '\n' + JSON.stringify(subst), 1);
        }
    
        let oldWarn = cc.warn;
        cc.warn = (msg: string | any, ...subst) => {
            oldWarn(msg, ...subst);
            addLbl(JSON.stringify(msg) + '\n' + JSON.stringify(subst), 2);
        }
    
        logPanel.active = false;
    
        let logBtn = new cc.Node("logBtn");
        logBtn.color = cc.Color.ORANGE;
        logBtn.anchorX = 1;
        logBtn.x = cc.winSize.width / 2;
        let lbl = logBtn.addComponent(cc.Label);
        lbl.fontSize = lbl.lineHeight = 30;
        lbl.string = "DEBUG";
        lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        lbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
        lbl.enableBold = true;
        ceo.godNode.addChild(logBtn, 9999);
        logBtn.addComponent(cc.Button);
        logBtn.on("click", () => {
            logPanel.active = !logPanel.active;
        });
    
        let clearBtn = new cc.Node();
        clearBtn.color = cc.Color.YELLOW;
        clearBtn.setPosition(cc.winSize.width * 0.5 - 100, -cc.winSize.height * 0.5 + 100);
        let lbl2 = clearBtn.addComponent(cc.Label);
        lbl2.fontSize = lbl.lineHeight = 30;
        lbl2.string = "Clean";
        lbl2.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        lbl2.verticalAlign = cc.Label.VerticalAlign.CENTER;
        lbl2.enableBold = true;
        logPanel.addChild(clearBtn);
        clearBtn.addComponent(cc.Button);
        clearBtn.on("click", () => {
            content.removeAllChildren();
        });
    }
};
