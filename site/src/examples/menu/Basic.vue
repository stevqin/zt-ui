<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtMenu } from '@ztechjs/zt-ui';
const items = [
  {
    key: 'work',
    label: '工作台',
    children: [
      { key: 'overview', label: '经营概览' },
      { key: 'tasks', label: '待办事项', description: '12' },
    ],
  },
  {
    key: 'goods',
    label: '商品管理',
    children: [
      { key: 'products', label: '商品列表' },
      { key: 'stock', label: '库存查询' },
    ],
  },
  { key: 'settings', label: '系统设置', disabled: true },
];
const selected = ref('overview'),
  expanded = ref(['work']),
  collapsed = ref(false);
</script>
<template>
  <div class="menu-demo">
    <ZtMenu
      v-model="selected"
      v-model:expanded-keys="expanded"
      v-model:collapsed="collapsed"
      :items="items"
      collapsible
      resizable
      :width="230"
      accordion
    />
    <section>
      <h3>{{ selected }}</h3>
      <p>选中菜单后业务内容在这里更新。</p>
      <p>侧栏{{ collapsed ? '已折叠' : '已展开' }}</p>
    </section>
  </div>
</template>
<style scoped>
.menu-demo {
  display: flex;
  gap: 24px;
  align-items: stretch;
  overflow: auto;
}
.menu-demo section {
  min-width: 180px;
  padding: 12px;
}
</style>
