/**
 * 
 * @author Mortal-Li
 * @created 2021年12月6日
 */

import PopupBase from "../../sparrow/ui/PopupBase";
import wTableView from "../../sparrow/widget/wTableView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TableViewPopup extends PopupBase {

    @property(wTableView)
    vtcTV: wTableView = null;

    @property(wTableView)
    hrzTV: wTableView = null;

	onLoad() {
	
	}

    start () {
        let T = this;

        T.vtcTV.refreshData(20);
        T.hrzTV.refreshData(12);
    }

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        let T = this;

        switch (name) {
            case "close":
                T.close();
                break;
        }
    }

    vtcUpdateCell(cell: cc.Node, idx: number, customData: string) {
        cell.getChildByName("ord").getComponent(cc.Label).string = 'NO.' + (idx + 1);
        cell.color = cc.color().fromHEX(idx % 2 == 0 ? "#F1A07D" : "#7DB7F1");
    }

    hrzUpdateCell(cell: cc.Node, idx: number, customData: string) {
        cell.getChildByName("ord").getComponent(cc.Label).string = '' + (idx + 1);
        cell.color = cc.color().fromHEX(idx % 2 == 0 ? "#F1A07D" : "#7DB7F1");
    }
}
