<script setup lang="ts">
import { ref } from 'vue';
import { ZtEmpty, ZtButton } from '@ztechjs/zt-ui';
const created = ref(false);
</script>
<template>
  <div>
    <ZtEmpty v-if="!created" description="还没有报表"
      ><ZtButton status="primary" @click="created = true"
        >创建报表</ZtButton
      ></ZtEmpty
    >
    <div v-else>
      报表已创建。<ZtButton @click="created = false">重置示例</ZtButton>
    </div>
  </div>
</template>
