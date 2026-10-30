<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const agreed = ref(false);
const channels = ref<unknown[]>(['online']);
</script>

<template>
  <div class="demo">
    <ZtCheckbox v-model="agreed">接受通知</ZtCheckbox>
    <ZtCheckboxGroup v-model="channels" :max="2">
      <ZtCheckbox value="online">线上</ZtCheckbox>
      <ZtCheckbox value="store">门店</ZtCheckbox>
      <ZtCheckbox value="wholesale" disabled>批发</ZtCheckbox>
    </ZtCheckboxGroup>
    <p>接受通知：{{ agreed }}；渠道：{{ channels }}</p>
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
