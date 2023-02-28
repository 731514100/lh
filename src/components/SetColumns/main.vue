<!--
 * @Descripttion:
 * @version:
 * @Author: cxguo
 * @Date: 2019-10-23 21:14:13
 * @LastEditors: cxguo
 * @LastEditTime: 2019-10-29 17:15:19
 -->
<template>
  <div>
    <el-transfer
      v-model="transferExcludeData"
      class="transfer"
      :titles="['已显示字段', '可选字段']"
      :data="transferData"
      :render-content="renderContent"
      @left-check-change="onLeftCheckChange"
      @change="onChange"
    />
  </div>
</template>

<script>
import { mouseMove } from './mixins';
import clonedeep from 'clonedeep';
/**
 * 获取表格列顺序数据
 * @param {唯一键} key
 */
const getColumnsOrderData = (key) => {
  const SYS_KEY = 'cxguo';
  const jsonData = localStorage.getItem(`${SYS_KEY}-${key}`);
  return JSON.parse(jsonData);
};

export default {
  name: 'SetColumns',
  mixins: [mouseMove],
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
      originTransferData: [], // 原始所有的Data
      transferExcludeData: []
    };
  },
  computed: {
    // 经过过滤用于显示的Data
    transferData: function() {
      const transferData = this.originTransferData;
      return transferData.filter((item) => {
        return item.key !== null;
      });
    }
  },
  beforeUnmount() {},
  created() {
    this.initData();
  },
  methods: {
    /**
     * 获取列顺序数据
     */
    getColOrderData() {
      return this.originTransferData;
    },
    renderContent(h, options) {
      const perData = {
        props: {
          size: 'mini',
          circle: true,
          type: 'default',
          icon: 'el-icon-arrow-up'
        },
        on: {
          click: (e) => {
            this.btnPre(e, options);
          }
        }
      };
      const nextData = {
        props: {
          size: 'mini',
          circle: true,
          type: 'default',
          icon: 'el-icon-arrow-down'
        },
        on: {
          click: (e) => {
            this.btnNext(e, options);
          }
        }
      };
      return (
        <div class='col-item'>
          <span>{options.label}</span>
          <span>
            <el-button {...perData}></el-button>
            <el-button {...nextData}></el-button>
          </span>
        </div>
      );
    },
    btnPre(e, options) {
      const selfData = options;
      if (!this.isAllowPre(selfData)) return;
      const selfIndex = selfData.positionIndex;
      const preData = this.originTransferData[selfIndex - 1];
      selfData.positionIndex = selfData.positionIndex - 1;
      preData.positionIndex = preData.positionIndex + 1;
      // this.$set(selfData, 'positionIndex', selfData.positionIndex - 1);
      // this.$set(preData, 'positionIndex', preData.positionIndex + 1);
      this.exchangeCols(selfIndex, selfIndex - 1);
    },
    btnNext(e, options) {
      const selfData = options;
      if (!this.isAllowNext(selfData)) return;
      const selfIndex = selfData.positionIndex;
      const nextData = this.originTransferData[selfIndex + 1];
      selfData.positionIndex = selfData.positionIndex + 1;
      nextData.positionIndex = nextData.positionIndex - 1;
      // this.$set(selfData, 'positionIndex', selfData.positionIndex + 1);
      // this.$set(nextData, 'positionIndex', nextData.positionIndex - 1);
      this.exchangeCols(selfIndex, selfIndex + 1);
    },
    isAllowPre(selfData) {
      const transferData = this.transferData;
      for (let i = 0; i < transferData.length; i++) {
        const item = transferData[i];
        if (item.dataIndex === selfData.dataIndex) {
          if (i === 0) return false;
        }
      }
      return true;
    },
    isAllowNext(selfData) {
      const transferData = this.transferData;
      const length = transferData.length;
      for (let i = 0; i < length; i++) {
        const item = transferData[i];
        if (item.dataIndex === selfData.dataIndex) {
          if (i === length - 1) return false;
        }
      }
      return true;
    },
    exchangeCols(index1, index2) {
      const transferData = this.originTransferData;
      const temp1 = clonedeep(transferData[index1]);
      const temp2 = clonedeep(transferData[index2]);
      transferData.index1 = temp2;
      transferData.index2 = temp1;
      // this.$set(transferData, index1, temp2);
      // this.$set(transferData, index2, temp1);
    },
    initData() {
      const colData = this.colData;
      this.initTransferData(colData);
      this.initExcludeData();
    },
    initExcludeData() {
      this.transferExcludeData.push(...this.getDefaultExcludeData());
    },
    getDefaultExcludeData() {
      const transferData = this.originTransferData;
      const exludeData = transferData.filter((item) => {
        return item.key !== null && item.hidden;
      });
      const exludeDataMap = exludeData.map((item) => {
        return item.key;
      });
      return exludeDataMap;
    },
    initTransferData(colData) {
      const data = this.createTransferData(colData);
      this.originTransferData = data;
    },
    getTransDataByKeys(keyArray) {
      const data = this.originTransferData;
      return data.filter((item) => {
        return keyArray.indexOf(item.key) !== -1;
      });
    },
    createTransferData(colData) {
      const tableId = this.tableId;
      const columnsOrderData = getColumnsOrderData(tableId);
      if (columnsOrderData) return columnsOrderData;
      const result = [];
      colData.forEach((item, i) => {
        const obj = {
          key: item.field,
          label: `${item.title}`,
          positionIndex: i,
          dataIndex: i,
          disabled: item.positionDisable // 不能隐藏
        };
        result.push(obj);
      });
      return result;
    },
    // on
    onLeftCheckChange(params) {},
    onChange(selfDataKeys, derection, changeDataKeys) {
      const changeData = this.getTransDataByKeys(changeDataKeys);
      changeData.forEach((item) => {
        if (derection === 'right') {
          item.hidden = true;
        } else {
          item.hidden = false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.transfer {
  :deep(.col-item) {
    height: 30px;
    overflow: hidden;
    span {
      display: inline-block;
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      width: 180px; /*需要配合宽度来使用*/
    }
  }
  :deep(.el-transfer-panel) {
    width: 360px;
  }
  :deep(.el-button) {
    padding: 4px !important;
  }
  :deep(.el-button + .el-button) {
    margin-left: 4px;
  }
}
</style>
