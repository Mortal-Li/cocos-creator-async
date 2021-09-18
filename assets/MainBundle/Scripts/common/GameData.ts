/**
 * 
 * @author Mortal-Li
 * @created 2021年9月18日
 */

 class GameData {

    id: number;
    token: string;
    
    nickname: string = "Guest";
    avatar: string = "";
    level: number = 0;
    gems: number = 888;

    music_switch: boolean = true;
    effect_switch: boolean = true;
}

export default new GameData();
