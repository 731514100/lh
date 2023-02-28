import request from '@/utils/axios';
// 添加
export const saleReturnAdd = (data) => {
  return request({
    method: 'post',
    url: '/saleReturn/add',
    data
  });
};
// 获取进货单列表
export const saleReturnList = (data) => {
  return request({
    method: 'post',
    url: '/saleReturn/list',
    data
  });
};
