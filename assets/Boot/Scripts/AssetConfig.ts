/**
 * 
 * @author Mortal-Li
 * @created 2021年9月2日
 */

 import { UIConfigInterface } from "../../sparrow/ui/UIConfig";

 export const BundleConf = {
     Main : "MainBundle",
     Hall: "HallBundle",
     GameA: "GameABundle",
     GameB: "GameBBundle",
 };
 
 export const LayerConf = {
     Load: <UIConfigInterface> {
         bundle: BundleConf.Main,
         name: "LoadLayer",
     },
 
     Hall: <UIConfigInterface> {
         bundle: BundleConf.Hall,
         name: "HallLayer",
         stay: true,
     },
 
     GameA: <UIConfigInterface> {
         bundle: BundleConf.GameA,
         name: "GameALayer",
     },
     
     GameB: <UIConfigInterface> {
         bundle: BundleConf.GameB,
         name: "GameBLayer",
     },
 
 };
 
 export const PopupConf = {
     //********** Main **********/
     Common: <UIConfigInterface> {
         bundle: BundleConf.Main,
         name: "CommonPopup",
     },
 
     //********** Hall **********/
     Settings: <UIConfigInterface> {
         bundle: BundleConf.Hall,
         name: "SettingsPopup",
     },
 
     //********** GameA **********/
     GameAHelperPopup: <UIConfigInterface> {
         bundle: BundleConf.GameA,
         name: "GameAHelperPopup"
     },

     //********** GameB **********/
     GameBItemPopup: <UIConfigInterface> {
         bundle: BundleConf.GameB,
         name: "GameBItemPopup"
     },
 };
