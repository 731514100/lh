<template>
  <div>
    <SvgIcon v-if="icon" :icon-class="icon" style="font-size: 20px;margin-right: 10px;" />
  </div>
</template>
<script setup>
import { toRefs } from 'vue';
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
});
const { icon } = toRefs(props);
console.log(icon.value, 'icon');
</script>
