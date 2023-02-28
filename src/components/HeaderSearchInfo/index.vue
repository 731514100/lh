<template>
  <div class="header-search-info">
    <el-row>
      <el-col :span="20">
        <el-row :gutter="10">
          <el-col
            v-for="(item, i) in headerInfo"
            :key="item.key || i"
            :span="item.span"
            class="flex-acenter"
          >
            <div class="flex-acenter" style="width: 100%; white-space: nowrap">
              <div>{{ item.label }}：</div>
              <el-input v-if="!item.type || item.type === 'input'" v-model="item.value" :placeholder="item.placeholder" v-bind="item.input" />
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4" class="flex-jend">
        <el-button
          v-for="item in btnInfo"
          :key="item.type"
          type="primary"
          size="small"
          @click="btnEvent(item)"
        >{{ item.label }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default { name: 'HeaderSearchInfo' };
</script>

<script setup>
import { defineProps, toRefs, defineEmits } from 'vue';
const props = defineProps({
  headerInfo: {
    type: Array,
    default: () => []
  },
  btnInfo: {
    type: Array,
    default: () => [
      {
        type: 'find',
        label: '查询'
      },
      {
        type: 'add',
        label: '添加'
      }
    ]
  }
});
const emit = defineEmits(['btnEvent']);
const { headerInfo } = toRefs(props);

const btnEvent = info => {
  emit('btnEvent', info);
};

console.log(props.headerInfo);
</script>

<style lang="scss" scoped>
.header-search-info {
  padding: 10px 0 0 0;
  .el-col {
    margin-bottom: 10px;
  }
}
</style>
