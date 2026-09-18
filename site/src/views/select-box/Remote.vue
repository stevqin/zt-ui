<script setup lang="ts">
import { ref } from 'vue'
import {
  ZtSelectBox,
  type ZtSelectOption,
  type ZtSelectBoxRemoteRequest,
  type ZtSelectBoxRemoteResult,
} from '@ztechjs/zt-ui'

const selected = ref<string[]>([])
const pageSize = ref(20)
const regions: ZtSelectOption[] = Array.from({ length: 75 }, (_, index) => ({
  value: `region-${index + 1}`,
  label: `${index % 2 ? '华南' : '华东'}区域 ${index + 1}`,
  disabled: index === 3,
}))

async function searchRegions(keyword: string, page: number, size: number) {
  // 在业务中替换为分页 API；items 只包含当前页，total 是全部匹配数量。
  await new Promise(resolve => setTimeout(resolve, 600))
  if (keyword === '失败') throw new Error('模拟请求失败')
  const matches = regions.filter(option => option.label.includes(keyword))
  return { items: matches.slice((page - 1) * size, page * size), total: matches.length }
}

async function matchRegions(keywords: string[]) {
  // 批量接口须查询完整数据集，不受当前页或搜索关键词限制。
  await new Promise(resolve => setTimeout(resolve, 600))
  return keywords.flatMap(keyword => regions
    .filter(option => option.label === keyword || String(option.value) === keyword)
    .map(option => ({ keyword, option })))
}

async function loadOptions(request: ZtSelectBoxRemoteRequest): Promise<ZtSelectBoxRemoteResult> {
  if (request.mode === 'batch') {
    return { mode: 'batch', matches: await matchRegions(request.keywords) }
  }
  const page = await searchRegions(request.keyword, request.page, request.pageSize)
  return { mode: 'search', options: page.items, total: page.total }
}
</script>

<template>
  <div>
    <ZtSelectBox
      v-model="selected"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :width="360"
      remote
      :remote-method="loadOptions"
      :debounce="300"
      aria-label="远程管理大区"
      placeholder="搜索管理大区"
    >
      <template #option="{ option, selected: checked, disabled }">
        <span class="region-option">
          <strong>{{ option.label }}</strong>
          <small>{{ disabled ? '已停用' : checked ? '已勾选' : option.value }}</small>
        </span>
      </template>
    </ZtSelectBox>
    <p>每页 {{ pageSize }} 条，已确认 {{ selected.length }} 项。输入“华东”搜索，“失败”查看错误，“无结果”查看空状态。</p>
  </div>
</template>

<style scoped>
.region-option { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0; }
.region-option strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.region-option small { color: var(--zt-text-muted); flex-shrink: 0; }
p { color: var(--zt-text-muted); }
</style>
