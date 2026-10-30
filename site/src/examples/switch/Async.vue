<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const value = ref(false);
const loading = ref(false);
const result = ref('尚未保存');
async function save() {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  loading.value = false;
  result.value = `已保存：${value.value ? '开启' : '关闭'}`;
}
</script>

<template>
  <div class="demo">
    <ZtSwitch v-model="value" :loading="loading" @change="save" active-text="邮件订阅" />
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
