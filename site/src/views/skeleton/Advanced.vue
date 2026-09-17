<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtSkeleton,
  ZtSkeletonItem,
  ZtButton,
  ZtConfigProvider,
} from '@ztechjs/zt-ui';
const animated = ref(true);
</script>
<template>
  <div>
    <ZtButton @click="animated = !animated">{{
      animated ? '停止动画' : '启用动画'
    }}</ZtButton
    ><ZtConfigProvider theme="dark" :border-radius="4"
      ><div class="preview">
        <ZtSkeleton
          ><template #template
            ><div class="profile">
              <ZtSkeletonItem
                shape="circle"
                :width="56"
                :height="56"
                :animated="animated"
              />
              <div class="lines">
                <ZtSkeletonItem
                  :width="120"
                  :animated="animated"
                /><ZtSkeletonItem width="70%" :animated="animated" />
              </div>
            </div>
            <ZtSkeletonItem
              shape="image"
              :height="120"
              :animated="animated" /></template
        ></ZtSkeleton></div
    ></ZtConfigProvider>
  </div>
</template>
<style scoped>
.preview {
  background: #1b2433;
  padding: 20px;
  margin-top: 16px;
}
.profile {
  display: flex;
  gap: 16px;
  align-items: center;
}
.lines {
  flex: 1;
  display: grid;
  gap: 12px;
}
</style>
