<!--
 * @Descripttion:
 * @version:
 * @Author: cxguo
 * @Date: 2019-09-30 15:01:07
 * @LastEditors: cxguo
 * @LastEditTime: 2020-06-08 16:55:06
 -->
<template>
  <div :class="fixed" :style="`width:${wrapperWidth}`">
    <slot>Affix</slot>
  </div>
</template>

<script>
import { srcoll } from './mixins';
export default {
  name: 'Affix',
  mixins: [srcoll],
  data() {
    return {
      offsetWidth: null
    };
  },
  computed: {
    'wrapperWidth': function() {
      return this.offsetWidth;
    }
  },
  mounted() {
    const offsetWidth = this.$el.offsetWidth || 0;
    this.offsetWidth = `${offsetWidth}px`;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scope>
  .fixed {
    position: fixed; top:0; left: 80px;
    text-align: right;
    z-index: 10;
  }
  .default {
    position:absolute; left: 0; top: 0; z-index: 1;
  }
</style>
