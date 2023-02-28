<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img src="@/assets/images/404.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">很抱歉！页面不小心迷路了～</div>
        <div class="bullshit__info">
          <span>{{ time }}秒</span> 后自动返回到上一页面
        </div>

        <el-button type="primary" size="medium" @click="$router.push({name: 'Home'})">返回首页</el-button>
        <el-button size="medium" @click="goback">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  data() {
    return {
      time: 5,
      timer: null
    };
  },
  mounted() {
    this.calcTime();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    calcTime() {
      this.timer = setInterval(() => {
        this.time > 0 && this.time--;
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.goback();
        }
      }, 1000);
    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bullshit{
  text-align: center;
  &__oops{
    font-size: 26px;
    color: #838A9D;
    margin-top: 40px;
  }
  &__info{
    font-size: 14px;
    margin: 20px 0 15px;
    color: #8F95A8;
    span{
      color: #DA3029;
    }
  }
}
</style>
