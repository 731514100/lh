import { createApp } from 'vue';
// 初始化样式
import 'normalize.css/normalize.css';

import App from './App.vue';
import router from './router';
import store from './store';

// ui 框架
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/styles/element-plus.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 组件注册
import globalComponents from '@/utils/globalComponents.js';

// 路由拦截
import './permission.js';
const app = createApp(App);

// svg注册
const req = require.context('./assets/SVG/menu', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

// 全局 components 挂载
globalComponents(app);

// 挂载 vuex router element
app.use(store);
app.use(router);
app.use(ElementPlus);

// 挂载element图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 渲染到id为app的上面
app.mount('#app');
