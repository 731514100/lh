import axios from 'axios';
import {
  ElMessage
} from 'element-plus';
import store from '@/store';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true,
  timeout: 10 * 1000
});

service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json';
    config.headers.common['token'] = '';

    if (store.state.userInfo) {
      config.headers['token'] = store.state.userInfo.token || (() => {
        const token = sessionStorage.getItem('token');
        store.commit('userInfo/setToken', token);
        return token;
      })();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // '0: Illegal(非法) token Token expired;
      if (res.code === 0) {
        setTimeout(() => {
          store.dispatch('resetToken').then(() => {
            location.reload();
          });
        }, 1000);
      }
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      });
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug
    ElMessage({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
