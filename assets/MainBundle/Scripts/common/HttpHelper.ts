/**
 * 对HttpManager进行项目相关的封装
 * @author Mortal-Li
 * @created 2021年9月22日
 */

import ceo from "../../../sparrow/ceo";
import Loading from "../Loading";
import GameData from "./GameData";
import { TxtConst } from "./MainConst";
import Util from "./Util";


const GAME_URL = "";   //http://xxxx  https://xxxx

export const HttpDef = {
    Login: "xxxxx",
};

interface ReqOptionInterface {
    /**
     * 是否尝试重新请求 默认true
     */
    needRetry?: boolean;
    /**
     * 是否显示loading 默认true
     */
    needLoading?: boolean;
    /**
     * 当网络请求出错时，是否退出游戏 默认false
     */
    needQuit?: boolean;
}

class HttpHelper {

    req(router: string, data: any = {}, option?: ReqOptionInterface) {

        data["_timestamp"] = Date.now().toString();
        if (GameData.id) {
            data["id"] = GameData.id;
            data["token"] = GameData.token;
        }
        
        const defaultOption = {
            needRetry: true,
            needLoading: true,
            needQuit: false,
        }

        if (option) {
            option = {
                ...defaultOption,
                ...option,
            };
        } else {
            option = defaultOption;
        }
        
        return this._req(GAME_URL + router, data, option);
    }

    private _req(url: string, data: any, option: ReqOptionInterface) {
        return new Promise<any>((resolve, reject) => {
            ceo.httpMgr.request(url, data, {
                show: ()=>{
                    if (option.needLoading) Loading.show();
                },
                hide: ()=>{
                    if (option.needLoading) Loading.hide();
                }
            })
            .then((recv: any) => {
                resolve(recv);

            })
            .catch((err: any)=>{
                if (option.needRetry) {
                    Util.showCommonPopup({
                        title: TxtConst.NetTipTitle,
                        msg: TxtConst.NetTipMsg,
                        btnCallOK: () => {
                            this._req(url, data, option);
                        },
                        btnTxtOK: TxtConst.Retry,
                        btnCallNO: () => {
                            reject(err);
                            if (option.needQuit) {
                                cc.game.end();
                            }
                        }
                    });
                    
                } else {
                    Util.showToast(err);
                    reject(err);
                }
            });
        });
    }
}

export const httpHelper = new HttpHelper();
