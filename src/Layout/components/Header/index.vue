<template>
  <div class="header flex-acenter">
    <div class="left flex-acenter">
      <span class="title">小型企业进销存管理系统</span>
      <el-icon
        :class="['cursor-pointer', isCollapse ? 'icon-rota' : '']"
        style="margin-left: 10px"
        @click="changeMenuOpen"
      >
        <Fold />
      </el-icon>
    </div>
    <div class="right">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper flex-center">
          <el-avatar size="medium" :src="userInfo.img" />
          <p class="user-name">{{ userInfo.name }}</p>
          <el-icon style="color: #fff;font-size: 16px"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="() => $message.warning('目前暂不支持修改密码哦')">
              <!-- <router-link :to="{ name: 'PasswordModify'}"> -->
              <i class="icon el-icon-unlock" /><span>修改密码</span>
              <!-- </router-link> -->
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <i class="icon el-icon-unlock" />
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <el-button @click="logout">注销</el-button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useStore, mapGetters } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
const store = useStore();
const router = useRouter();
const route = useRoute();
const userInfo = store.getters['userInfo/userInfo'];
watchEffect(() => {
  console.log(userInfo);
});
// 更替菜单栏是否展开、默认展开
const isCollapse = ref(true);
const changeMenuOpen = () => {
  isCollapse.value = !isCollapse.value;
  store.commit('changeMenuOpen', isCollapse.value);
};
// 退出登录
const logout = () => {
  store.dispatch('userInfo/resetToken');
  router.push(`/login?redirect=${route.path}`);
};
</script>

<style lang="scss" scoped>
.header {
  background: #0a2140;
  color: #fff;
  height: 60px;
  font-size: 18px;
  width: 100%;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
}
.icon-rota {
  transform: rotate(180deg);
}
.user-name {
  color: #fff;
  font-size: 16px;
  margin: 0 10px;
}
</style>
