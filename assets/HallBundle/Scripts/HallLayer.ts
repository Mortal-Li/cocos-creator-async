/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { PanelConf } from "../../Boot/Scripts/AssetConfig";
import GameData from "../../MainBundle/Scripts/common/GameData";
import { GameCustomEvent } from "../../MainBundle/Scripts/common/MainConst";
import kk from "../../framework/kk";
import { doOnceFirst } from "../../framework/tools/Decorators";
import LayerBase from "../../framework/ui/LayerBase";
import SpriteNumber from "../../framework/widget/SpriteNumber";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallLayer extends LayerBase {

    onLoad () {
        this.getObj("bar.lo.sprNum", SpriteNumber).value = GameData.gems;
        kk.eventMgr.on(GameCustomEvent.Update_GEM, this.updateGems, this);
    }

    start () {
        this.doPanelChange(true);
    }

    refresh() {
        this.start();
    }

    @doOnceFirst(0.8)
    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        let T = this;

        switch (name) {
            case "test":
                T.doPanelChange(true);
                break;
        
            case "game":
                T.doPanelChange(false);
                break;
        }
    }

    async doPanelChange(isTest: boolean) {
        let T = this;

        T.getObj("btn_test").color = cc.color().fromHEX(isTest ? "#5AC5F2" : "#32A0CF");
        T.getObj("btn_game").color = cc.color().fromHEX(isTest ? "#32A0CF" : "#5AC5F2");

        let panel = T.getObj("panel");
        panel.destroyAllChildren();

        let pnl = await kk.uiMgr.createPanelAsync(isTest ? PanelConf.Test : PanelConf.Game);
        pnl.parent = panel;
    }

    updateGems(numVar: number, doAnim: boolean = false) {
        if (doAnim) this.getObj("bar.lo.sprNum", SpriteNumber).numVarTween(GameData.gems, GameData.gems + numVar, Math.floor);
        else this.getObj("bar.lo.sprNum", SpriteNumber).value = GameData.gems + numVar;
        GameData.gems += numVar;
    }
}
