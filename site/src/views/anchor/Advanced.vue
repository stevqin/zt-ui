<script setup lang="ts">
import { ref } from 'vue';
import { ZtAnchor, ZtConfigProvider } from '@ztechjs/zt-ui';
const panel = ref<HTMLElement>(),
  selected = ref('尚未选择');
const links = [
  { href: '#anchor-settings', title: '配置' },
  { href: '#anchor-done', title: '完成' },
];
</script>
<template>
  <ZtConfigProvider theme="dark"
    ><div class="dark">
      <ZtAnchor
        :links="links"
        :container="() => panel"
        :smooth="false"
        @select="selected = $event"
        ><template #link="{ link, active }"
          >{{ active ? '●' : '○' }} {{ link.title }}</template
        ></ZtAnchor
      >
      <p>{{ selected }}</p>
      <div ref="panel" class="panel">
        <section id="anchor-settings">即时定位模式</section>
        <section id="anchor-done">减少动画偏好也会自动禁用平滑滚动</section>
      </div>
    </div></ZtConfigProvider
  >
</template>
<style scoped>
.dark {
  background: #1b2433;
  color: #eef2ff;
  padding: 16px;
}
.panel {
  height: 180px;
  overflow: auto;
}
.panel section {
  height: 200px;
  padding: 20px;
}
</style>
