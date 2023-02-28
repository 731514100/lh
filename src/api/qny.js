import request from '@/utils/axios';

export const qiniuUpload = (data) => {
  return request({
    method: 'post',
    url: '/file/qiniuUpload',
    data
  });
};
