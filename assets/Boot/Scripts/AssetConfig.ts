/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

 import { IUIConfig } from "../../sparrow/ui/UIConfig";

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
         stay: true,
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
         stay: true
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
        stay: true
    }
}