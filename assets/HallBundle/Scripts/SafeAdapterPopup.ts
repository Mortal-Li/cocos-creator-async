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
	
        this.getUIObj("info", cc.Label).string = `design w:${cc.view.getDesignResolutionSize().width} h:${cc.view.getDesignResolutionSize().height}
        cc.winSize w:${cc.winSize.width} h:${cc.winSize.height}
        visible w:${cc.view.getVisibleSize().width} h:${cc.view.getVisibleSize().height}
        frame w:${cc.view.getFrameSize().width} h:${cc.view.getFrameSize().height}
        god w:${ceo.godNode.width} h:${ceo.godNode.height}
        safe w:${cc.sys.getSafeAreaRect().width} h:${cc.sys.getSafeAreaRect().height} x:${cc.sys.getSafeAreaRect().x} y:${cc.sys.getSafeAreaRect().y}`;
	}

    start () {
        
    }

    onBtnClick(evt: cc.Event.EventTouch, name: string): void {
        let T = this;

        switch (name) {
            case "switch":
                T.getUIObj("top" + T.preIdx).active = false;
                T.preIdx = (T.preIdx + 1) % 4;
                T.getUIObj("top" + T.preIdx).active = true;

                break;

            case "back":
                T.close();
                break;
        }
    }

}
