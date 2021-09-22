## <center>Cocos-Creator-Sparrow</center>
<center>

![Def](https://img.shields.io/badge/cocos--creator-2.4.6-blue)
![GitHub](https://img.shields.io/github/license/Mortal-Li/cocos-creator-sparrow)
![GitHub last commit](https://img.shields.io/github/last-commit/Mortal-Li/cocos-creator-sparrow)

</center>

Sparrow是一个基于Cocos-creator的轻量级代码开发框架，它主要有以下特征：
- 单场景 + 多层级
- 使用引擎的Bundle思想来管理游戏代码和资源
- 提供常用的功能模块和通用的解决方案

希望能用更简洁的代码提供更效率的开发体验。

**简要声明**：
- 本项目基于 Cocos Creator 2.4.6，并未验证低版本兼容性。
- 本项目使用 *MIT License* 开源协议，主要供读者学习参考，所以不保证项目商用稳定性和健全性。

### 基本使用指南
#### 1、UI结构说明

本框架基于单场景，在单场景下，有4种类型的UI界面容器：
- Layer：层，用于从一个界面切换到另一个界面，界面元素的主要载体；
- Popup：弹窗，在当前界面弹出一个界面展示窗体；
- Panel：面板，即可用于Layer也可用于Popup，相当于嵌入其中的子视图；
- Widget：控件，主要指一些通用的小的UI模块或功能性挂件；

#### 2、资源目录说明
```
assets
├───Boot
│   ├───Scripts
│   │   ├───AssetConfig.ts -------> 记录不同预制体的配置脚本
│   └───Stage.fire ---------------> 主场景
├───Games ------------------------> 不同的子游戏或子玩法
│   ├───GameABundle --------------> GameA Bundle 优先级-1
│   │   ├───Prefabs
│   │   │   ├───Layer ------------> Layer预制体
│   │   │   ├───Panel ------------> Panel预制体
│   │   │   ├───Popup ------------> Popup预制体
│   │   │   └───Widget -----------> Widget预制体
│   │   ├───Scripts --------------> GameA 相关脚本
│   │   └───Textures -------------> GameA 相关资源
│   └───GameBBundle --------------> GameB Bundle 优先级-1
│       ├───Prefabs
│       │   ├───Layer
│       │   ├───Panel
│       │   ├───Popup
│       │   └───Widget
│       ├───Scripts
│       └───Textures
├───HallBundle -------------------> 大厅 bundle 优先级-3
│   ├───Prefabs
│   │   ├───Layer
│   │   ├───Panel
│   │   ├───Popup
│   │   └───Widget
│   ├───Scripts
│   └───Textures
├───MainBundle -------------------> 主要 bundle 优先级-5，主要是一些通用的模块和资源
│   ├───Prefabs
│   │   ├───Layer
│   │   ├───Panel
│   │   ├───Popup
│   │   └───Widget
│   ├───Scripts
│   │   └───common ---------------> 一些通用脚本
│   ├───Sounds -------------------> 项目音频资源
│   └───Textures -----------------> 通用资源
└───sparrow ----------------------> 框架代码所在
    ├───manager ------------------> 一些管理类，如自定义事件分发、UI控制管理、本地存储等
    ├───tools --------------------> 一些工具类，如通用加密、适配器、装饰器等
    ├───ui -----------------------> 主要是对4种UI界面类型的封装
    └───ceo.ts -------------------> 控制UI树根节点，管理所有manager
```
#### 3、使用示范
```typescript
// 创建四种类型的界面：先在编辑器创建对应的预制体，挂载对应的脚本，该脚本继承对应的基类；
// 然后在AssetConfig里面配置对应的信息，再调用对应的API函数；
// 函数的第二个参数可选，为用户传递的数据，默认为空，如下：
ceo.uiMgr.gotoLayer(LayerConf.Hall);
ceo.uiMgr.showPopup(PopupConf.Settings);
ceo.uiMgr.createPanel(PanelConf.Game);
ceo.uiMgr.createWidget(WidgetConf.Toast);

// 这些xxxConf的定义规则在UIConfig里，如下：
interface IUIConfig {
    /**
     * Bundle包名
     */
    bundle: string;
    /**
     * prefab资源名和挂载的脚本名，两者名字一样
     */
    name: string;
    /**
     * 是否常驻内存，可选；true表示常驻
     */
    stay?: boolean;
}
```
详细使用以及其他使用示例请查看Demo代码。

### 版本更新说明

2021年9月22日：1.0.0 框架雏形完成。
