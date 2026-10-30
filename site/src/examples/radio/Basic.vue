<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const value = ref('standard');
</script>

<template>
  <div class="demo">
    <ZtRadioGroup v-model="value" name="delivery">
      <ZtRadio label="standard">普通配送</ZtRadio>
      <ZtRadio label="express">加急配送</ZtRadio>
      <ZtRadio label="pickup" disabled>到店自提</ZtRadio>
    </ZtRadioGroup>
    <p>配送：{{ value }}</p>
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
