import { getUserInfo } from '@/api/user.js';
import router, { asyncRoutes, constantRoutes } from '@/router';
import { powerList } from '@/utils';
import _ from 'lodash';
const userInfo = {
  namespaced: true,
  state: {
    token: '',
    name: '',
    routes: null,
    userInfo: {},
    addRouterArr: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      sessionStorage.setItem('token', token);
    },
    setRoutes(state, routes) {
      state.routes = routes;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setAddRouterArr(state, info) {
      state.addRouterArr = info;
    }
  },
  actions: {
    getInfo({ commit, dispatch }) {
      getUserInfo().then(({ data }) => {
        commit('setUserInfo', data);
        const { roleId } = data;
        const i = constantRoutes.findIndex((v) => v.name === 'Layout');
        const roleIdArray = roleId.split(',');
        const needNameKey = [];
        if (roleIdArray.length > 0) {
          roleIdArray.forEach(id => {
            powerList.forEach(power => {
              if (power.value === id) needNameKey.push(power.name);
            });
          });
          const fn = () => {
            const deep = (routes) => {
              routes = routes.splice(0, routes.length, ...routes.filter((v) => {
                if (v.children) {
                  return !!deep(v.children);
                } else {
                  return needNameKey.includes(v.name);
                }
              }));
              return routes;
            };
            return deep(asyncRoutes);
          };
          const endArr = fn()?.filter((v) => {
            return v.children?.[0];
          });
          commit('setAddRouterArr', endArr);
          constantRoutes[i].children = [constantRoutes[i].children[0], ...endArr];
          endArr.forEach(route => router.addRoute(constantRoutes[0].name, route));
          commit('setRoutes', constantRoutes);
          console.log(router.currentRoute._value, 'rr');
          router.push('/');
        }
        return Promise.resolve(data);
      });
    },
    resetToken({ commit, state }) {
      commit('setToken', '');
      commit('setUserInfo', {});
      state.addRouterArr.forEach((route) => {
        router.removeRoute(route.name);
      });
      sessionStorage.setItem('token', '');
    },
    resetRouterInfo({ commit, state }, router) {
      commit('setRoutes', router);
    }
  },
  getters: {
    userInfo: (state) => state.userInfo
  }
};
export default userInfo;
