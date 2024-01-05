/**
 * 
 * @author Mortal-Li
 * @created 2021年12月6日
 */

import PopupBase from "../../framework/ui/PopupBase";
import wTableView from "../../framework/widget/wTableView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TableViewPopup extends PopupBase {

    @property(wTableView)
    vtcTV: wTableView = null;

    @property(wTableView)
    hrzTV: wTableView = null;

    numOfVtc: number = 20;
    numOfHrz: number = 12;

	onLoad() {
	
	}

    start () {
        let T = this;

        T.vtcTV.refreshData(T.numOfVtc);
        T.hrzTV.refreshData(T.numOfHrz);
    }

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        let T = this;

        switch (name) {
            case "close":
                T.close();
                break;

            case "add5":
                T.numOfVtc += 5;
                T.vtcTV.refreshData(T.numOfVtc);
                break;

            case "del5":
                T.numOfVtc -= 5;
                T.numOfVtc = Math.max(0, T.numOfVtc);
                T.vtcTV.refreshData(T.numOfVtc);
                break;

            case "add5h":
                T.numOfHrz += 5;
                T.hrzTV.refreshData(T.numOfHrz);
                break;

            case "del5h":
                T.numOfHrz -= 5;
                T.numOfHrz = Math.max(0, T.numOfHrz);
                T.hrzTV.refreshData(T.numOfHrz);
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
