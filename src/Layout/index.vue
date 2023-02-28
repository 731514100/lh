<template>
  <div class="layout">
    <Header />
    <div class="flex body">
      <Menu />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header';
import Menu from './components/Menu';
export default {
  components: {
    Header,
    Menu
  },
  setup() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  .body {
    height: 100%;
    .content {
      width: 100%;
      padding: 10px;
      background: #f6f8f9;
    }
  }
}
</style>
