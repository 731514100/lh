<template>
  <div class="menu">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      background-color="#fff"
      text-color="#3c4353"
      :unique-opened="false"
      active-text-color="#1182fb"
      :collapse-transition="false"
      mode="vertical"
      width="240px"
    >
      <sidebar-item
        v-for="route in permission_routes[0].children"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script setup>
import SidebarItem from './components/SidebarItem';
import { computed, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
const store = useStore();
/**
 * type： 1 只有一级，2为多级
 */

const isCollapse = ref(store.getters.menuOpen);
const permission_routes = ref(null);
// 监听 vuex 中 menuOpen 变化；控制菜单栏显示
watchEffect(() => {
  isCollapse.value = !store.getters.menuOpen;
});
// 路由信息处理
watchEffect(() => {
  console.log(store.getters.permission_routes, 'chuf');
  permission_routes.value = store.getters.permission_routes;
});
// 激活菜单id
const activeMenu = computed(() => {
  const route = useRoute();
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>

<style lang="scss" scoped>
.menu {
  height: 100%;
  box-shadow: 1px 0 6px rgb(0 21 41 / 10%);
  margin-right: 4px;
  ::v-deep .el-menu {
    height: 100%;
    .el-menu-item {
    }
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 220px;
    height: 100%;
  }
}
</style>
