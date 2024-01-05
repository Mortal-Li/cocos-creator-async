/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

import { IUIConfig, UICacheMode } from "../../framework/ui/UIConfig";

export const BundleConf = {
    Main : "MainBundle",
    Hall: "HallBundle",
    GameA: "GameABundle",
};

export const LayerConf = {
    Load: <IUIConfig> {
        bundle: BundleConf.Main,
        name: "LoadLayer",
    },

    Hall: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "HallLayer",
        cacheMode: UICacheMode.Stay,
    },

    GameA: <IUIConfig> {
        bundle: BundleConf.GameA,
        name: "GameALayer",
    },

};

export const PopupConf = {
    //********** Main **********/
    Common: <IUIConfig> {
        bundle: BundleConf.Main,
        name: "CommonPopup",
        cacheMode: UICacheMode.Cache
    },

    //********** Hall **********/
    Settings: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "SettingsPopup",
    },

    TableView: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "TableViewPopup",
    },

    SafeAdapter: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "SafeAdapterPopup",
    },

    QuadTree: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "QuadTreePopup",
    },

    Socket: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "SocketPopup",
    },

    //********** GameA **********/
    GameAHelperPopup: <IUIConfig> {
        bundle: BundleConf.GameA,
        name: "GameAHelperPopup"
    },

};


export const PanelConf = {
    Test: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "TestPanel"
    },

    Game: <IUIConfig> {
        bundle: BundleConf.Hall,
        name: "GamePanel"
    },
};

export const WidgetConf = {
    Toast: <IUIConfig> {
        bundle: BundleConf.Main,
        name: "Toast",
        cacheMode: UICacheMode.Cache
    }
}