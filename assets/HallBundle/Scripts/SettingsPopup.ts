/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import GameData from "../../MainBundle/Scripts/common/GameData";
import { LocalKey } from "../../MainBundle/Scripts/common/MainConst";
import fw from "../../framework/fw";
import PopupBase from "../../framework/ui/PopupBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingsPopup extends PopupBase {
    
    @property(cc.Toggle)
    musicTgl: cc.Toggle = null;

    @property(cc.Toggle)
    effectTgl: cc.Toggle = null;

    onLoad () {
        let T = this;

        T.musicTgl.isChecked = GameData.music_switch;
        T.effectTgl.isChecked = GameData.effect_switch;

        T.enableClickBlankToClose([T.getObj("bg")]);
    }

    start () {

    }

    onDestroy() {
        fw.localMgr.setItem(LocalKey.Switch_Music, GameData.music_switch);
        fw.localMgr.setItem(LocalKey.Switch_Effect, GameData.effect_switch);
        super.onDestroy();
    }

    onBtnClick(evt: cc.Event.EventTouch, name: string) {
        switch (name) {
            case "close":
                this.close();
                break;
        }
    }


    onToggle(toggle: cc.Toggle, name: string) {
        let v = toggle.isChecked ? 1 : 0;
        if (name == "music") {
            fw.soundMgr.setMusicVolume(v);
            GameData.music_switch = toggle.isChecked;
        } else {
            fw.soundMgr.setEffectsVolume(v);
            GameData.effect_switch = toggle.isChecked;
        }
        
    }
}
