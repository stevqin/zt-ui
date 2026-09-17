<script setup lang="ts">
import { ZtText } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="text-row">
    <ZtText tag="strong">强调内容</ZtText><ZtText tag="code">const total = 8</ZtText
    ><ZtText tag="mark">重点标记</ZtText>
  </div>
</template>

<style scoped>
.text-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.text-limit {
  display: grid;
  gap: 18px;
  width: min(360px, 100%);
}
</style>
