<template>
  <el-select ref="select" :value="valueTitle" class="font12" :clearable="clearable" @clear="clearHandle">
    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        v-bind="$attrs"
        @node-click="handleNodeClick"
      />
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ElTreeSelect',
  props: {
    // 配置项
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'title', // 显示名称
          children: 'children' // 子级字段名
        };
      }
    },
    // 选项列表数据(树形结构的对象数组)
    options: { type: Array, default: () => { return []; } },
    // 初始值
    value: { type: [Number, String], default: null },
    // 可清空选项
    clearable: { type: Boolean, default: true },
    // 自动收起
    accordion: { type: Boolean, default: false }
  },
  data() {
    return {
      valueId: null,
      valueTitle: '',
      defaultExpandedKey: []
    };
  },
  watch: {
    value: {
      handler() {
        this.valueId = this.value;
        this.initHandle();
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
        const selectTree = this.$refs.selectTree;
        if (!selectTree) return;
        this.valueTitle = selectTree.getNode(this.valueId).data[this.props.label]; // 初始化显示
        selectTree.setCurrentKey(this.valueId); // 设置默认选中
        this.defaultExpandedKey = [this.valueId]; // 设置默认展开
      }
      this.initScroll();
    },

    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        const scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0];
        const scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar');
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;';
        // eslint-disable-next-line no-return-assign
        scrollBar.forEach(ele => ele.style.width = 0);
      });
    },

    // 切换选项
    handleNodeClick(node) {
      this.valueTitle = node[this.props.label];
      this.valueId = node[this.props.value];
      this.$emit('getValue', this.valueId);
      this.defaultExpandedKey = [];
      this.$refs.select.blur();
    },

    // 清除选中
    clearHandle() {
      this.valueTitle = '';
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit('getValue', null);
    },

    // 清空选中样式
    clearSelected() {
      const allNode = document.querySelectorAll('#tree-option .el-tree-node');
      allNode.forEach((element) => element.classList.remove('is-current'));
    }

  }
};
</script>

<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree >>>.el-tree-node__label {
    font-weight: normal; font-size: 12px;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
</style>
