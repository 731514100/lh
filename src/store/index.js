import {
  createStore
} from 'vuex';

const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const name = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[name] = value.default;
  return modules;
}, {});

export default createStore({
  state: {
    menuOpen: true
  },
  mutations: {
    changeMenuOpen: (state, data) => {
      console.log(data, 'data');
      state.menuOpen = data;
    }
  },
  actions: {},
  modules,
  getters: {
    menuOpen: (state) => state.menuOpen,
    permission_routes: state => state.userInfo.routes
  }
});
