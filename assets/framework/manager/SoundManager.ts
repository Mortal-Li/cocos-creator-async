/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

export default class SoundManager {

    private _bundle: string = "";
    private _path: string = "";

    /**
     * 指定声音资源默认路径和所属bundle
     */
    prepare(bundleStr: string, pathStr: string) {
        let T = this;
        T._bundle = bundleStr;
        T._path = pathStr;
    }
    
    /**
     * 播放音乐
     * @param musicName 音乐名字
     * @param bundleName 资源所属bundle，可选
     * @param loop 是否循环，默认true
     * @returns 异步返回audioID
     */
    playMusicAsync(musicName: string, bundleName?: string, loop: boolean = true) {
        return new Promise<number>((resolve, reject) => {
            let bundle = cc.assetManager.getBundle(bundleName ? bundleName : this._bundle);
            if (!bundle) {
                cc.warn("Bundle not found!");
                reject();
                return;
            }

            bundle.load(this._path + musicName, (err, audio: cc.AudioClip) => {
                if (err) {
                    cc.warn(err);
                    reject();
                    return;
                }

                this.stopMusic();
                let audioID = cc.audioEngine.playMusic(audio, loop);
                resolve(audioID);
            });
        });
    }

    /**
     * 播放音乐直到播完
     * @param musicName 音乐名字
     * @param bundleName 资源所属bundle，可选
     */
    playMusicUntilFinishAsync(musicName: string, bundleName?: string) {
        return new Promise<void>((resolve, reject) => {
            this.playMusicAsync(musicName, bundleName, false).then((audioID: number) => {
                cc.audioEngine.setFinishCallback(audioID, resolve);
            }).catch(reject);
        });
    }

    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    pauseMusic() {
        cc.audioEngine.pauseMusic();
    }

    resumeMusic() {
        cc.audioEngine.resumeMusic();
    }

    isMusicPlaying() {
        return cc.audioEngine.isMusicPlaying();
    }

    /**
     * 播放音效
     * @param effectName 音效名字
     * @param bundleName 资源所属bundle，可选
     * @param loop 是否循环，默认false
     * @returns 异步返回audioID
     */
    playEffectAsync(effectName: string, bundleName?: string, loop: boolean = false) {
        return new Promise<number>((resolve, reject) => {
            let bundle = cc.assetManager.getBundle(bundleName ? bundleName : this._bundle);
            if (!bundle) {
                cc.warn("Bundle not found!");
                reject();
                return;
            }

            bundle.load(this._path + effectName, (err, audio: cc.AudioClip) => {
                if (err) {
                    cc.warn(err);
                    reject();
                    return;
                }

                let audioID = cc.audioEngine.playEffect(audio, loop);
                resolve(audioID);
            });
        });
    }

    /**
     * 播放音效直到播完
     * @param effectName 音效名字
     * @param bundleName 资源所属bundle，可选
     */
    playEffectUntilFinishAsync(effectName: string, bundleName?: string) {
        return new Promise<void>((resolve, reject) => {
            this.playEffectAsync(effectName, bundleName, false).then((audioID: number) => {
                cc.audioEngine.setFinishCallback(audioID, resolve);
            }).catch(reject);
        });
    }

    stopEffect(audioID: number) {
        cc.audioEngine.stopEffect(audioID);
    }

    stopAllEffects() {
        cc.audioEngine.stopAllEffects();
    }

    stopAll() {
        cc.audioEngine.stopAll();
    }

    pauseEffect(audioID: number) {
        cc.audioEngine.pauseEffect(audioID);
    }

    resumeEffect(audioID: number) {
        cc.audioEngine.resumeEffect(audioID);
    }

    setMusicVolume(v: number) {
        cc.audioEngine.setMusicVolume(v);
    }

    setEffectsVolume(v: number) {
        cc.audioEngine.setEffectsVolume(v);
    }

    /**
     * 设置是否静音，true为静音
     * @param isMute 
     */
    setMute(isMute: boolean) {
        cc.audioEngine.setMusicVolume(isMute ? 0 : 1);
        cc.audioEngine.setEffectsVolume(isMute ? 0 : 1);
    }

    /**
     * 是否静音背景音乐
     */
    setMusicMute(isMute: boolean) {
        cc.audioEngine.setMusicVolume(isMute ? 0 : 1);
    }

    /**
     * 是否静音音效
     */
    setEffectMute(isMute: boolean) {
        cc.audioEngine.setEffectsVolume(isMute ? 0 : 1);
    }
    
}
