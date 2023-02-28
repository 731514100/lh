/*
 * @Descripttion:
 * @version:
 * @Author: cxguo
 * @Date: 2019-10-24 14:15:15
 * @LastEditors: cxguo
 * @LastEditTime: 2019-10-30 13:50:02
 */
import { MOVE_CLASS, ITEM_WRAPPER_WIDTH, ITEM_WRAPPER_HEIGHT, ITEM_PER } from '../config';
import { getMousePos } from '../utils/tool';
import _ from 'lodash';

export default {
  data() {
    return {
      d: {
        originMousePos: { x: 0, y: 0 },
        originMoveItemPos: {},
        movingObj: {
          el: null,
          index: { dataIndex: 0, positionIndex: 0 }
        }
      }
    };
  },
  methods: {
    getMovingEl() {
      const dom = this.d.movingObj.el;
      return dom;
    },
    handleMovingSwitch(moveItemX, moveItemY) {
      const opsitionObj = this.isMoveItemOverOthers(moveItemX, moveItemY);
      if (!opsitionObj) return;
      if (!this.switchTimer) this.switchPosition(opsitionObj);
    },
    /**
     * 判断正在移动的item，是否覆盖在别的item上
     */
    isMoveItemOverOthers(moveItemX, moveItemY) {
      // 允许的范围
      const perW = ITEM_WRAPPER_WIDTH * ITEM_PER;
      const perH = ITEM_WRAPPER_HEIGHT * ITEM_PER;
      // 横向位置
      const _positionX = Math.ceil(moveItemX / ITEM_WRAPPER_WIDTH);
      const _positionY = Math.ceil(moveItemY / ITEM_WRAPPER_HEIGHT);
      const positionX = _positionX < perW ? _positionX : null;
      const positionY = _positionY < perH ? _positionY : null;
      // console.log('positionX,positionY: ', positionX, positionY)
      if (positionX && positionY) {
        const targetPindex = positionX + this.oneLineNums * (positionY - 1);
        const movingPindex = this.d.movingObj.index.positionIndex;
        if (targetPindex === movingPindex) return null;
        // 说明有重叠了，且不是本本身
        // 判断有没有超出位置界限 0-Max
        const maxPosition = this.insideColData.length - 1;
        if (targetPindex < 0 || targetPindex > maxPosition) return null;
        return { movingPindex, targetPindex };
      }
      return null;
    },
    /**
     * 切换位置
     * @param {移动item的排序index} movingP
     */
    switchPosition({ movingPindex, targetPindex }) {
      // console.log(`重叠,目标positionIndex为:${targetPindex}； 当前positionIndex为: ${movingPindex}`)
      if (movingPindex > targetPindex) {
        const rangeColData = this.getColDataByPositionRangeIndex(targetPindex, movingPindex);
        this.rangeColRightStep(rangeColData, targetPindex);
        this.switchTimer = setTimeout(() => {
          this.switchTimer = null;
        }, 500);
      } else {
        const rangeColData = this.getColDataByPositionRangeIndex(movingPindex, targetPindex);
        this.rangeColLeftStep(rangeColData, targetPindex);
        this.switchTimer = setTimeout(() => {
          this.switchTimer = null;
        }, 500);
      }
    },
    rangeColLeftStep(rangeColData, targetPindex) {
      const moveCol = this.getColDataByPositionIndex(this.d.movingObj.index.positionIndex);
      this.d.movingObj.index.positionIndex = targetPindex;
      rangeColData.forEach((item, index) => {
        item.positionIndex--;
      });
      moveCol.positionIndex = targetPindex;
      // this.$set(moveCol, 'positionIndex', targetPindex);
    },
    rangeColRightStep(rangeColData, targetPindex) {
      const moveCol = this.getColDataByPositionIndex(this.d.movingObj.index.positionIndex);
      this.d.movingObj.index.positionIndex = targetPindex;
      rangeColData.forEach((item, index) => {
        item.positionIndex++;
      });
      moveCol.positionIndex = targetPindex;
      // this.$set(moveCol, 'positionIndex', targetPindex);
    },
    onMouseDown(params) {
      const { $event } = params;
      const _self = $event.target;
      const self = _self.cloneNode(true);
      _self.parentNode.appendChild(self);
      this.d.movingObj.el = self;
      this.originMousePos = getMousePos();
      self.className = `active ${MOVE_CLASS}`;
      this.d.originMoveItemPos = {
        x: Number(self.style.left.replace('px', '')),
        y: Number(self.style.top.replace('px', ''))
      };
      const dataIndex = self.getAttribute('data-index');
      const selfColData = this.getColDataByDataIndex(dataIndex);
      this.d.movingObj.index = {
        dataIndex,
        positionIndex: selfColData.positionIndex
      };
      document.addEventListener('mousemove', this.mouseMoveListener);
      document.addEventListener('mouseup', this.mouseUpListener);
    },
    removeMovingNode() {
      const moveEl = this.getMovingEl();
      moveEl.parentNode.removeChild(moveEl);
      this.d.movingObj.el = null;
    },
    mouseUpListener(e) {
      this.removeMovingNode();
      document.removeEventListener('mousemove', this.mouseMoveListener);
      document.removeEventListener('mouseup', this.mouseUpListener);
    },
    mouseMoveListener: _.throttle(function(e) {
      this._mouseMoveListener(e);
    }, 40),
    _mouseMoveListener(e) {
      const moveEl = this.getMovingEl();
      const originMousePos = this.originMousePos;
      const newMousePos = getMousePos(e);
      const disMousePos = { x: newMousePos.x - originMousePos.x, y: newMousePos.y - originMousePos.y };
      const targetX = this.d.originMoveItemPos.x + disMousePos.x;
      const targetY = this.d.originMoveItemPos.y + disMousePos.y;
      moveEl.style.left = `${targetX}px`;
      moveEl.style.top = `${targetY}px`;
      this.handleMovingSwitch(targetX, targetY);
    }
  }
};
