<script setup lang="ts">
import {
  createApp,
  defineComponent,
  h,
  onMounted,
  onBeforeUnmount,
  ref,
  type App,
} from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { ZtConfigProvider, ZtMenu, useZtConfig } from '@ztechjs/zt-ui';

const host = ref<HTMLElement>();
const config = useZtConfig();
let app: App | undefined;
const View = defineComponent({ render: () => h('div') });
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'overview', component: View, meta: { title: '经营概览' } },
    { path: '/orders', name: 'orders', component: View, meta: { title: '订单列表' } },
    { path: '/products', name: 'products', component: View, meta: { title: '商品列表' } },
  ],
});
const items = [
  {
    key: 'business',
    label: '业务管理',
    children: [
      { key: 'overview', label: '经营概览', route: { name: 'overview' } },
      {
        key: 'orders',
        label: '订单列表',
        route: { name: 'orders', query: { state: 'pending' } },
      },
      { key: 'products', label: '商品列表', route: { name: 'products' } },
    ],
  },
];

onMounted(() => {
  // 独立应用安装内存路由，路由菜单不会更改宿主应用地址。
  app = createApp({
    setup() {
      return () =>
        h(
          ZtConfigProvider,
          {
            size: config.size.value,
            theme: config.theme.value,
            borderRadius: config.borderRadius.value,
          },
          {
            default: () =>
              h('div', { class: 'route-demo' }, [
                h(ZtMenu, {
                  items,
                  router: true,
                  defaultExpandedKeys: ['business'],
                  width: 200,
                }),
                h('div', [
                  h(
                    'h3',
                    `模拟页面：${router.currentRoute.value.meta.title ?? '加载中'}`,
                  ),
                  h('p', `内存路由：${router.currentRoute.value.fullPath}`),
                  h('p', `当前状态：${router.currentRoute.value.query.state ?? '全部'}`),
                ]),
              ]),
          },
        );
    },
  });
  app.use(router);
  app.mount(host.value!);
});
onBeforeUnmount(() => {
  app?.unmount();
  router.options.history.destroy();
});
</script>
<template>
  <div ref="host" class="host" />
</template>
<style scoped>
.host :deep(.route-demo) {
  display: flex;
  gap: 24px;
  overflow: auto;
}
.host :deep(.route-demo > div) {
  min-width: 250px;
}
</style>
