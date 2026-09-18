<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtMenuStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtMenu, ZtSwitch, ZtSelect } from '@ztechjs/zt-ui';
import type { ZtComponentSize, ZtMenuItem } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtMenuStatus>('primary');
const disabled = ref(false),
  size = ref<ZtComponentSize>('default'),
  selected = ref('orders');
const sizes = ['mini', 'small', 'default', 'medium', 'large'].map((value) => ({
  label: value,
  value,
}));
const items: ZtMenuItem[] = [
  {
    key: 'business',
    label: '业务',
    children: [
      { key: 'orders', label: '订单' },
      { key: 'members', label: '会员' },
    ],
  },
  {
    key: 'locked',
    label: '禁用父菜单',
    disabled: true,
    children: [{ key: 'private', label: '内部设置' }],
  },
];
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtSwitch v-model="disabled" active-text="禁用整个菜单" /><ZtSelect
        v-model="size"
        :options="sizes"
        aria-label="菜单尺寸"
      />
    </div>
    <ZtMenu
      :status="demoStatus"
      v-model="selected"
      :items="items"
      :default-expanded-keys="['business']"
      :disabled="disabled"
      :size="size"
      :width="240"
      aria-label="默认展开的业务导航"
    />
    <p>当前选择：{{ selected }}</p>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
