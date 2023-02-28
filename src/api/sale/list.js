import request from '@/utils/axios';
// 添加
export const saleListAdd = (data) => {
  return request({
    method: 'post',
    url: '/saleList/add',
    data
  });
};
// 获取进货单列表
export const saleListList = (data) => {
  return request({
    method: 'post',
    url: '/saleList/list',
    data
  });
};
// 更新进货单状态
export const saleListChange = (data) => {
  return request({
    method: 'post',
    url: '/saleList/change',
    data
  });
};
