/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

export default class SoundManager {

    private _bundle: string = "";
    private _path: string = "";

    private _curBgMusicName: string;

    prepare(bundleStr: string, pathStr: string) {
        let T = this;
        T._bundle = bundleStr;
        T._path = pathStr;
    }
    
    playMusic(musicName: string, loop: boolean = true) {
        let T = this;

        const bundle = cc.assetManager.getBundle(T._bundle);
        if (!bundle) return;

        bundle.load(T._path + musicName, (err, audio: cc.AudioClip) => {
            if (err) {
                cc.log(err);
                return;
            }

            T.stopMusic();
            let id = cc.audioEngine.playMusic(audio, loop);
            if (id != null && id != undefined) {
                T._curBgMusicName = musicName;
            }
        });
    }

    stopMusic() {
        let T = this;
        if (T._curBgMusicName) {
            cc.audioEngine.stopMusic();
            T._curBgMusicName = null;
        }
    }

    pauseMusic() {
        let T = this;
        if (T._curBgMusicName) {
            cc.audioEngine.pauseMusic();
        }
    }

    resumeMusic() {
        let T = this;
        if (T._curBgMusicName) {
            cc.audioEngine.resumeMusic();
        }
    }

    playEffect(effectName: string, loop: boolean = false) {
        let T = this;

        const bundle = cc.assetManager.getBundle(T._bundle);
        if (!bundle) return;

        bundle.load(T._path + effectName, (err, audio: cc.AudioClip) => {
            if (err) {
                cc.log(err);
                return;
            }

            cc.audioEngine.playEffect(audio, loop);
        });
    }

    stopAll() {
        cc.audioEngine.stopAll();
        this._curBgMusicName = null;
    }

    setMusicVolume(v: number) {
        cc.audioEngine.setMusicVolume(v);
    }

    setEffectsVolume(v: number) {
        cc.audioEngine.setEffectsVolume(v);
    }
}
