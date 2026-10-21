<script setup lang="ts">
import { ZtButton, ZtPopconfirm } from '@ztechjs/zt-ui';
import type { ZtComponentSize } from '@ztechjs/zt-ui';
const sizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large'];
</script>

<template>
  <div class="size-examples">
    <div class="size-row">
      <ZtPopconfirm v-for="size in sizes" :key="size" :size="size" title="确认提交这条记录？" description="面板、文字、图标和操作按钮统一跟随 size。">
        <ZtButton>{{ size }}</ZtButton>
      </ZtPopconfirm>
    </div>
    <div class="size-row">
      <ZtPopconfirm title="继承全局尺寸" description="修改页面顶部的全站尺寸，触发按钮和确认浮层会同步变化。">
        <ZtButton>继承全局尺寸</ZtButton>
      </ZtPopconfirm>
      <ZtPopconfirm size="large" button-size="mini" title="大号面板与小号按钮" description="button-size 仅覆盖确认、取消按钮，不影响面板和触发器。">
        <ZtButton>large 面板 / mini 操作按钮</ZtButton>
      </ZtPopconfirm>
    </div>
  </div>
</template>

<style scoped>
.size-examples { display: grid; gap: 18px; }
.size-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
</style>
