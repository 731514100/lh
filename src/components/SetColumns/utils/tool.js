/*
 * @Descripttion:
 * @version:
 * @Author: cxguo
 * @Date: 2019-10-24 13:49:48
 * @LastEditors: cxguo
 * @LastEditTime: 2019-10-24 14:00:34
 */
/**
 * 把样式字符转化成数字
 * @param {样式字符: 100px} str
 */
function strOfcss2int(str) {
  if (str.indexOf('px') !== -1) return parseInt(str.substring(0, str.length - 2));
}

export const getRandom = function(minNum, maxNum) {
  // 箭头函数的时候 arguments 有点奇怪哦
  // console.log(arguments)
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
};
// 获取最大z-index
export const getMaxIndex = () => {
  return [...document.all].reduce((r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0) + 1;
};

// 字符串解析成dom
export const parseDom = (arg) => {
  var objE = document.createElement('span');
  objE.innerHTML = arg;
  return objE.childNodes;
};

/**
 * 获取鼠标坐标
 */
export const getMousePos = (event) => {
  var e = event || window.event;
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  var x = e.pageX || e.clientX + scrollX;
  var y = e.pageY || e.clientY + scrollY;
  return { x, y };
};

// 获取文档宽高
export const getDocArea = () => {
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  return { 'width': w, 'height': h };
};

/**
 * 获取一个dom的子节点 by id
 * @param {id name} idName
 */
export const getChildrenNum = (idName) => {
  const parent = document.getElementById(idName);
  console.log(parent.children[0]);
  return parent.children.length;
};

/**
 * 获取uuid
 */
export const uuid = () => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
};

/**
 * 获取时间戳
 */
export const getTimestamp = () => {
  return Date.parse(new Date());
};

/**
 * 获取obj对象属性个数
 * @param {obj对象} obj
 */
export const getObjAttributeNum = (obj) => {
  var count = 0;
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) { // 建议加上判断,如果没有扩展对象属性可以不加
      count++;
    }
  }
  return count;
};

/**
 * 获取iframe 的name
 */
export const getIframeName = () => {
  return 'iframe-' + getTimestamp();
};

/**
 * 获取最小位置的name
 */
export const getMinPostionName = () => {
  return 'minPosition-' + getTimestamp();
};

/**
 * 把iframe的面积转化 ‘10px’ -> '10'
 * @param {面积} areas
 */
export const iframeAreaStr2int = (that) => {
  const areas = that.currentArea;
  const result = [];
  areas.forEach((item, index) => {
    if (item.indexOf('px') !== -1) {
      result.push(strOfcss2int(item));
    } else if (item.indexOf('%') !== -1) {
      if (index === 0) result.push(that.$el.children[0].clientWidth);
      if (index === 1) result.push(that.$el.children[0].clientHeight);
    } else {
      result.push(areas[index]);
    }
  });
  return result;
};

/**
 * 获取iframes中, status =‘min’ 的个数
 * @param {iframes对象集合} iframes
 */
export const getMinIframeNum = (iframes) => {
  var result = 0;
  for (var key in iframes) {
    console.log(iframes[key]);
    if (iframes[key].iframeStatus === 'min') {
      result++;
    }
  }
  return result;
};

/**
 * 设计iframe最小状态的位置: 座位模式
 * [设计思路]
 * 1. 判断有没有座位 -> 没有: 座位直接添加座位,并落座
 *                    有: 座位有没有人, 没人 -> 落座
 *                                    有人 -> 遍历下一个座位
 * 2. 什么时候算离开座位: detory则离开座位
 *                     换了个座位, 离开当前座位
 * 座位集合的设计
 * {
 *    positionName:{
 *                   position:[] 坐标,
 *                   status: 0 || 1 位置状态(有没有人)
 *                 }
 * }
 * @param {iframe本身} iframe
 * @param {iframes集合} iframes
 * @param {最小状态座位} minPositions
 */
export const getIframeMinPosition = (iframe, iframes, minPositions) => {
  /**
   * 获取空座位, 有则返回空座位, 没有就返回null
   * @param {座位} positions
   */
  function getBlankPosition(positions) {
    for (var key in positions) {
      if (positions[key].status === 0) {
        return positions[key];
      }
    }
    return null;
  }

  /**
   * 添加位置; 返回位置信息
   * @param {位置} positions
   */
  function addPosition(positions) {
    const positionNum = getObjAttributeNum(positions);
    const postionName = getMinPostionName();
    const position = {
      name: postionName,
      position: [positionNum * 200 + 'px', (getDocArea().height - iframe.iframeTitleHeight) + 'px'],
      status: 0
    };
    positions[postionName] = position;
    return position;
  }
  /**
   * 调度函数
   */
  function run() {
    const blackPosition = getBlankPosition(minPositions);
    if (blackPosition === null) {
      return addPosition(minPositions);
    } else {
      return blackPosition;
    }
  }
  const position = run();
  return position;
};
