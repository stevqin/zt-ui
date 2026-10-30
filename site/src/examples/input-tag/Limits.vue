<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputTag } from '@ztechjs/zt-ui';
const codes = ref<string[]>([]);
const hint = ref('');
</script>

<template>
  <div class="demo">
    <ZtInputTag
      v-model="codes"
      :max="4"
      :separators="[',', ';']"
      commit-on="enter"
      @limit="hint = '最多四个标签'"
      placeholder="试试粘贴 A01,B02;C03"
    />
    <p>{{ hint }} {{ codes.join(' / ') }}</p>
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
