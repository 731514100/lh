<template>
  <div style="width: 100%">
    <LhTable
      :table-config="tableConfig"
      class="table-speck"
      :pageination="false"
    />
  </div>
</template>

<script>
import LhTable from '@/components/LhTable';
export default {
  components: {
    LhTable
  },
  provide() {
    return {
      tableInfo: this.p_tableInfo
    };
  },
  props: {
    info: {
      type: Array,
      default: () => []
    },
    tableConfig: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      p_tableInfo: {
        tableData: []
      }
    };
  },
  watch: {
    info(newValue, oldValue) {
      this.p_tableInfo.tableData = this.info;
    }
  },
  created() {
    this.p_tableInfo.tableData = this.info;
  }
};
</script>

<style lang="scss" scoped>
:deep(.table-speck) {
  .lh-table {
    position: static;
  }
  .el-table--fit {
    position: static;
  }
}
</style>
