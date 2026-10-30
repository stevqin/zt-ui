<script setup lang="ts">
import { ref } from 'vue';
import { ZtColorPicker } from '@ztechjs/zt-ui';
const color = ref('#1677ff80');
</script>

<template>
  <div class="demo">
    <ZtColorPicker v-model="color" show-alpha />
    <p>含透明度的 HEX：{{ color }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
