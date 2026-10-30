<script setup lang="ts">
import { ref } from 'vue';
import { ZtModal, ZtButton, ZtInput } from '@ztechjs/zt-ui';
const open = ref(false);
const name = ref('秋冬上新');
const result = ref('');
function confirm() {
  result.value = `已保存：${name.value}`;
  open.value = false;
}
</script>

<template>
  <div class="demo">
    <ZtButton @click="open = true">编辑活动</ZtButton>
    <ZtModal v-model="open" title="编辑活动" show-footer @confirm="confirm">
      <ZtInput v-model="name" placeholder="活动名称" />
    </ZtModal>
    <p>{{ result }}</p>
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
