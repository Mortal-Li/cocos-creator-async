/**
 * 
 * @author Mortal-Li
 * @created 2024年1月30日
 */

import AsyncHelper from "../../framework/tools/AsyncHelper";
import PopupBase from "../../framework/ui/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FramingPopup extends PopupBase {

    @property(cc.ScrollView)
    private scv: cc.ScrollView = null;

    private cpyObj: cc.Node = null;
    
    onLoad () {
        this.cpyObj = this.getObj("box");
    }

    start () {

    }

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        switch (name) {
            case "normal":
                this.showNormal(600);
                break;

            case "frame":
                this.showFrame(600);
                break;

            case "clean":
                this.scv.content.destroyAllChildren();
                break;

            case "close":
                this.close();
                break;
        }
    }

    addOne(i: number) {
        let one = cc.instantiate(this.cpyObj);
        one.active = true;
        one.parent = this.scv.content;
        one.getChildByName("txt").getComponent(cc.Label).string = String(i);
    }

    showNormal(total: number) {
        this.scv.content.destroyAllChildren();
        for (let i = 0; i < total; ++i) {
            this.addOne(i + 1);
        }
    }

    showFrame(total: number) {
        this.scv.content.destroyAllChildren();
        AsyncHelper.execPerFrameAsync(this.genItem(total), 5);
    }

    *genItem(total: number) {
        for (let i = 0; i < total; ++i) {
            yield this.addOne(i + 1);
        }
    }
}
