<script setup lang="ts">
import { computed, nextTick, onMounted, ref, toRef, watch } from 'vue'
import ZtCheckbox from '../checkbox/ZtCheckbox.vue'
import ZtButton from '../button/ZtButton.vue'
import ZtInput from '../input/ZtInput.vue'
import ZtPagination from '../pagination/ZtPagination.vue'
import ZtSelect from '../select/ZtSelect.vue'
import ZtIcon from '../icon/ZtIcon.vue'
import ZtLoading from '../loading/ZtLoading.vue'
import ZtScrollbar from '../scrollbar/ZtScrollbar.vue'
import ZtText from '../text/ZtText.vue'
import { useZtSize } from '../config-provider/context'
import type { ZtComponentSize } from '../types'
import type { ZtSelectOption, ZtSelectValue } from './types'
import { normalizePageSize, normalizePageSizes, useSelectBoxDraft } from './useSelectBoxDraft'
import './select-box.scss'

defineOptions({ name: 'SelectBoxPanel' })
const props = withDefaults(defineProps<{
  modelValue?: ZtSelectValue[]
  options: ZtSelectOption[]
  knownOptions?: ZtSelectOption[]
  size?: ZtComponentSize
  disabled?: boolean
  filterable?: boolean
  loading?: boolean
  failed?: boolean
  remote?: boolean
  batchLoading?: boolean
  page?: number
  pageSize?: number
  pageSizes?: number[]
  noDataText?: string
  remoteErrorText?: string
}>(), { filterable: true, noDataText: '暂无匹配选项', remoteErrorText: '加载失败，请重新搜索' })
const emit = defineEmits<{
  search: [keyword: string]
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  confirm: [values: ZtSelectValue[], options: ZtSelectOption[]]
  cancel: []
}>()
defineSlots<{
  option?: (scope: { option: ZtSelectOption; selected: boolean; disabled: boolean }) => unknown
}>()
const size = useZtSize(props)
const draft = useSelectBoxDraft(toRef(props, 'modelValue'))
const values = draft.values
watch([() => props.options, () => props.knownOptions], ([options, known]) => {
  draft.mergeOptions([...(known ?? []), ...options])
}, { immediate: true })
draft.open()
const keyword = ref('')
const selectedOnly = ref(false)
const page = ref(props.page ?? 1)
const pageSize = ref(normalizePageSize(props.pageSize))
const pageSizes = computed(() => normalizePageSizes(props.pageSizes ?? [10, 20, 50], pageSize.value))
const pasteOpen = ref(false)
const pasteText = ref('')
const pasteResult = ref('')
const separator = ref('newline')
const searchInput = ref<InstanceType<typeof ZtInput>>()
const pasteInput = ref<HTMLTextAreaElement>()
const separators = [
  { value: 'newline', label: '换行(\\n)' },
  { value: 'comma', label: '逗号(,)' },
  { value: 'semicolon', label: '分号(;)' },
  { value: 'tab', label: '制表符(\\t)' },
]
const filtered = computed(() => {
  const source = selectedOnly.value ? draft.selectedOptions.value : props.options
  const query = keyword.value.trim().toLocaleLowerCase()
  return source.filter(option => (props.remote && !selectedOnly.value) || option.label.toLocaleLowerCase().includes(query))
})
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const current = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
const available = computed(() => current.value.filter(option => !option.disabled))
const all = computed(() => available.value.length > 0 && available.value.every(option => values.value.includes(option.value)))
const some = computed(() => !all.value && available.value.some(option => values.value.includes(option.value)))
const listBlocked = computed(() => props.disabled || (!selectedOnly.value && (props.loading || props.failed)))

function changePage(next: number) {
  const normalized = Math.max(1, Math.min(pageCount.value, Math.floor(next) || 1))
  if (normalized === page.value) return
  page.value = normalized
  emit('update:page', normalized)
}
function changePageSize(next: number) {
  const normalized = normalizePageSize(next)
  if (normalized === pageSize.value) return
  pageSize.value = normalized
  changePage(1)
  emit('update:pageSize', normalized)
}
watch(() => props.page, next => { if (next !== undefined) changePage(next) })
watch(() => props.pageSize, next => changePageSize(normalizePageSize(next)))
watch([keyword, selectedOnly], () => changePage(1))
watch(pageCount, () => changePage(page.value), { immediate: true })
watch([pasteText, separator], () => { pasteResult.value = '' })
watch(pasteOpen, async open => {
  await nextTick()
  if (open) pasteInput.value?.focus()
  else searchInput.value?.focus()
})
onMounted(() => searchInput.value?.focus())

function toggle(option: ZtSelectOption) {
  if (!listBlocked.value) draft.toggle(option)
}
function toggleAll() {
  if (!listBlocked.value) draft.toggleAll(current.value)
}
// ZtCheckbox owns clicks on its input. Prevent label activation for all other
// targets so the native label does not dispatch a second click to the input.
function clickLabel(event: MouseEvent, action: () => void) {
  if ((event.target as Element).closest('.zt-checkbox__input')) return
  event.preventDefault()
  action()
}
function applyPaste() {
  const patterns: Record<string, RegExp> = { newline: /[\r\n]+/, comma: /[,，]+/, semicolon: /[;；]+/, tab: /\t+/ }
  const entries = pasteText.value.split(patterns[separator.value]!).map(text => text.trim()).filter(Boolean)
  const keywords = [...new Set(entries)]
  let matchedKeywords = 0
  const previousSize = values.value.length
  for (const token of keywords) {
    // Always use the complete local source, independently of search and paging.
    const matches = props.options.filter(option => !option.disabled && (option.label === token || String(option.value) === token))
    if (matches.length) matchedKeywords++
    draft.mergeOptions(matches)
    for (const option of matches) {
      if (!values.value.includes(option.value)) draft.toggle(option)
    }
  }
  const count = `批量粘贴 ${entries.length} 项${entries.length > keywords.length ? `（去重后 ${keywords.length} 项）` : ''}`
  pasteResult.value = keywords.length
    ? `${count}，匹配 ${matchedKeywords} 项，已自动勾选 ${values.value.length - previousSize} 项`
    : '没有可匹配的粘贴内容'
}
function confirm() {
  if (props.disabled || props.batchLoading) return
  if (pasteOpen.value) applyPaste()
  emit('confirm', draft.confirm(), [...draft.selectedOptions.value])
}
function cancel() {
  draft.cancel()
  emit('cancel')
}
</script>

