<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput } from '@ztechjs/zt-ui';
const domain = ref('zt-ui');
</script>

<template>
  <ZtInput v-model="domain"
    ><template #prepend>https://</template><template #prefix>🔎</template
    ><template #suffix>.com</template><template #append>访问</template></ZtInput
  >
</template>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
.input-demo > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
