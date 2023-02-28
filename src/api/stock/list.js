import request from '@/utils/axios';
// 添加
export const stockListAdd = (data) => {
  return request({
    method: 'post',
    url: '/stockList/add',
    data
  });
};
// 获取库存盘点列表
export const stockListList = (data) => {
  return request({
    method: 'post',
    url: '/stockList/list',
    data
  });
};