<template>
  <div :class="['zt-select-box-panel', `zt-select-box-panel--${size}`]" @keydown.esc.stop.prevent="cancel">
    <template v-if="!pasteOpen">
      <div class="zt-select-box-panel__header">
        <ZtInput v-if="filterable" ref="searchInput" v-model="keyword" class="zt-select-box-panel__search" :size="size" :disabled="disabled" aria-label="搜索选项" placeholder="搜索选项" @input="emit('search', $event)">
          <template #prefix><ZtIcon name="search" :size="16" /></template>
        </ZtInput>
        <div class="zt-select-box-panel__toolbar">
          <ZtCheckbox :size="size" :model-value="all" :indeterminate="some" :disabled="listBlocked || !available.length" role="checkbox" aria-label="列表全选" :aria-checked="some ? 'mixed' : all" :tabindex="listBlocked || !available.length ? -1 : 0" @click="clickLabel($event, toggleAll)" @change="toggleAll" @keydown.space.prevent="toggleAll" @keydown.enter.prevent="toggleAll">列表全选</ZtCheckbox>
          <span class="zt-select-box-panel__selection">已选 <strong>{{ values.length }}</strong><ZtButton class="zt-select-box-panel__view-selected" :size="size" :disabled="disabled" :aria-pressed="selectedOnly" @click="selectedOnly = !selectedOnly">{{ selectedOnly ? '返回列表' : '查看' }}</ZtButton></span>
        </div>
      </div>
      <ZtScrollbar class="zt-select-box-panel__list" :size="size" max-height="var(--select-box-list-height)" role="group" aria-label="筛选选项" :aria-busy="loading && !selectedOnly">
        <ZtLoading class="zt-select-box-panel__loading" :class="{ 'is-loading': loading && !selectedOnly }" :loading="loading && !selectedOnly" :size="size" text="加载中">
          <ZtText v-if="failed && !selectedOnly" class="zt-select-box-panel__state" tag="p" status="danger" :size="size" role="alert">{{ remoteErrorText }}</ZtText>
          <template v-else>
            <ZtCheckbox v-for="option in current" :key="`${typeof option.value}:${option.value}`" class="zt-select-box-panel__option" :size="size" :model-value="values.includes(option.value)" :disabled="listBlocked || option.disabled" role="checkbox" :aria-label="option.label" :aria-checked="values.includes(option.value)" :aria-disabled="listBlocked || Boolean(option.disabled)" :tabindex="listBlocked || option.disabled ? -1 : 0" @click="clickLabel($event, () => toggle(option))" @change="toggle(option)" @keydown.space.prevent="toggle(option)" @keydown.enter.prevent="toggle(option)">
              <ZtText class="zt-select-box-panel__option-content" :size="size" :title="option.label" truncated><slot name="option" :option="option" :selected="values.includes(option.value)" :disabled="Boolean(listBlocked || option.disabled)">{{ option.label }}</slot></ZtText>
            </ZtCheckbox>
            <ZtText v-if="!current.length && (!loading || selectedOnly)" class="zt-select-box-panel__state" tag="p" status="info" :size="size">{{ selectedOnly ? '暂无已选项' : noDataText }}</ZtText>
          </template>
        </ZtLoading>
      </ZtScrollbar>
      <ZtPagination class="zt-select-box-panel__pager" :current-page="page" :page-size="pageSize" :size="size" :disabled="disabled" :total="filtered.length" :page-sizes="pageSizes" :pager-count="5" layout="prev, pager, next, sizes, total" @update:current-page="changePage" @update:page-size="changePageSize" />
    </template>
    <div v-else class="zt-select-box-panel__paste">
      <div class="zt-select-box-panel__paste-editor">
        <textarea ref="pasteInput" v-model="pasteText" :disabled="disabled || batchLoading" aria-label="选项文本粘贴处" placeholder="选项文本粘贴处" />
        <div class="zt-select-box-panel__separator"><ZtText :size="size">分隔符：</ZtText><ZtSelect v-model="separator" :size="size" :options="separators" :disabled="disabled || batchLoading" aria-label="分隔符" /></div>
      </div>
      <ZtText v-if="pasteResult" class="zt-select-box-panel__paste-result" tag="p" status="info" :size="size" role="status">{{ pasteResult }}</ZtText>
    </div>
    <div class="zt-select-box-panel__footer">
      <ZtButton class="zt-select-box-panel__mode" :size="size" :disabled="disabled || batchLoading" :aria-expanded="pasteOpen" @click="pasteOpen = !pasteOpen"><ZtIcon :name="pasteOpen ? 'checklist' : 'clipboard'" :size="16" />{{ pasteOpen ? '勾选框选择' : '批量粘贴' }}</ZtButton>
      <span />
      <ZtButton class="zt-select-box-panel__cancel" :size="size" @click="cancel">取消</ZtButton>
      <ZtButton class="zt-select-box-panel__confirm" :size="size" status="primary" :disabled="disabled" :loading="batchLoading" loading-text="匹配中…" @click="confirm">确定</ZtButton>
    </div>
  </div>
</template>
