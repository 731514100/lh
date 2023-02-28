import request from '@/utils/axios';
// 添加
export const goodsReturnAdd = (data) => {
  return request({
    method: 'post',
    url: '/goodsReturn/add',
    data
  });
};
// 获取进货单列表
export const goodsReturnList = (data) => {
  return request({
    method: 'post',
    url: '/goodsReturn/list',
    data
  });
};
