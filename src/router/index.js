import {
  createRouter,
  createWebHashHistory
} from 'vue-router';
import Layout from '../Layout/index.vue';

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'Layout',
    redirect: '/home',
    children: [{
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Home/index.vue'),
      meta: {
        title: '首页',
        icon: 'home'
      }
    }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login')
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import(/* webpackChunkName: "about" */ '@/views/404.vue')
  }
];

export const asyncRoutes = [

  {
    path: '/info',
    name: 'Info',
    component: () => import(/* webpackChunkName: "about" */ '../views/Info'),
    meta: {
      title: '基础信息管理',
      icon: 'goods'
    },
    children: [{
      path: 'client',
      name: 'InfoClient',
      component: () => import(/* webpackChunkName: "about" */ '../views/Info/Client'),
      meta: {
        title: '客户信息管理'
      }
    },
    {
      path: 'goods',
      name: 'infoGoods',
      component: () => import(/* webpackChunkName: "about" */ '../views/Info/Goods'),
      meta: {
        title: '商品信息管理'
      }
    },
    {
      path: 'supplier',
      name: 'GoodsSupplier',
      component: () => import(/* webpackChunkName: "about" */ '../views/Info/Supplier'),
      meta: {
        title: '供应商信息管理'
      }
    }
    ]
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import(/* webpackChunkName: "about" */ '../views/Goods'),
    meta: {
      title: '进货管理',
      icon: 'goods'
    },
    children: [{
      path: 'list',
      name: 'GoodsList',
      component: () => import(/* webpackChunkName: "about" */ '../views/Goods/List'),
      meta: {
        title: '进货单'
      }
    },
    {
      path: 'return',
      name: 'GoodsReturn',
      component: () => import(/* webpackChunkName: "about" */ '../views/Goods/Return'),
      meta: {
        title: '进货退货'
      }
    }
    ]
  },
  {
    path: '/sale',
    name: 'Sale',
    component: () => import(/* webpackChunkName: "about" */ '../views/Sale'),
    meta: {
      title: '销售管理',
      icon: 'goods'
    },
    children: [{
      path: 'list',
      name: 'SaleList',
      component: () => import(/* webpackChunkName: "about" */ '../views/Sale/List'),
      meta: {
        title: '销售单'
      }
    },
    {
      path: 'return',
      name: 'SaleReturn',
      component: () => import(/* webpackChunkName: "about" */ '../views/Sale/Return'),
      meta: {
        title: '销售退货'
      }
    }
    ]
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import(/* webpackChunkName: "about" */ '../views/Stock'),
    meta: {
      title: '库存管理',
      icon: 'goods'
    },
    children: [{
      path: 'list',
      name: 'StockList',
      component: () => import(/* webpackChunkName: "about" */ '../views/Stock/List'),
      meta: {
        title: '库存盘点'
      }
    }
      // {
      //   path: 'warehousing',
      //   name: 'WarehousingList',
      //   component: () => import(/* webpackChunkName: "about" */ '../views/Stock/Warehousing'),
      //   meta: {
      //     title: '入库'
      //   }
      // },
      // {
      //   path: 'ex-warehouse',
      //   name: 'ExWarehouseList',
      //   component: () => import(/* webpackChunkName: "about" */ '../views/Stock/ExWarehouse'),
      //   meta: {
      //     title: '出库'
      //   }
      // }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: () => import(/* webpackChunkName: "about" */ '../views/System'),
    meta: {
      title: '系统管理',
      icon: 'settings'
    },
    children: [{
      path: 'user',
      name: 'SystemUser',
      component: () => import(/* webpackChunkName: "about" */ '../views/System/User'),
      meta: {
        title: '操作员管理'
      }
    }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
});

export default router;
