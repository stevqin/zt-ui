<script setup lang="ts">
import { ref } from 'vue'
import { ZtCheckbox, ZtButton, ZtConfigProvider, ZtSelect, ZtSelectBox, type ZtComponentSize, type ZtSelectBoxInstance, type ZtTheme } from '@ztechjs/zt-ui';

const size = ref<ZtComponentSize>('default')
const theme = ref<ZtTheme>('light')
const radius = ref(16)
const selected = ref<string[]>(['east', 'south', 'north'])
const readonly = ref(false)
const selectBox = ref<ZtSelectBoxInstance>()
const options = [
  { value: 'east', label: '华东经营区域（包含浙江与上海）' },
  { value: 'south', label: '华南经营区域' },
  { value: 'north', label: '华北经营区域' },
]
</script>

<template>
  <div class="appearance-controls">
    <label>尺寸 <ZtSelect v-model="size" :options="['mini', 'small', 'default', 'medium', 'large'].map(value => ({label: value, value}))" aria-label="演示尺寸" /></label>
    <label>主题 <ZtSelect v-model="theme" :options="[{label: 'light', value: 'light'}, {label: 'dark', value: 'dark'}]" aria-label="演示主题" /></label>
    <label>圆角 <ZtSelect v-model="radius" :options="[{label: '0', value: 0}, {label: '16', value: 16}]" aria-label="演示圆角" /></label>
    <ZtCheckbox v-model="readonly"> readonly（隐藏清空图标）</ZtCheckbox>
  </div>
  <ZtConfigProvider :size="size" :theme="theme" :border-radius="radius" class="appearance-demo">
    <label>100px <ZtSelectBox v-model="selected" :options="options" :width="100" clearable :readonly="readonly" aria-label="100px 区域" /></label>
    <label>240px <ZtSelectBox ref="selectBox" v-model="selected" :options="options" :width="240" clearable :readonly="readonly" aria-label="240px 区域" /></label>
    <label class="full-width">100% <ZtSelectBox v-model="selected" :options="options" width="100%" clearable :readonly="readonly" aria-label="100% 区域" /></label>
    <div class="appearance-actions">
      <ZtButton @click="selectBox?.clear()">调用 clear()</ZtButton>
      <ZtButton @click="selected = ['east', 'south', 'north']">恢复示例值</ZtButton>
    </div>
    <p>三个控件共享已确认值：{{ selected.join('、') || '已清空' }}；readonly / disabled 时清空图标隐藏。</p>
  </ZtConfigProvider>
</template>

<style scoped>
.appearance-controls { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; align-items: center; }
.appearance-controls .zt-select { width: 130px; }
.appearance-demo { display: flex; flex-direction: column; gap: 18px; padding: 18px; background: var(--zt-surface); color: var(--zt-text); border: 1px solid var(--zt-border); }
.appearance-demo label { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.full-width { width: 100%; }
.appearance-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.appearance-demo p { margin: 0; color: var(--zt-text-muted); }
</style>
