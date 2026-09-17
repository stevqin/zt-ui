<script setup lang="ts">
import { ref } from 'vue'
import { ZtSelect } from '@ztechjs/zt-ui'
const value = ref([1, 2, 3, 4])
const options = ['杭州', '上海', '北京', '深圳'].map((label, index) => ({ label, value: index + 1 }))
</script>
<template>
  <ZtSelect v-model="value" :options="options" multiple filterable collapse-tags :max-collapse-tags="2" aria-label="折叠标签城市选择" />
</template>
