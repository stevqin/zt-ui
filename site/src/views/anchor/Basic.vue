<script setup lang="ts">
import { ref } from 'vue';
import { ZtAnchor } from '@ztechjs/zt-ui';
const viewport = ref<HTMLElement>();
const links = [
  {
    href: '#anchor-overview',
    title: '经营总览',
    children: [{ href: '#anchor-sales', title: '销售分析' }],
  },
  { href: '#anchor-stock', title: '库存分析' },
];
</script>
<template>
  <div class="demo">
    <ZtAnchor :links="links" :container="() => viewport" :offset="12" />
    <div ref="viewport" class="viewport">
      <section id="anchor-overview">
        <h3>经营总览</h3>
        导航始终在当前滚动区域内定位。
      </section>
      <section id="anchor-sales">
        <h3>销售分析</h3>
        嵌套章节缩进展示。
      </section>
      <section id="anchor-stock">
        <h3>库存分析</h3>
        手动滚动也会同步活动章节。
      </section>
    </div>
  </div>
</template>
<style scoped>
.demo {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 16px;
}
.viewport {
  height: 280px;
  overflow: auto;
  border: 1px solid #8a9ab044;
  border-radius: 8px;
}
.viewport section {
  min-height: 260px;
  padding: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #8a9ab044;
}
@media (max-width: 480px) {
  .demo {
    grid-template-columns: 100px minmax(0, 1fr);
  }
}
</style>
