import NProgress from 'nprogress'; // progress bar
import router from '@/router';
import store from './store';
// 白名单， 不加验证都能进去的路由
const whiteList = ['/login'];
// 路由拦截 判断进入逻辑
router.beforeEach(async(to, from, next) => {
  NProgress.start();
  const hasToken = store.state.userInfo.token || sessionStorage.getItem('token');
  document.title = to.meta.title || '小型企业进销存管理系统';
  if (hasToken) {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (!store.getters['userInfo/userInfo']?.name) {
        await store.dispatch('userInfo/getInfo');
        // asyncRoutes.forEach(route => router.addRoute(constantRoutes[0].name, route));
        // router.addRoute({
        //   path: '/:pathMatch(.*)',
        //   name: '404',
        //   component: () => import(/* webpackChunkName: "about" */ '@/views/404.vue')
        // });
        next({ ...to, replace: true });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

// ↓全局后置钩子
router.afterEach(() => {
  NProgress.done();
});
