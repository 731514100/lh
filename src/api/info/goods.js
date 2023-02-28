import request from '@/utils/axios';
// 添加或者编辑
export const goodsAdd = (data) => {
  return request({
    method: 'post',
    url: '/goodsInfo/add',
    data
  });
};
// 获取客户列表
export const goodsList = (data) => {
  return request({
    method: 'post',
    url: '/goodsInfo/list',
    data
  });
};
// 删除客户信息
export const goodsDelete = (data) => {
  return request({
    method: 'post',
    url: '/goodsInfo/delete',
    data
  });
};
