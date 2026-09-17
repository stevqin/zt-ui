<script setup lang="ts">
import { ref } from 'vue';
import { ZtSpace, ZtButton } from '@ztechjs/zt-ui';
const visible = ref(false);
</script>
<template>
  <ZtSpace :gap="[12, 20]" wrap
    ><ZtButton @click="visible = !visible">切换中间项</ZtButton
    ><ZtButton v-if="visible">可选操作</ZtButton><ZtButton>末项</ZtButton
    ><template #separator>·</template></ZtSpace
  >
</template>
