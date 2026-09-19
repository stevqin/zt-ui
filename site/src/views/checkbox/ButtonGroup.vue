<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';

const selected = ref(['design', 'develop']);
</script>

<template>
  <ZtCheckboxGroup v-model="selected" segmented>
    <ZtCheckbox value="design">设计</ZtCheckbox>
    <ZtCheckbox value="develop">开发</ZtCheckbox>
    <ZtCheckbox value="test">测试</ZtCheckbox>
    <ZtCheckbox value="release" disabled>发布</ZtCheckbox>
  </ZtCheckboxGroup>
</template>
