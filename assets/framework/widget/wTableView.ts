﻿/**
 * wTableView是对ScrollView的性能优化版
 * 将wTableView.prefab拖拽到编辑器使用
 * @author Mortal-Li
 * @created 2021年12月5日
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class wTableView extends cc.Component {

    @property(cc.ScrollView)
    private scv: cc.ScrollView = null;

    @property(cc.Node)
    private cellNode: cc.Node = null;

    @property({
        type: cc.Component.EventHandler,
        tooltip: "数据更新回调-(cell:cc.Node, idx:number, custom:string)"
    })
    updateCell: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({
        tooltip: "间距"
    })
    private div: number = 0;

    private preOffset: cc.Vec2;
    private cellPool: cc.Node[] = [];

    private headHideNum = 0;
    private tailHideNum = 0;
    private cellNum = 0;
    private isVertical = true;

    private cellLen = 0;

    onLoad() {
        let T = this;

        if (!T.scv.vertical && !T.scv.horizontal ||
            T.scv.vertical && T.scv.horizontal) {
            cc.warn("TableView has wrong direction!");
            return;
        }

        T.cellNode.active = false;
        T.isVertical = T.scv.vertical;

        T.node.on("scroll-began", T.onScrollBegan, T);
        T.node.on("scrolling", T.onScrolling, T);
    }

    /**
     * 当数据准备好后，调用此方法刷新数据以更新UI
     * @param numOfCells 数据量
     */
    refreshData(numOfCells: number) {
        let T = this;

        if (numOfCells < 0) {
            cc.error("wrong number, must >= 0!");
            return;
        }

        let preNum = T.cellNum;
        for (let i = 0; i < preNum; ++i) {
            T._removeCell(i);
        }

        T.cellNum = numOfCells;

        if (T.isVertical) {
            T.cellLen = T.cellNode.height + T.div;
            T.scv.content.height = T.cellLen * numOfCells;
        } else {
            T.cellLen = T.cellNode.width + T.div;
            T.scv.content.width = T.cellLen * numOfCells;
        }

        if (preNum == 0) {
            let numOfVisibleCells = T.isVertical ? (T.scv.content.parent.height / T.cellLen) : (T.scv.content.parent.width / T.cellLen);
            let len = Math.min(Math.ceil(numOfVisibleCells), numOfCells);
            
            T.headHideNum = 0;
            T.tailHideNum = numOfCells - len;
            for (let i = 0; i < len; ++i) {
                T._setNewCell(i);
            }

            if (T.isVertical) T.scv.scrollToTop();
            else T.scv.scrollToLeft();
            T.preOffset = T.scv.getScrollOffset();
        } else {
            T.scv.stopAutoScroll();
            T._wrapOffset(T.preOffset);

            let dis = T.isVertical ? T.preOffset.y : -T.preOffset.x;
            let viewLen = T.isVertical ? T.scv.content.parent.height : T.scv.content.parent.width;
            let num = Math.ceil((dis + viewLen) / T.cellLen);
            num = Math.min(num, numOfCells);
            T.tailHideNum = numOfCells - num;
            T.headHideNum = Math.floor(dis / T.cellLen);
            for (let i = T.headHideNum; i < num; ++i) {
                T._setNewCell(i);
            }
        }
    }

    scrollToTop(timeInSecond?: number, attenuated?: boolean) {
        this._forwardScroll("scrollToTop", timeInSecond, attenuated);
    }

    scrollToBottom(timeInSecond?: number, attenuated?: boolean) {
        this._forwardScroll("scrollToBottom", timeInSecond, attenuated);
    }

    scrollToLeft(timeInSecond?: number, attenuated?: boolean) {
        this._forwardScroll("scrollToLeft", timeInSecond, attenuated);
    }

    scrollToRight(timeInSecond?: number, attenuated?: boolean) {
        this._forwardScroll("scrollToRight", timeInSecond, attenuated);
    }

    _forwardScroll(funcName: string, ...params: any[]) {
        let T = this;
        T.scv.stopAutoScroll();
        T.scv[funcName](...params);
        if (!params[0]) {
            T.preOffset = T.scv.getScrollOffset();
            T.refreshData(T.cellNum);
        }
    }

    /**
     * 注意，这里的offset，不管是垂直方向还是水平方向，符号都是正(+)
     */
    scrollToOffset(offset: cc.Vec2, timeInSecond?: number, attenuated?: boolean) {
        let T = this;
        T.scv.stopAutoScroll();
        T.scv.scrollToOffset(offset, timeInSecond, attenuated);
        if (!timeInSecond) {
            T.preOffset = T.scv.getScrollOffset();
            T.refreshData(T.cellNum);
        }
    }

    isScrolling() {
        return this.scv.isScrolling();
    }

    isAutoScrolling() {
        return this.scv.isAutoScrolling();
    }

    _updateCell(cell: cc.Node, idx: number) {
        let T = this;
        
        if (T.updateCell.target && T.updateCell.handler) {
            T.updateCell.emit([cell.getChildByName(T.cellNode.name), idx]);
        }
    }

    _getCell() {
        let T = this;

        let cell: cc.Node = null;
        if (T.cellPool.length > 0) {
            cell = T.cellPool.pop();
        } else {
            cell = new cc.Node();
            cell.setContentSize(T.cellNode.getContentSize());
            let nd = cc.instantiate(T.cellNode);
            nd.active = true;
            nd.parent = cell;
            if (T.isVertical) nd.y = T.div / 2;
            else nd.x = -T.div / 2;
        }
        cell.parent = T.scv.content;
        return cell;
    }

    _removeCell(idx: number) {
        let T = this;

        let cell = T.scv.content.getChildByName(String(idx));
        if (cell) {
            cell.removeFromParent(true);
            T.cellPool.push(cell);
        }
    }

    _setCellPosWithIdx(cell: cc.Node, idx: number) {
        let T = this;

        if (T.isVertical) cell.y = 0 - T.cellLen / 2 * (idx * 2 + 1);
        else cell.x = T.cellLen / 2 * (idx * 2 + 1);
    }

    _checkCellWithIdx(idx: number) {
        let T = this;

        let cell = T.scv.content.getChildByName(String(idx));
        if (!cell) {
            T._setNewCell(idx);
        }
    }

    _setNewCell(idx: number) {
        let T = this;
        let cell = T._getCell();
        cell.name = String(idx);
        T._updateCell(cell, idx);
        T._setCellPosWithIdx(cell, idx);
    }

    _wrapOffset(curOffset: cc.Vec2) {
        let T = this;

        if (T.isVertical) {
            if (curOffset.y < 0) {
                curOffset.y = 0;
            } else if (curOffset.y > T.scv.getMaxScrollOffset().y) {
                curOffset.y = T.scv.getMaxScrollOffset().y;
            }
        } else {
            if (curOffset.x > 0) {
                curOffset.x = 0;
            } else if (curOffset.x < -T.scv.getMaxScrollOffset().x) {
                curOffset.x = -T.scv.getMaxScrollOffset().x;
            }
        }
    }

    onScrollBegan(scv: cc.ScrollView) {
        this.preOffset = scv.getScrollOffset();
    }

    onScrolling(scv: cc.ScrollView) {
        let T = this;

        if (T.cellNum == 0) return;

        let curOffset = scv.getScrollOffset();
        T._wrapOffset(curOffset);

        if (T.isVertical) {
            T._onScroll(curOffset.y - T.preOffset.y > 0, curOffset.y, T.scv.content.parent.height);
        } else {
            T._onScroll(curOffset.x - T.preOffset.x < 0, -curOffset.x, T.scv.content.parent.width);
        }

        T.preOffset = curOffset;
    }

    _onScroll(isPositive: boolean, dis: number, viewLen: number) {
        let T = this;

        let cellLen = T.cellLen;
        
        if (isPositive) {
            let headHideNum = Math.floor(dis / cellLen);
            if (headHideNum > T.headHideNum) {
                for (let i = T.headHideNum; i < headHideNum; ++i) {
                    T._removeCell(i);
                }
                T.headHideNum = headHideNum;
            }

            let nums = Math.ceil((dis + viewLen) / cellLen);
            for (let i = T.cellNum - T.tailHideNum; i < nums; ++i) {
                T._checkCellWithIdx(i);
            }
            T.tailHideNum = T.cellNum - nums;
        } else {
            let tailHideNum = T.cellNum - Math.ceil((dis + viewLen) / cellLen);
            if (tailHideNum > T.tailHideNum) {
                for (let i = T.tailHideNum; i < tailHideNum; ++i) {
                    T._removeCell(T.cellNum - i - 1);
                }
                T.tailHideNum = tailHideNum;
            }

            let nums = Math.floor(dis / cellLen);
            for (let i = T.headHideNum - 1; i >= nums; --i) {
                T._checkCellWithIdx(i);
            }
            T.headHideNum = nums;
        }
    }

}
