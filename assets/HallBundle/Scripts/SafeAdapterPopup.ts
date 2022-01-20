/**
 * 
 * @author Mortal-Li
 * @created 
 */

import ceo from "../../sparrow/ceo";
import PopupBase from "../../sparrow/ui/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SafeAdapterPopup extends PopupBase {

    private preIdx = 0;

	onLoad() {
	
	}

    start () {
        
    }

    onBtnClick(evt: cc.Event.EventTouch, name: string): void {
        let T = this;

        switch (name) {
            case "switch":
                T.getUIObj("top" + T.preIdx).active = false;
                T.preIdx = (T.preIdx + 1) % 5;
                T.getUIObj("top" + T.preIdx).active = true;

                break;

            case "back":
                T.close();
                break;

            case "back2":
                T.getUIObj("safeBg").active = false;
                break;

            case "safe":
                let safeBg = T.getUIObj("safeBg");
                safeBg.active = true;

                let box = safeBg.getContentSize();

                this.getUIObj("safeBg.info", cc.Label).string = `design w:${cc.view.getDesignResolutionSize().width} h:${cc.view.getDesignResolutionSize().height}
cc.winSize w:${cc.winSize.width} h:${cc.winSize.height}
visible w:${cc.view.getVisibleSize().width} h:${cc.view.getVisibleSize().height}
frame w:${cc.view.getFrameSize().width} h:${cc.view.getFrameSize().height}
god w:${ceo.godNode.width} h:${ceo.godNode.height}
safe w:${cc.sys.getSafeAreaRect().width} h:${cc.sys.getSafeAreaRect().height} x:${cc.sys.getSafeAreaRect().x} y:${cc.sys.getSafeAreaRect().y}
box w:${box.width} h:${box.height} x:${T.node.width/2 + safeBg.x - safeBg.width * safeBg.anchorX} y:${T.node.height/2 + safeBg.y - safeBg.height * safeBg.anchorY}`;

                T.scheduleOnce(()=>{
                    let left = T.node.width/2 + safeBg.x - safeBg.width * safeBg.anchorX;
                    let bottom = T.node.height/2 + safeBg.y - safeBg.height * safeBg.anchorY;
                    let top = T.node.height - safeBg.height - bottom;
                    let right = T.node.width - safeBg.width - left;
                    T.getUIObj("safeBg.desc", cc.Label).string = `box2 top:${top} bottom:${bottom} left:${left} right:${right}`;
                });

                break;
        }
    }

}
