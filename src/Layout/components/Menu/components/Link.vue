
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component
    is="a"
    v-if="isExternal(to)"
    :href="to"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </component>
  <component
    is="router-link"
    v-else
    :to="to"
  >
    <slot />
  </component>
</template>

<script setup>
import { isExternal } from '@/utils/validate';
import { toRefs } from 'vue';
const props = defineProps({
  to: {
    type: String,
    required: true
  }
});
const { to } = toRefs(props);
</script>
