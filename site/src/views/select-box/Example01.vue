<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelectBox } from '@ztechjs/zt-ui';
const selected = ref<number[]>([0, 1, 2]);
const names = ['不计入经营区域', '会所店', '历史大区', '同乐坊项目组', '安娜蔻加盟', '安娜蔻电商', '安娜蔻直营', '安正专区', '安正加盟', '安正电商', '玖姿直营', '玖姿加盟', '尹默直营', '摩萨克直营'];
const options = names.map((label, value) => ({ label, value }));
</script>
<template>
  <div class="filter-demo">
    <label>管理大区 <ZtSelectBox v-model="selected" :width="360" :options="options" aria-label="本地管理大区" placeholder="请选择管理大区" /></label>
    <p>已应用：{{ selected.map(value => names[value]).join('、') || '全部区域' }}</p>
  </div>
</template>
<style scoped>
.filter-demo { padding: 20px; background: var(--zt-surface); }
.filter-demo label { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.filter-demo p { color: var(--zt-text-muted); margin-bottom: 0; }
</style>
