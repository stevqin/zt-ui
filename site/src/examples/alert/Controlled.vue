<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtAlert, ZtButton } from '@ztechjs/zt-ui';
const visible = ref(true);
</script>
<template>
  <ZtButton @click="visible = true">再次查看提示</ZtButton>
  <ZtAlert
    v-model="visible"
    title="保存成功"
    description="草稿已保存，可继续编辑。"
    status="success"
    show-icon
  />
  <p>提示{{ visible ? '显示中' : '已关闭' }}</p>
</template>
