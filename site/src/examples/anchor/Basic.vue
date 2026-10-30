<script setup lang="ts">
import { ref, useId } from 'vue';
import { ZtAnchor } from '@ztechjs/zt-ui';
const scroller = ref<HTMLElement>(),
  selected = ref(''),
  prefix = useId();
const titles = ['经营概览', '销售结构', '库存分析'];
const links = titles.map((title, index) => ({ title, href: `#${prefix}-${index}` }));
</script>
<template>
  <div class="anchor-demo">
    <ZtAnchor
      :links="links"
      :container="() => scroller"
      :offset="8"
      @select="selected = $event"
    />
    <div ref="scroller" class="scroll">
      <section v-for="(title, index) in titles" :id="`${prefix}-${index}`" :key="title">
        <h3>{{ title }}</h3>
        <p>{{ title }}的经营指标和分析结论。</p>
      </section>
    </div>
  </div>
  <p>最近跳转：{{ selected || '尚未选择' }}</p>
</template>
<style scoped>
.anchor-demo {
  display: flex;
  gap: 16px;
}
.anchor-demo > .zt-anchor {
  width: 140px;
  flex-shrink: 0;
}
.scroll {
  height: 260px;
  overflow: auto;
  flex: 1;
  border: 1px solid #8884;
  padding: 12px;
}
.scroll section {
  min-height: 220px;
}
</style>
