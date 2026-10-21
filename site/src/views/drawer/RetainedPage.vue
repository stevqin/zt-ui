<script setup lang="ts">
import {defineComponent, h, KeepAlive, ref} from 'vue';
import {ZtButton, ZtDrawer} from '@ztechjs/zt-ui';
const page = ref('detail');
const CachedPage = defineComponent({
  setup() {
    const visible = ref(false);
    return () => h('div', [
      h(ZtButton, {status: 'primary', onClick: () => visible.value = true}, () => '打开缓存页抽屉'),
      h(ZtDrawer, {modelValue: visible.value, 'onUpdate:modelValue': (value: boolean) => visible.value = value, title: '缓存页面中的抽屉'}, {
        default: () => h('p', '点击离开缓存页后，抽屉会自动关闭并释放滚动锁；返回时不会遗留窗口。'),
        'header-actions': () => h(ZtButton, {size: 'small', onClick: () => page.value = 'list'}, () => '离开缓存页'),
      }),
    ]);
  },
});
</script>
<template>
  <KeepAlive><CachedPage v-if="page === 'detail'" /></KeepAlive>
  <div v-if="page === 'list'">
    <p>已切换到列表页，原详情页保留在 KeepAlive 缓存中。</p>
    <ZtButton @click="page = 'detail'">返回详情页</ZtButton>
  </div>
</template>
