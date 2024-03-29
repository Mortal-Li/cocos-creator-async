## <center>Cocos-Creator-Async</center>
<center>

![Def](https://img.shields.io/badge/cocos--creator-2.4.x-blue)
![GitHub](https://img.shields.io/github/license/Mortal-Li/cocos-creator-async)
![GitHub last commit](https://img.shields.io/github/last-commit/Mortal-Li/cocos-creator-async)

</center>

Cocos-Creator-Async是一个基于Cocos-creator的轻量级的、异步的、高效的游戏开发框架，它主要有以下特征：
- 单场景、多Layer的UI结构，自动内存管理；
- 大部分API都是异步的，代码更直观高效；
- 使用引擎的Bundle思想来管理游戏代码和资源
- 提供常用的功能模块和通用的解决方案（不需要的功能模块可自行删除）
- 配合插件 **kk-helper** 使用，效率更高

希望能用更简洁的代码提供更效率的开发体验，故起别名kk，寓意“快快”。

**简要声明**：
- 本项目基于 Cocos Creator 2.4.x。
- 本项目使用 *MIT License* 开源协议，主要供读者学习参考。
- `后期将主要修改优化Cocos Creator 3.x版本，2.x官方支持越来越少，所以本仓库也将维护越来越少`

### 基本使用指南
#### 1、UI结构说明

本框架UI基于单场景，在单场景下，有4种类型的UI界面容器：
- Layer：层，用于从一个界面切换到另一个界面，界面元素的主要载体；
- Popup：弹窗，在当前界面弹出一个界面展示窗体；
- Panel：面板，即可用于Layer也可用于Popup，相当于嵌入其中的子视图；
- Widget：控件，主要指一些通用的小的UI模块或功能性挂件；

#### 2、资源目录说明
```
assets
├───Boot
│   ├───Scripts
│   │   ├───AssetConfig.ts -------> 记录不同预制体的配置脚本(也可以分散在各bundle)
│   └───Stage.fire ---------------> 主场景
├───GameABundle --------------> GameA Bundle 优先级 1
│   ├───Prefabs
│   │   ├───Layer ------------> Layer预制体
│   │   ├───Panel ------------> Panel预制体
│   │   ├───Popup ------------> Popup预制体
│   │   └───Widget -----------> Widget预制体
│   ├───Scripts --------------> GameA 相关脚本
│   └───Textures -------------> GameA 相关资源
├───GameBBundle --------------> GameB Bundle 优先级 1
│   ├───Prefabs
│   │   ├───Layer
│   │   ├───Panel
│   │   ├───Popup
│   │   └───Widget
│   ├───Scripts
│   └───Textures
├───HallBundle -------------------> 大厅 bundle 优先级 3
│   ├───Prefabs
│   │   ├───Layer
│   │   ├───Panel
│   │   ├───Popup
│   │   └───Widget
│   ├───Scripts
│   └───Textures
├───MainBundle -------------------> 主要 bundle 优先级 5，主要是一些通用的模块和资源
│   ├───Prefabs
│   │   ├───Layer
│   │   ├───Panel
│   │   ├───Popup
│   │   └───Widget
│   ├───Scripts
│   │   └───common ---------------> 一些通用脚本
│   ├───Sounds -------------------> 项目音频资源(也可分散在各bundle)
│   └───Textures -----------------> 通用资源
└───framework --------------------> 框架代码所在
    ├───manager ------------------> 一些管理类，如自定义事件分发、UI控制管理、本地存储等
    ├───tools --------------------> 一些工具类，如通用加密、装饰器等
    ├───ui -----------------------> 主要是对4种UI界面类型的封装
    ├───widget -------------------> 一些通用控件或组件，如TableView、适配组件等
    └───kk.ts --------------------> 控制UI树根节点，管理所有manager
```
#### 3、UI创建示范
使用 kk-helper 插件来一键创建UI，快捷键CTRL+F12；然后在AssetConfig里面配置对应的信息，再调用对应的API函数即可。
```typescript
// UI的配置格式如下，定义在UIConfig.ts中
interface IUIConfig {
    /**
     * Bundle包名
     */
    bundle: string;
    /**
     * prefab资源名
     */
    name: string;
    /**
     * 挂载的脚本名, 可选；缺省表示和prefab资源名一致
     */
    script?: string;
    /**
     * 所加载资源的缓存模式，默认为 UICacheMode.NoCache，不缓存
     */
    cacheMode?: number;
}

// ---------------- Layer类型 ----------------
// const LayerConf = {
//     Hall: <IUIConfig> {
//         bundle: BundleConf.Hall,
//         name: "HallLayer",
//         cacheMode: UICacheMode.Cache,
//     }
// };

// 异步方法，跳转到指定的Layer;
// 第一个参数类型是IUIConfig，下面一样；
// 第二个参数表示传入这个Layer的任意类型数据，可选；传入的数据会被脚本自动保存。
kk.uiMgr.goLayerAsync(LayerConf.Hall, data);
// 异步方法，重置刷新当前Layer，data为传入的数据，可选。
kk.uiMgr.resetCurLayerAsync(data)

// ---------------- Popup类型 ----------------
// const PopupConf = {
//     Settings: <IUIConfig> {
//         bundle: BundleConf.Hall,
//         name: "SettingsPopup",
//     }
// };

// 异步方法，显示指定的弹窗；
// 第一个参数类型是IUIConfig；第二个是要传入的数据，可选
kk.uiMgr.showPopupAsync(PopupConf.Settings);
// 弹窗关闭后，会返回用户在弹窗脚本中设置的任意类型数据。
let ret = await kk.uiMgr.showPopupAsync(PopupConf.Settings, data);

// ---------------- Panel、Widget类型 ----------------
// const PanelConf = {
//     Game: <IUIConfig> {
//         bundle: BundleConf.Hall,
//         name: "GamePanel"
//     },
// };
//
// const WidgetConf = {
//     Toast: <IUIConfig> {
//         bundle: BundleConf.Main,
//         name: "Toast",
//         cacheMode: UICacheMode.Cache
//     }
// }

// 都是异步方法，跟前面不同的是，这两种类型创建后，需要自行设置父节点才会显示。
kk.uiMgr.createPanelAsync(PanelConf.Game);
kk.uiMgr.createWidgetAsync(WidgetConf.Toast);

```
#### 4、网络模块使用示范
http和websocket都使用async/await、Promise进行封装，既支持异步也支持同步。
```typescript
// http
let ret = await kk.httpMgr.reqAsync(...);
kk.httpMgr.reqAsync(...).then(...).catch(...);

// websocket
await kk.socketMgr.connectAsync(...)
let ret = await kk.socketMgr.reqAsync(...);
kk.socketMgr.connectAsync(...).then(...).catch(...);

kk.socketMgr.on(cmd, callback, target);
kk.socketMgr.off(cmd, callback, target);

```
详细使用以及其他使用示例请运行demo工程查看。  
[更新日志](https://github.com/Mortal-Li/cocos-creator-async/blob/main/CHANGELOG.md)
 
