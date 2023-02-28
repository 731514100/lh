<template>
  <div
    v-loading="loading"
    class="login bg"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div ref="scale" class="scale in">
      <div class="light">
        <div class="systemName" style="">
          <span>&emsp;</span>
        </div>
      </div>
      <div class="login-content">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          class="demo-ruleForm"
        >
          <div class="top">
            <div class="title">
              <img
                :src="require('@/assets/images/login/login-welcome.png')"
                alt=""
              >
            </div>
            <el-form-item prop="username">
              <div class="lh-input">
                <img
                  :src="require('@/assets/images/login/icon-user.png')"
                  alt=""
                >
                <input
                  v-model="ruleForm.username"
                  type="text"
                  autofocus="autofocus"
                  placeholder="请输入用户名/账号"
                >
              </div>
            </el-form-item>
            <el-form-item prop="pass">
              <div class="lh-input">
                <img
                  :src="require('@/assets/images/login/icon-password.png')"
                  alt=""
                >
                <input
                  v-model="ruleForm.pass"
                  type="password"
                  placeholder="请输入密码"
                >
              </div>
            </el-form-item>
            <el-form-item>
              <div class="btn-login" @click="submitForm('ruleForm')">登录</div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="bottom" />
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user';
import { mapMutations } from 'vuex';
import router from '@/router';
export default {
  data() {
    var username = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能位空'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      // 标签页
      activeName: 'login',
      // 表格信息
      ruleForm: {
        username: '',
        pass: '',
        rememberMe: false
      },
      rules: {
        username: [{ validator: username, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }]
      },
      screenWidth: document.body.clientWidth,
      loading: false
    };
  },
  watch: {
    screenWidth(val) {
      this.changeStyle(val);
    }
  },
  created() {
    // 开启监听键盘按下事件;
    window.addEventListener('keydown', this.handkeyCode, true);
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
    this.$nextTick(() => this.changeStyle(this.screenWidth));
  },
  methods: {
    ...mapMutations('userInfo', ['setToken']),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          const username = this.ruleForm.username;
          const password = this.ruleForm.pass;
          const data = {
            us: username,
            ps: password
          };
          login(data)
            .then(async(res) => {
              window.sessionStorage.setItem('token', res.token);
              this.setToken(res.token);
              this.$router.push({
                name: 'Layout'
              });
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeStyle(val) {
      this.$refs.scale.style.transform = `scale(${val / 2220})`;
    },
    handkeyCode(e) {
      let key = null;
      if (window.event === undefined) key = e.keyCode;
      else key = window.event.keyCode;
      if (key === 13) {
        this.submitForm('ruleForm');
      }
    }
  }
};
</script>

<style scoped>
.bg {
  height: 100vh;
  background-image: url("../../assets/images/login/login_background.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100vh;
}
</style>

<style lang="scss" scoped>
@keyframes ivuMoveDownIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.login {
  background: url("../../assets/images/login/login-bg.png");
  background-size: 100% 100vh;
  // transform: scale(.5);
  .light {
    height: 100vh;
    display: flex;
    justify-content: center;
    background: url("../../assets/images/login/login-light.png") no-repeat;
    background-size: 100% 970px;
  }
  .systemName {
    position: absolute;
    text-align: center;
    width: 1100px;
    height: 400px;
    // font-size: 60px;
    // top: 22rem;
    top: 220px;
    z-index: 200;
    span {
      position: relative;
      color: transparent;
      font-weight: bold;
      z-index: 200;
      font-size: 48px;
      &::before {
        content: "小型企业进销存管理系统";
        position: absolute;
        width: 1100px;
        left: 50%;
        margin-left: -550px;
        z-index: -1;
        text-shadow: 0px 6px 5px rgba(0, 6, 29, 0.5);
      }
      &::after {
        content: "小型企业进销存管理系统";
        position: absolute;
        width: 1100px;
        left: 50%;
        margin-left: -550px;
        z-index: 1;
        background-image: linear-gradient(0deg, #c1e2f9 0%, #f4faff 100%);
        -webkit-background-clip: text;
      }
    }
  }
  .login-content {
    position: absolute;
    top: 284px;
    left: 50%;
    margin-left: -319px;
    z-index: 999;
    .top {
      background: url("../../assets/images/login/login-content.png");
      height: 436px;
      width: 638px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column nowrap;
      .title {
        margin-bottom: 36px;
      }
      .lh-input {
        position: relative;
        width: 429px;
        height: 51px;
        border: 1px solid #00eaff;
        border-radius: 25px;
        background-color: #2f93e7;
        padding: 0 10px 0 38px;
        img {
          width: 22px;
          height: 23px;
          position: absolute;
          left: 18px;
          top: 50%;
          margin-top: -12px;
        }
        input {
          width: 100%;
          height: 100%;
          padding: 0 12px;
          box-sizing: border-box;
          border: none;
          background-color: transparent;
          border-radius: 20px;
          outline: none;
          color: #fff;
          -webkit-text-fill-color: #fff; //颜色是设置成你需要的颜色
          font-size: 18px;
          &::placeholder {
            color: rgba(192, 247, 255, 0.5) !important;
            -webkit-text-fill-color: rgba(
              192,
              247,
              255,
              0.5
            ); //颜色是设置成你需要的颜色
            font-size: 18px;
          }
          &:-webkit-autofill {
            font-size: 18px;
            transition: background-color 5000s ease-in-out 0s;
          }
        }
      }
      .btn-login {
        background: url("../../assets/images/login/login-btn.png");
        width: 251px;
        height: 54px;
        font-size: 20px;
        text-align: center;
        line-height: 54px;
        color: #005677;
        cursor: pointer;
        font-weight: bold;
        &:hover {
          color: rgba(0, 86, 119, 0.8);
          transition: all 0.3;
        }
      }
    }
  }
  .bottom {
    background: url("../../assets/images/login/login-bottom.png");
    width: 1175px;
    height: 236px;
    position: absolute;
    top: 600px;
    left: 50%;
    margin-left: -587px;
    z-index: 998;
  }
  .elTabs {
    position: absolute;
    padding: 30px;
    width: 20%;
    height: auto;
    background-color: white;
    margin-top: 15%;
    margin-left: 10%;
    top: 0;
  }
}
.el-form-item__error {
  font-size: 16px;
  text-indent: 12px;
}
.in {
  animation: ivuMoveDownIn 1s;
  transition: all 0.3s;
}
</style>
