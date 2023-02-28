import request from '@/utils/axios';
// 添加或者编辑
export const clientAdd = (data) => {
  return request({
    method: 'post',
    url: '/client/add',
    data
  });
};
// 获取客户列表
export const clientList = (data) => {
  return request({
    method: 'post',
    url: '/client/list',
    data
  });
};
// 删除客户信息
export const clientDelete = (data) => {
  return request({
    method: 'post',
    url: '/client/delete',
    data
  });
};
