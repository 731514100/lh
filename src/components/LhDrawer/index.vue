<template>
  <el-drawer
    :title="config.edit ? '编辑' : '添加'"
    direction="ltr"
    custom-class="demo-drawer"
    :size="size"
    :destroy-on-close="true"
  >
    <div class="demo-drawer__content">
      <el-form ref="ruleFormRef" :model="form" :rules="rules">
        <el-form-item
          v-for="(item, i) in config.info"
          :key="item.prop"
          :label="item.label"
          :label-width="formLabelWidth"
          :prop="item.prop"
        >
          <!-- 输入框 -->
          <el-input
            v-if="!item.type || item.type === 'input'"
            v-model="form[item.prop]"
            v-bind="item.input"
          />
          <!-- 上传 -->
          <el-upload
            v-if="item.type === 'upload'"
            class="avatar-uploader"
            action=""
            :http-request="uploadAxios"
            :data="qiniuData"
            v-bind="item.upload"
            @click="setNowInfo(item, i)"
          >
            <img v-if="item.value" :src="item.value" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <!-- 下拉框选择 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop]"
            v-bind="item.select"
          >
            <el-option
              v-for="val in item.select.options"
              :key="val.value"
              :label="val.label"
              :value="val.value"
            />
          </el-select>
          <!-- 日期选择 -->
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="form[item.prop]"
            v-bind="item.date"
          />
          <Render :render="item.render &&item.render" />
        </el-form-item>
      </el-form>
      <div v-if="btnShow" class="demo-drawer__footer">
        <el-button @click="cancelForm">取消</el-button>
        <el-button v-show="reset" @click="resetFields">重置</el-button>
        <el-button
          type="primary"
          :loading="config.loading"
          @click="onClick(ruleFormRef)"
        >{{
          config.loading ? `${loadingWord}中 ...` : loadingWord
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect, computed, reactive, h, watch } from 'vue';
import { qiniuUpload } from '@/api/qny.js';
import { ElMessage } from 'element-plus';
import _ from 'lodash';
const Render = {
  props: {
    render: Function
  },
  render: function(p) {
    return this.render?.(h);
  }
};
const qiniuData = {
  token: '',
  key: ''
};
const formLabelWidth = '120px';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  value: {
    type: Boolean,
    default: false
  },
  btnShow: {
    type: Boolean,
    default: true
  },
  reset: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: '40%'
  },
  title: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['submit', 'close']);

const ruleFormRef = ref();

const loadingWord = computed(() => {
  if (props.title) return props.title;
  return props.config.edit ? '编辑' : '添加';
});
// 设置初始化规则
const rules = reactive({});
// 设置初始化表单
const form = reactive({});
// watch([props.config.info], () => {
//   console.log('========================================');
//   props.config.info.map((item) => {
//     rules[item.prop] = item.rules;
//     form[item.prop] = item.value;
//   });
// });
let first = true;
watchEffect(() => {
  if (first || props.btnShow) {
    first = false;
    props.config.info.map((item) => {
      rules[item.prop] = item.rules;
      form[item.prop] = item.value || '';
    });
  } else {
    setTimeout(() => {
      props.config.info.map((item) => {
        rules[item.prop] = item.rules;
        form[item.prop] = item.value || '';
      });
    }, 0);
  }
});
watch(form, () => {
  props.config.info.map((item) => {
    item.value = form[item.prop];
  });
});
// watchEffect(() => {
//   props.config.info.map((item, i) => {
//     if (item.type === 'upload') {
//       return;
//     }
//     if (item.value) {
//       form[item.prop] = item.value || '';
//       console.log(item.value, 'item');
//     } else {
//       form[item.prop] = item.value;
//     }
//   });
// });

// 关闭添加编辑弹框
const cancelForm = () => {
  emit('close');
};

// 表单重置
const resetFields = () => {
  ruleFormRef.value.resetFields();
};
const onClick = (formEl) => {
  console.log(form);
  formEl.validate((valid, fields) => {
    emit('submit', {
      valid,
      form,
      formEl,
      fields,
      ruleFormRef
    });
  });
};
const uploadCheck = ref(0);
const uploadAxios = (res) => {
  const formData = new FormData();
  formData.append('avatar', res.file);
  qiniuUpload(formData).then(({ code, data }) => {
    if (code === 200) {
      props.config.info[uploadCheck.value].value = data.url;
      const key = props.config.info[uploadCheck.value].prop;
      form[key] = data.url || '';
      ElMessage({
        type: 'success',
        message: '上传成功'
      });
    }
  });
};
const setNowInfo = (data, i) => {
  uploadCheck.value = i;
};

defineExpose({
  resetFields
});
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  height: 100px;
  text-align: center;
}
.avatar-uploader .avatar {
  height: 100px;
  display: block;
}
</style>
