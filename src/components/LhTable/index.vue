<template>
  <div v-loading="loadings" class="lh-table" element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-table
      ref="LHTable"
      border
      :class="['table-msg color-table ', className]"
      :stripe="stripe"
      :highlight-current-row="highlight"
      :size="size"
      :data="tableDataCheck"
      :max-height="height"
      :row-class-name="rowClassName"
      :style="{ height: pageination ? 'calc(100% - 60px)' : '100%' }"
      :span-method="spanMethod"
      @cell-dblclick="(param) => $emit('cell-dblclick', param)"
      @cell-click="(param) => $emit('cell-click', param)"
      @selection-change="(param) => $emit('selection-change', param)"
      @sort-change="(param) => $emit('sort-change', param)"
    >
      <template
        v-for="colConfig in tableConfig.filter(
          (item) => item.lhDisplay !== 'none'
        )"
      >
        <el-table-column
          v-if="!colConfig.type"
          v-bind="colConfig"
          :key="colConfig['id']"
          align="center"
        >
          <template #header="scope">
            <render
              v-if="colConfig.headerRender"
              :key="colConfig['id']"
              :render="colConfig.headerRender"
              :row="scope.row"
              :index="scope.$index"
              :column="colConfig"
            />
            <span v-else>{{ colConfig.label }}</span>
          </template>
          <template #default="scope">
            <render
              v-if="colConfig.render"
              :key="colConfig['id']"
              :render="colConfig.render"
              :row="scope.row"
              :index="scope.$index"
              :column="colConfig"
            />
            <span v-else>{{
              scope.row[colConfig && colConfig.prop] || "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else :key="colConfig['id']" v-bind="colConfig" align="center" />
      </template>
    </el-table>
    <el-pagination
      v-if="pageination"
      small
      background
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page="currentPage"
      :total="totalNum"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import { h } from 'vue';
const pageination = {
  currentPage: 1,
  totalNum: 0,
  pageSize: 30,
  pageSizes: [10, 15, 20, 30, 50, 100]
};
const render = {
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: function() {
    const params = {
      row: this.row,
      index: this.index
    };
    if (this.column) params.column = this.column;
    return this.render(h, params);
  }
};
export default {
  name: 'LhTable',
  components: {
    // table配置里面使用h函数的渲染原理
    render
  },
  // 如果只有一个表格直接 provide/inject 多个表格则组件传参方式
  inject: {
    // 分页信息；格式等同于组件传参 p_pageinationInfo
    pageinationInfo: {
      default: () => ({
        // 唯一标识
        lh_spe_flag: true
      })
    },
    // 表格信息；格式等同于组件传参 p_tableInfo
    tableInfo: {
      default: () => ({
        // 唯一标识
        lh_spe_flag: true
      })
    }
  },
  props: {
    // table配置信息
    tableConfig: {
      type: Array,
      default: () => [
        {
          label: '序号',
          type: 'index',
          width: '80px'
        },
        {
          label: '名字',
          prop: 'name'
        },
        {
          label: '公司名称',
          prop: 'cmyName'
        }
      ]
    },
    // table的一些信息
    // eslint-disable-next-line vue/prop-name-casing
    p_tableInfo: {
      type: Object,
      default: () => ({
        // table的数据源
        tableData: [],
        // 是否开启加载等待
        loading: false
      })
    },
    // 分页配置
    // eslint-disable-next-line vue/prop-name-casing
    p_pageinationInfo: {
      type: Object,
      default: () => pageination
    },
    // 高度设置 具体参考官网的
    height: {
      type: Number,
      default: 250
    },
    // 是否显示分页器
    pageination: {
      type: Boolean,
      default: true
    },
    // 官网的
    size: {
      type: String,
      default: 'small'
    },
    // 官网的：highlight-current-row；高亮行
    highlight: {
      type: Boolean,
      default: true
    },
    // 给el-table添加class
    className: {
      type: String,
      default: ''
    },
    // 斑马条
    stripe: {
      type: Boolean,
      default: true
    },
    // 行样式回调函数  （官网的）
    // eslint-disable-next-line vue/require-default-prop
    rowClassName: {
      type: Function
    },
    // 单元格合并回调函数（官网的）
    // eslint-disable-next-line vue/require-default-prop
    spanMethod: {
      type: Function
    },
    // 是否开启滚动加载功能
    rollScroll: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: [Function, Boolean],
      default: false
    },
    // 排序
    sortable: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    const { currentPage, totalNum, pageSize, pageSizes } = this
      .pageinationInfo.lh_spe_flag
      ? this.p_pageinationInfo
      : this.pageinationInfo || pageination;
    return {
      currentPage, // 当前页数
      totalNum, // 数据总条数
      pageSize, // 每页数据的条数
      pageSizes // 选择每页的条数
    };
  },
  computed: {
    // 表格开启 加载等待
    loadings() {
      return this.tableInfo.lh_spe_flag
        ? this.p_tableInfo.loading || false
        : (this.tableInfo && this.tableInfo.loading) || false;
    },
    // 判断表格的渲染内容（ tableData ）选择哪一个【判断是provide/inject还是组件传参模式】
    tableDataCheck() {
      return this.tableInfo.lh_spe_flag
        ? this.p_tableInfo.tableData
        : this.tableInfo.tableData;
    },
    // 判断分页信息选择哪一个
    pageinationInfoCheck() {
      return this.pageinationInfo.lh_spe_flag
        ? this.p_pageinationInfo
        : this.pageinationInfo;
    }
  },
  watch: {
    // 监听表格 总数 变化
    'pageinationInfo.totalNum'(n) {
      this.totalNum = n;
    },
    // 监听表格 当前页 变化
    'pageinationInfo.currentPage'(n) {
      this.currentPage = n;
    }
  },
  created() {
    // 是否开启滚动加载
    this.rollScroll && this.$nextTick(() => this.addRollListener());
  },
  methods: {
    handleCurrentChange(v) {
      this.$emit('current-change', v);
    },
    handleSizeChange(v) {
      this.$emit('size-change', v);
    },
    // 添加滚动加载
    addRollListener() {
      const dom = this.$refs.LHTable.bodyWrapper;
      dom.addEventListener('scroll', () => {
        const { pageSize, currentPage, totalNum } = this.pageinationInfoCheck;
        const all = pageSize * currentPage;
        const scrollTop = dom.scrollTop;
        // 变量windowHeight是可视区的高度
        const windowHeight = dom.clientHeight || dom.clientHeight;
        // 变量scrollHeight是滚动条的总高度
        const scrollHeight = dom.scrollHeight || dom.scrollHeight;
        if (scrollTop + windowHeight + 1 > scrollHeight) {
          if (all < totalNum) {
            // 表格置空不能有滚动加载
            if (this.tableDataCheck.length < 1) return;
            // 以下两个都是 通知父组件
            this.rollScroll(this.pageinationInfoCheck);
            // 这里使用到了 lodash 的 _.isBoolean 方法，判断是否是Boolean；可以自己写个或者去掉；
            typeof this.rollScroll === 'boolean' &&
              this.$emit('roll-scroll', this.pageinationInfoCheck);
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.lh-table {
  position: relative;
  height: 100%;
  .table-msg {
    position: absolute;
  }
  .el-pagination {
    position: absolute;
    bottom: 0;
  }
  ::v-deep .el-table__body-wrapper {
    height: 100% !important;
    .el-table__empty-block {
      min-height: 10px !important;
    }
  }
}
</style>
