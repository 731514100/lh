import request from '@/utils/axios';
// 供应商
// 添加或者编辑
export const supplierAdd = (data) => {
  return request({
    method: 'post',
    url: '/supplier/add',
    data
  });
};
// 获取客户列表
export const supplierList = (data) => {
  return request({
    method: 'post',
    url: '/supplier/list',
    data
  });
};
// 删除客户信息
export const supplierDelete = (data) => {
  return request({
    method: 'post',
    url: '/supplier/delete',
    data
  });
};
