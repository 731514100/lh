<!--
 * @Descripttion:
 * @version:
 * @Author: cxguo
 * @Date: 2019-10-27 21:37:51
 * @LastEditors: cxguo
 * @LastEditTime: 2019-10-30 18:09:52
 -->
<template>
  <el-dialog
    v-model:visible="dialogVisible"
    title="设置表格列"
    width="60%"
    :destroy-on-close="true"
    :before-close="handleClose"
  >
    <Main ref="main" :col-data="colData" :table-id="tableId" />
    <div slot="footer" class="dialog-footer">
      <div class="fl">
        <el-button @click="btnResetData">重 置</el-button>
      </div>
      <el-button @click="btnCancle">取 消</el-button>
      <el-button type="primary" @click="btnSure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Main from './main';
const setColumnsOrderData = (key, data) => {
  const SYS_KEY = 'cxguo';
  localStorage.setItem(`${SYS_KEY}-${key}`, JSON.stringify(data));
};

export default {
  components: { Main },
  props: {
    colData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    tableId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: true
    };
  },
  beforeUnmount() {},
  methods: {
    btnCancle() {
      this.destroy();
    },
    btnSure() {
      const colOrderData = this.$refs.main.getColOrderData();
      const key = this.tableId;
      setColumnsOrderData(key, colOrderData);
      this.$emit('on-col-orderdata-sure', colOrderData);
      this.destroy();
    },
    btnResetData() {
      const key = this.tableId;
      setColumnsOrderData(key, null);
      this.$emit('on-col-orderdata-sure', null);
      this.destroy();
    },
    destroy() {
      this.dialogVisible = false;
      this.$destroy();
      const dialog__wrappers =
        document.getElementsByClassName('el-dialog__wrapper');
      for (let i = 0; i < dialog__wrappers.length; i++) {
        const dialog = dialog__wrappers[i];
        dialog.parentNode.removeChild(dialog);
      }
    },
    handleClose(done) {
      done();
      this.destroy();
    }
  }
};
</script>
