/**
 * 调试日志管理
 * @author Mortal-Li
 * @created 2022年9月30日
 */

import fw from "../fw";
import CocosHelper from "../tools/CocosHelper";
import TimeHelper from "../tools/TimeHelper";


export default class DebugManger {

    init() {
        let oldLog = cc.log;
        cc.log = (msg: string | any, ...subst) => {
            oldLog(`[${TimeHelper.getCurDetailTime()}]`, msg, ...subst);
        };

        let oldErr = cc.error;
        cc.error = (msg: string | any, ...subst) => {
            oldErr(`[${TimeHelper.getCurDetailTime()}]`, msg, ...subst);
        };

        let oldWarn = cc.warn;
        cc.warn = (msg: string | any, ...subst) => {
            oldWarn(`[${TimeHelper.getCurDetailTime()}]`, msg, ...subst);
        };
    }

    /**
     * 当不方便查看log时，可以启动此开关，比如已发布的线上游戏
     */
    switchDebugLogBtn() {
        let logBtn = fw.godNode.getChildByName("logBtn");
        if (logBtn) logBtn.active = !logBtn.active;
        else this._initLogPanel();
    }

    private _initLogPanel() {
        let logPanel = new cc.Node();
        fw.godNode.addChild(logPanel, 9998);
    
        CocosHelper.addSprite(logPanel, { spriteFrame: CocosHelper.genPureColorSpriteFrame() });
        logPanel.setContentSize(cc.winSize);
        logPanel.opacity = 180;
    
        let content = new cc.Node();
        content.anchorY = 1;
        content.parent = logPanel;
        CocosHelper.addWidget(content, { top: 0 });
        CocosHelper.addLayout(content, { type: cc.Layout.Type.VERTICAL });
    
        let scv = logPanel.addComponent(cc.ScrollView);
        scv.horizontal = false;
        scv.vertical = true;
        scv.bounceDuration = 0.23;
        scv.brake = 0.75;
        scv.content = content;
        
        const addLblNode = (msg: string, clr?: cc.Color) => {
            let nd = new cc.Node();
            CocosHelper.addLabel(nd, {
                string: msg,
                fontSize: 24,
                color: clr,
                overflow: cc.Label.Overflow.RESIZE_HEIGHT
            });
            nd.width = cc.winSize.width - 20;
            nd.parent = content;
        }
    
        let oldLog = cc.log;
        cc.log = (msg: string | any, ...subst) => {
            oldLog(msg, ...subst);
            addLblNode(JSON.stringify(msg) + '\n' + JSON.stringify(subst));
        }
    
        let oldErr = cc.error;
        cc.error = (msg: string | any, ...subst) => {
            oldErr(msg, ...subst);
            addLblNode(JSON.stringify(msg) + '\n' + JSON.stringify(subst), cc.Color.RED);
        }
    
        let oldWarn = cc.warn;
        cc.warn = (msg: string | any, ...subst) => {
            oldWarn(msg, ...subst);
            addLblNode(JSON.stringify(msg) + '\n' + JSON.stringify(subst), cc.Color.ORANGE);
        }
    
        logPanel.active = false;
    
        let logBtn = new cc.Node("logBtn");
        logBtn.anchorX = 1;
        logBtn.x = cc.winSize.width / 2;
        CocosHelper.addLabel(logBtn, {
            string: "DEBUG",
            fontSize: 30,
            color: cc.Color.ORANGE,
            enableBold: true
        });
        
        fw.godNode.addChild(logBtn, 9999);
        logBtn.addComponent(cc.Button);
        logBtn.on("click", () => {
            logPanel.active = !logPanel.active;
        });
    
        let clearBtn = new cc.Node();
        clearBtn.setPosition(cc.winSize.width * 0.5 - 100, -cc.winSize.height * 0.5 + 100);
        CocosHelper.addLabel(clearBtn, {
            string: "Clean",
            fontSize: 30,
            color: cc.Color.YELLOW,
            enableBold: true
        });
        
        logPanel.addChild(clearBtn);
        clearBtn.addComponent(cc.Button);
        clearBtn.on("click", () => {
            content.removeAllChildren();
        });
    }
};
