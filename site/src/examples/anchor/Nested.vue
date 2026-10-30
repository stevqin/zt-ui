<script setup lang="ts">
import { ref, useId } from 'vue';
import { ZtAnchor } from '@ztechjs/zt-ui';
const scroller = ref<HTMLElement>(),
  prefix = useId();
const links = [
  {
    title: '销售分析',
    href: `#${prefix}-sales`,
    children: [
      { title: '区域销售', href: `#${prefix}-region` },
      { title: '门店销售', href: `#${prefix}-store` },
    ],
  },
];
</script>
<template>
  <div class="anchor-demo">
    <ZtAnchor :links="links" :container="() => scroller" :smooth="false" />
    <div ref="scroller" class="scroll">
      <section :id="`${prefix}-sales`"><h3>销售分析</h3></section>
      <section :id="`${prefix}-region`">
        <h4>区域销售</h4>
        <p>华东占比 42%</p>
      </section>
      <section :id="`${prefix}-store`">
        <h4>门店销售</h4>
        <p>直营门店表现</p>
      </section>
    </div>
  </div>
</template>
<style scoped>
.anchor-demo {
  display: flex;
  gap: 16px;
}
.scroll {
  height: 240px;
  overflow: auto;
  flex: 1;
  border: 1px solid #8884;
  padding: 12px;
}
.scroll section {
  min-height: 180px;
}
</style>
