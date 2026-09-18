<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import { ZtMenu, ZtSlider, ZtSwitch } from '@ztechjs/zt-ui';
import type { ZtMenuItem, ZtMenuStatus } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtMenuStatus>('primary');
const selected = ref('orders'),
  active = ref('commerce'),
  collapsed = ref(false),
  width = ref<number | string>(312);
const items: ZtMenuItem[] = [
  {
    key: 'commerce',
    label: '业务中心',
    children: [
      {
        key: 'trade',
        label: '交易管理',
        type: 'group',
        children: [
          { key: 'orders', label: '订单中心', description: '128' },
          { key: 'refunds', label: '退款售后' },
          {
            key: 'reports',
            label: '交易报表',
            children: [
              { key: 'daily', label: '日报' },
              { key: 'monthly', label: '月报' },
            ],
          },
        ],
      },
      {
        key: 'catalog',
        label: '商品管理',
        type: 'group',
        children: [
          { key: 'products', label: '商品资料' },
          { key: 'inventory', label: '库存预警' },
          { key: 'pricing', label: '价格审批', disabled: true },
        ],
      },
    ],
  },
  {
    key: 'analytics',
    label: '数据分析',
    children: [
      { key: 'dashboard', label: '经营看板' },
      {
        key: 'channels',
        label: '渠道分析',
        children: [
          { key: 'online', label: '线上渠道' },
          { key: 'stores', label: '门店渠道' },
        ],
      },
      { key: 'exports', label: '导出任务' },
    ],
  },
  {
    key: 'team',
    label: '组织管理',
    children: [
      { key: 'members', label: '成员管理' },
      { key: 'roles', label: '角色权限' },
      { key: 'audit', label: '审计日志' },
    ],
  },
  {
    key: 'locked',
    label: '高级功能',
    disabled: true,
    children: [{ key: 'automation', label: '自动化' }],
  },
];
</script>
<template>
  <div class="menu-config">
    <ZtSwitch v-model="collapsed" active-text="折叠菜单" /><label
      >基准宽度 {{ width }}px<ZtSlider
        :model-value="Number(width)"
        @update:model-value="
          (value) => {
            if (typeof value === 'number') width = value;
          }
        "
        :min="260"
        :max="480"
        :show-tooltip="false"
        size="small"
        aria-label="两栏菜单基准宽度"
    /></label>
  </div>
  <div class="menu-workspace">
    <ZtMenu
      v-model="selected"
      v-model:active-key="active"
      v-model:collapsed="collapsed"
      v-model:width="width"
      :items="items"
      mode="double"
      :status="demoStatus"
      :min-width="220"
      :max-width="560"
      collapsible
      resizable
      :default-expanded-keys="['reports', 'channels']"
      aria-label="业务系统导航"
    />
    <div class="menu-workspace__content">
      <span>工作空间</span><strong>{{ selected }}</strong>
      <p>左栏选择业务模块，右栏完成具体导航。</p>
      <small
        >可拖动菜单右边缘改变宽度；折叠后点击模块打开浮层，选中子菜单后自动收起。</small
      >
    </div>
  </div>
</template>
<style scoped>
.menu-config {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.menu-config > label {
  width: 190px;
  font-size: 12px;
  color: var(--zt-text-muted, #65768c);
}
.menu-workspace {
  display: flex;
  border: 1px solid var(--zt-border, #e1e8f1);
  border-radius: var(--zt-radius, 11px);
  min-width: 0;
  overflow: visible;
}
.menu-workspace > .zt-menu {
  flex-shrink: 0;
  border-right: 1px solid var(--zt-border, #e1e8f1);
}
.menu-workspace__content {
  min-width: 100px;
  flex: 1;
  padding: 24px 18px;
  background: var(--zt-surface-soft, #f5f7fb);
  border-radius: 0 var(--zt-radius, 11px) var(--zt-radius, 11px) 0;
  color: var(--zt-text-muted, #65768c);
}
.menu-workspace__content > span {
  font-size: 10px;
  letter-spacing: 0.1em;
}
.menu-workspace__content strong {
  display: block;
  margin: 16px 0;
  font-size: 17px;
  overflow-wrap: anywhere;
  color: var(--zt-text, #20304a);
}
.menu-workspace__content small {
  font-size: 11px;
  line-height: 1.8;
}
@media (max-width: 700px) {
  .menu-workspace {
    flex-direction: column;
  }
  .menu-workspace > .zt-menu {
    border-right: 0;
    border-bottom: 1px solid var(--zt-border, #e1e8f1);
  }
  .menu-workspace__content {
    border-radius: 0;
    padding: 16px;
  }
}
</style>
