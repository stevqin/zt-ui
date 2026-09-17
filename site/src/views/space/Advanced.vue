<script setup lang="ts">
import { ZtSpace, ZtConfigProvider, ZtButton } from '@ztechjs/zt-ui';
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>
<template>
  <ZtSpace direction="vertical" align="stretch" :gap="16"
    ><ZtConfigProvider v-for="size in sizes" :key="size" :size="size"
      ><ZtSpace wrap
        ><ZtButton>{{ size }}</ZtButton
        ><ZtButton>继承间距</ZtButton></ZtSpace
      ></ZtConfigProvider
    ></ZtSpace
  >
</template>
