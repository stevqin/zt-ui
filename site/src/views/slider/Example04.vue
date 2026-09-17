<script setup lang="ts">
import { ZtSlider } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtSlider :model-value="65" status="success" size="large" /><ZtSlider
    :model-value="40"
    disabled
  />
</template>
