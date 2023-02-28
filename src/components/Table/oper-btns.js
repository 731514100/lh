/*
 * @Descripttion: table操作按钮
 * @version:
 * @Author: cxguo
 * @Date: 2019-11-19 16:08:06
 * @LastEditors: cxguo
 * @LastEditTime: 2020-08-02 18:16:50
 */

const DEFAULT_PROPS = {
  size: 'mini',
  circle: true
};
export const getAddButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'default',
    icon: 'el-icon-plus'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '新增'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

export const getDelButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'danger',
    icon: 'el-icon-delete'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '删除'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

export const getUpdateButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'success',
    icon: 'el-icon-edit'
  });
  let on = {};
  props = Object.assign(props, _data.props);
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '编辑'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

export const getRefreshButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'default',
    icon: 'el-icon-refresh'
  });
  let on = {};
  props = Object.assign(props, _data.props);
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '刷新'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

export const getUmbrellaButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'success',
    icon: 'el-icon-umbrella'
  });
  let on = {};
  props = Object.assign(props, _data.props);
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '权限设置'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

export const getViewButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'default',
    icon: 'el-icon-view'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '查看'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};
/**
 * 更多按钮
 * @param {*} h
 * @param {*} _data
 */
export const getMoreButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'default',
    icon: 'el-icon-more'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '更多'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

/**
 * 查询库存按钮
 * @param {*} h
 * @param {*} _data
 */
export const getStockButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'primary',
    icon: 'iconfont icon-kucun'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '查看库存'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

/**
 * 查询价格按钮
 * @param {*} h
 * @param {*} _data
 */
export const getPriceButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'primary',
    icon: 'iconfont icon-jiage'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: {
      title: '查看成本价'
    },
    props: props,
    on: on
  };
  return h('el-button', data);
};

export const getCopyButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'primary',
    icon: 'el-icon-document-copy'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: Object.assign({ title: '复制' }, _data.attrs),
    props: props,
    on: on
  };
  return h('el-button', data);
};

export const getSelectButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'primary',
    icon: 'el-icon-check'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: Object.assign({ title: '复制' }, _data.attrs),
    props: props,
    on: on
  };
  return h('el-button', data);
};

/**
 * 转化
 * @param {*} h
 * @param {*} _data
 */
export const getTransButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'primary',
    icon: 'iconfont icon-zhuan'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: Object.assign({ title: '转' }, _data.attrs),
    props: props,
    on: on
  };
  return h('el-button', data);
};

/**
 * 还
 * @param {*} h
 * @param {*} _data
 */
export const getReturnButton = function(h, _data) {
  let props = Object.assign(DEFAULT_PROPS, {
    type: 'primary',
    icon: 'iconfont icon-huan'
  });
  props = Object.assign(props, _data.props);
  let on = {};
  on = Object.assign(on, _data.on);
  const data = {
    attrs: Object.assign({ title: '转' }, _data.attrs),
    props: props,
    on: on
  };
  return h('el-button', data);
};
