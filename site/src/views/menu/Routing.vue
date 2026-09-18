<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtMenuStatus } from '@ztechjs/zt-ui';
// 依赖：项目已 app.use(router)。请将本示例注册为
// { path: '/menu', name: 'menu-demo', component: MenuRoutingExample }。
// 查询参数只切换示例内容，不需要额外注册 orders/daily/monthly 页面。
import { useRoute, useRouter } from 'vue-router';
import { ZtMenu, ZtButton } from '@ztechjs/zt-ui';
import type { ZtMenuItem } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtMenuStatus>('primary');
const route = useRoute(),
  router = useRouter();
const items: ZtMenuItem[] = [
  { key: '/menu', label: '菜单概览' },
  {
    key: 'orders',
    label: '订单管理',
    route: { name: 'menu-demo', query: { view: 'orders' } },
  },
  {
    key: 'reports',
    label: '报表中心',
    children: [
      {
        key: 'daily',
        label: '日报',
        route: { path: '/menu', query: { view: 'daily' } },
      },
      { key: 'monthly', label: '月报', route: '/menu?view=monthly' },
    ],
  },
];
</script>
<template>
  <ZtMenu
    :status="demoStatus"
    router
    mode="horizontal"
    menu-trigger="click"
    :items="items"
    aria-label="路由示例导航"
  />
  <div class="route-preview">
    <strong>{{
      route.query.view === 'orders'
        ? '订单管理'
        : route.query.view === 'daily'
          ? '经营日报'
          : route.query.view === 'monthly'
            ? '经营月报'
            : '菜单概览'
    }}</strong
    ><code>{{ route.fullPath }}</code>
    <p>点击菜单会改变真实 URL；浏览器前进、后退和代码跳转都会同步高亮。</p>
    <ZtButton size="small" @click="router.push('/menu?view=daily')"
      >通过代码跳转到日报</ZtButton
    >
  </div>
</template>
<style scoped>
.route-preview {
  padding: 20px;
  background: var(--zt-surface-soft);
  border-radius: var(--zt-radius);
  margin-top: 14px;
}
.route-preview code {
  display: block;
  margin-top: 8px;
  overflow-wrap: anywhere;
}
.route-preview p {
  font-size: 13px;
}
</style>
