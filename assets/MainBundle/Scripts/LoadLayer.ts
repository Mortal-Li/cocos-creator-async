/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

import { LayerConf } from "../../Boot/Scripts/AssetConfig";
import fw from "../../framework/fw";
import AsyncHelper from "../../framework/tools/AsyncHelper";
import LayerBase from "../../framework/ui/LayerBase";
import GameData from "./common/GameData";
import { SoundID, LocalKey } from "./common/MainConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadLayer extends LayerBase {
    
    @property(cc.ProgressBar)
    pb: cc.ProgressBar = null;

    onLoad () {
        fw.soundMgr.prepare(SoundID.Bundle, SoundID.Path);
        const musicState = fw.localMgr.getItemWithDefault(LocalKey.Switch_Music, true);
        const effectState = fw.localMgr.getItemWithDefault(LocalKey.Switch_Effect, true);
        fw.soundMgr.setMusicMute(!musicState);
        fw.soundMgr.setEffectMute(!effectState);
        GameData.music_switch = musicState;
        GameData.effect_switch = effectState;
    }

    async start () {
        // net req、res load ...
        
        await AsyncHelper.tweenAsync(this.pb, cc.tween().to(1, { progress: 0.5 }));

        // ...
        // ...
        // ...

        await fw.uiMgr.preLoadLayerAsync(LayerConf.Hall, (cur, total) => {
            this.pb.progress = 0.5 + cur / total * 0.5;
        });

        fw.uiMgr.goLayerAsync(LayerConf.Hall);
    }

}
