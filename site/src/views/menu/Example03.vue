<script setup lang="ts">
import { ZtMenu } from '@ztechjs/zt-ui';
import type { ZtMenuStatus } from '@ztechjs/zt-ui';
const statuses: ZtMenuStatus[] = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
</script>

<template>
  <div class="menu-palettes">
    <div v-for="color in statuses" :key="color">
      <p>{{ color }}</p>
      <ZtMenu
        model-value="one"
        :items="[
          { key: 'one', label: '基本信息' },
          { key: 'two', label: '安全设置' },
          { key: 'three', label: '操作日志', disabled: true },
        ]"
        size="small"
        :status="color"
        :aria-label="color + '主题菜单'"
      />
    </div>
  </div>
</template>

<style scoped>
.menu-palettes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.menu-palettes p {
  margin: 0 0 6px !important;
}
@media (max-width: 600px) {
  .menu-palettes {
    grid-template-columns: 1fr;
  }
}
</style>
