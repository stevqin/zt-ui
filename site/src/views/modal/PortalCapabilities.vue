<script setup lang="ts">
import {onBeforeUnmount, ref} from 'vue';
import {ZtButton, ZtInput, ZtModal} from '@ztechjs/zt-ui';
const visible = ref(false), bottom = ref(false), loading = ref(false);
const keyword = ref('');
let timer: ReturnType<typeof setTimeout> | undefined;
function load() { loading.value = true; timer = setTimeout(() => loading.value = false, 1200); }
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <div class="compat-actions">
    <ZtButton status="primary" @click="visible = true">固定高度与内部滚动</ZtButton>
    <ZtButton @click="bottom = true">底部弹出</ZtButton>
  </div>
  <ZtModal v-model="visible" title="明细工作区" subtitle="表格与长列表自行管理滚动" :width="720" height="520" max-height="85vh"
    :body-scroll="false" :body-padding="0" :loading="loading" loading-text="正在读取明细…" show-footer show-zoom
    @confirm="visible = false">
    <template #header-actions><ZtButton size="small" :disabled="loading" @click="load">重新加载</ZtButton></template>
    <div class="compat-toolbar"><ZtInput v-model="keyword" placeholder="筛选编号" aria-label="筛选编号" /></div>
    <div class="compat-list">
      <div v-for="i in 40" v-show="!keyword || String(i).includes(keyword)" :key="i">明细记录 {{ i }}</div>
    </div>
  </ZtModal>
  <ZtModal v-model="bottom" placement="bottom" title="底部操作面板" :width="560" max-height="80vh" :fullscreen-below="0" show-footer @confirm="bottom = false">
    <p>底部弹出保留顶部圆角；fullscreen-below 可控制窄屏是否自动全屏，设为 0 禁用。</p>
  </ZtModal>
</template>
<style scoped>
.compat-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.compat-toolbar { flex: none; padding: 14px 20px; border-bottom: 1px solid var(--glass-line); }
.compat-list { flex: 1; min-height: 0; overflow: auto; padding: 0 20px; }
.compat-list > div { padding: 10px 0; border-bottom: 1px solid var(--glass-line); }
</style>
