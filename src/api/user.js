import request from '@/utils/axios';

export const login = (data) => {
  return request({
    method: 'post',
    url: '/user/login',
    data
  });
};
// 列表
export const page = (data) => {
  return request({
    method: 'post',
    url: '/user/page',
    data
  });
};
// 添加
export const add = (data) => {
  return request({
    method: 'post',
    url: '/user/add',
    data
  });
};
// 用户编辑
export const userUpdate = (data) => {
  return request({
    method: 'post',
    url: '/user/update',
    data
  });
};
// 修改密码
export const updateps = (data) => {
  return request({
    method: 'post',
    url: '/user/updateps',
    data
  });
};
// 删除用户
export const delUser = (data) => {
  return request({
    method: 'post',
    url: '/user/del',
    data
  });
};
// 删除用户
export const getUserInfo = (data) => {
  return request({
    method: 'get',
    url: '/user/info',
    data
  });
};
