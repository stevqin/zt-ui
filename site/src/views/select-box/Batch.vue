<script setup lang="ts">
import { ref } from 'vue'
import {
  ZtSelectBox,
  type ZtSelectOption,
  type ZtSelectBoxRemoteRequest,
  type ZtSelectBoxRemoteResult,
} from '@ztechjs/zt-ui'

const selected = ref<string[]>(['region-1'])
const options: ZtSelectOption[] = Array.from({ length: 60 }, (_, index) => ({
  value: `region-${index + 1}`,
  label: `经营区域 ${index + 1}`,
  disabled: index === 3,
}))
const pasteExample = '经营区域 25\nregion-36\n不存在的区域\n经营区域 25\n经营区域 4'

async function loadOptions(request: ZtSelectBoxRemoteRequest): Promise<ZtSelectBoxRemoteResult> {
  await new Promise(resolve => setTimeout(resolve, 600))
  if (request.mode === 'batch') {
    if (request.keywords.includes('失败')) throw new Error('模拟批量请求失败')
    return {
      mode: 'batch',
      matches: request.keywords.flatMap(keyword => options
        .filter(option => option.label === keyword || String(option.value) === keyword)
        .map(option => ({ keyword, option }))),
    }
  }
  const matches = options.filter(option => option.label.includes(request.keyword))
  const start = (request.page - 1) * request.pageSize
  return { mode: 'search', options: matches.slice(start, start + request.pageSize), total: matches.length }
}
</script>

<template>
  <div>
    <ZtSelectBox v-model="selected" :width="360" remote :remote-method="loadOptions" clearable aria-label="批量经营区域" />
    <p>复制下面的文本，以“换行”分隔粘贴。两项位于其他页，一项重复，一项不存在，经营区域 4 已禁用。</p>
    <pre class="batch-example">{{ pasteExample }}</pre>
    <p>已确认：{{ selected.join('、') || '无' }}。粘贴“失败”可检查失败后重试。</p>
  </div>
</template>

<style scoped>
.batch-example { padding: 12px; color: var(--zt-text); background: var(--zt-surface); border: 1px solid var(--zt-border); border-radius: 6px; white-space: pre-wrap; }
p { color: var(--zt-text-muted); }
</style>
