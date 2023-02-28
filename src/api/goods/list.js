import request from '@/utils/axios';
// 添加
export const goodsListAdd = (data) => {
  return request({
    method: 'post',
    url: '/goodsList/add',
    data
  });
};
// 获取进货单列表
export const goodsListList = (data) => {
  return request({
    method: 'post',
    url: '/goodsList/list',
    data
  });
};
// 更新进货单状态
export const goodsListChange = (data) => {
  return request({
    method: 'post',
    url: '/goodsList/change',
    data
  });
};
