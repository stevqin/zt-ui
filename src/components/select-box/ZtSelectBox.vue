<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, toRef, useAttrs, watch, type StyleValue } from 'vue'
import { ZtMessage } from '@ztechjs/zt-alert'
import ZtIcon from '../icon/ZtIcon.vue'
import { useZtConfig, useZtSize } from '../config-provider/context'
import { ztFormItemKey } from '../form/context'
import { overlayContextKey } from '../overlay/context'
import { useAnchoredDropdown } from '../selection/useAnchoredDropdown'
import { useRemoteOptions } from '../selection/useRemoteOptions'
import SelectBoxPanel from './SelectBoxPanel.vue'
import { normalizePageSize, useSelectBoxDraft } from './useSelectBoxDraft'
import type { ZtSelectBoxProps, ZtSelectBoxRemoteRequest, ZtSelectBoxRemoteResult, ZtSelectOption, ZtSelectValue } from './types'
import './select-box.scss'

defineOptions({ name: 'ZtSelectBox', inheritAttrs: false })
const props = withDefaults(defineProps<ZtSelectBoxProps>(), {
  modelValue: () => [], options: () => [], placeholder: '请选择', filterable: true,
  disabled: false, clearable: false, remote: false, debounce: 300, pageSize: 10,
  pageSizes: () => [10, 20, 50], noDataText: '暂无匹配选项', remoteErrorText: '加载失败，请重新搜索',
})
const emit = defineEmits<{
  'update:modelValue': [value: ZtSelectValue[]]
  'update:pageSize': [pageSize: number]
  change: [value: ZtSelectValue[]]
  'visible-change': [visible: boolean]
  search: [keyword: string]
  clear: []
  'remote-error': [reason: unknown]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
defineSlots<{ option?: (scope: { option: ZtSelectOption; selected: boolean; disabled: boolean }) => unknown }>()
const attrs = useAttrs()
const formItem = inject(ztFormItemKey, undefined)
// Internal search and pager controls are not independent form fields.
provide(ztFormItemKey as symbol, undefined)
const size = useZtSize(props, () => formItem?.size.value)
const { style: providerStyle, theme } = useZtConfig()
const disabled = computed(() => props.disabled || formItem?.disabled.value || false)
const canClear = computed(() => props.clearable && props.modelValue.length > 0 && !disabled.value)
const controlElement = ref<HTMLElement>()
const panel = ref<InstanceType<typeof SelectBoxPanel>>()
const draft = useSelectBoxDraft(toRef(props, 'modelValue'))
const visible = draft.isOpen
const triggerElement = ref<HTMLElement>()
const popupElement = ref<HTMLElement>()
const popupId = `zt-select-box-${getCurrentInstance()?.uid}-dialog`
const page = ref(1)
const pageSize = ref(normalizePageSize(props.pageSize))
const keyword = ref('')
const total = ref(0)
const remoteOptions = ref<ZtSelectOption[]>([])
const popupZIndex = ref(2000)
const width = computed(() => typeof props.width === 'number' ? `${props.width}px` : props.width)
const knownOptions = computed(() => [...draft.cache.value.values()])
const summary = computed(() => [...new Set(props.modelValue)].map(value => draft.cache.value.get(value)?.label ?? String(value)).join(', '))
const describedBy = computed(() => [attrs['aria-describedby'], formItem?.validateState.value === 'error' ? formItem.errorId : undefined].filter(Boolean).join(' ') || undefined)
watch(() => props.options, options => draft.mergeOptions(options), { immediate: true })

function focus(options?: FocusOptions) { triggerElement.value?.focus(options) }
function blur() { triggerElement.value?.blur() }
function close() {
  if (!visible.value) return
  draft.cancel()
  remoteSearch.reset()
  remoteBatch.reset()
}
const dropdown = useAnchoredDropdown({ visible, trigger: controlElement, popup: popupElement, minWidth: computed(() => 480), layer: popupZIndex, tabThroughPopup: true, close, focus })
provide(overlayContextKey, dropdown.overlayContext)
const popupStyle = computed(() => ({ ...providerStyle.value, ...dropdown.popupStyle.value, zIndex: popupZIndex.value }))
const searchMethod = computed(() => {
  const method = props.remoteMethod
  if (!method) return undefined
  return async (request: ZtSelectBoxRemoteRequest): Promise<ZtSelectBoxRemoteResult> => {
    const response = await method(request)
    if (response.mode !== 'search') throw new Error('SelectBox search requires a search-mode result')
    return response
  }
})
const remoteSearch = useRemoteOptions<ZtSelectBoxRemoteRequest, ZtSelectBoxRemoteResult>(searchMethod, toRef(props, 'debounce'), () => ({ mode: 'search', options: [], total: 0 }))
const batchMethod = computed(() => {
  const method = props.remoteMethod
  return async (query: ZtSelectBoxRemoteRequest): Promise<ZtSelectBoxRemoteResult> => {
    if (!method) throw new Error('SelectBox batch requires a remote method')
    const response = await method(query)
    if (response.mode !== 'batch') throw new Error('SelectBox batch requires a batch-mode result')
    return response
  }
})
// Separate coordinators keep search pages, loading, and request generations independent.
const remoteBatch = useRemoteOptions<ZtSelectBoxRemoteRequest, ZtSelectBoxRemoteResult>(batchMethod, toRef(props, 'debounce'), () => ({ mode: 'batch', matches: [] }))
watch(() => [...props.modelValue], () => remoteBatch.reset(), { flush: 'sync' })
async function matchBatch(keywords: string[]) {
  if (!props.remote || !visible.value || remoteBatch.loading.value) return undefined
  const response = await remoteBatch.run({ mode: 'batch', keywords }, {
    onError: (reason: unknown) => {
      emit('remote-error', reason)
      ZtMessage.error('批量匹配失败，请重试')
    },
  })
  return response?.mode === 'batch' ? response.matches : undefined
}
let correctionUsed = false
const remoteRunOptions = { clearOnError: false, onError: (reason: unknown) => emit('remote-error', reason) }
function request(debounced = false, correction = false) {
  if (!props.remote || !visible.value) return
  if (!correction) correctionUsed = false
  const query: ZtSelectBoxRemoteRequest = { mode: 'search', keyword: keyword.value, page: page.value, pageSize: pageSize.value }
  if (debounced) remoteSearch.schedule(query, remoteRunOptions)
  else void remoteSearch.run(query, remoteRunOptions)
}
watch(remoteSearch.result, response => {
  if (!visible.value || response.mode !== 'search') return
  remoteOptions.value = response.options
  total.value = Number.isFinite(response.total) ? Math.max(0, Math.floor(response.total)) : 0
  draft.mergeOptions(response.options)
  const lastPage = Math.max(1, Math.ceil(total.value / pageSize.value))
  if (page.value > lastPage) {
    page.value = lastPage
    if (!correctionUsed) {
      correctionUsed = true
      request(false, true)
    }
  }
}, { flush: 'sync' })
function open() {
  if (disabled.value || visible.value) return
  keyword.value = ''
  page.value = 1
  // A nested overlay may be above the default dropdown layer.
  let ancestor = triggerElement.value?.parentElement
  let highestLayer = 1999
  while (ancestor) {
    const layer = Number.parseInt(getComputedStyle(ancestor).zIndex, 10)
    if (Number.isFinite(layer)) highestLayer = Math.max(highestLayer, layer)
    ancestor = ancestor.parentElement
  }
  popupZIndex.value = highestLayer + 1
  draft.open()
  request()
  void nextTick(() => { if (!props.filterable) popupElement.value?.focus() })
}
function handleEscape(event: KeyboardEvent) {
  if (event.isComposing) return
  event.preventDefault()
  event.stopPropagation()
  close()
}
function toggle() { if (visible.value) close(); else open() }
function commit(values: ZtSelectValue[], options: ZtSelectOption[] = []) {
  if (disabled.value) return
  draft.mergeOptions(options)
  emit('update:modelValue', values)
  emit('change', values)
  void formItem?.validate('change')
  close()
}
function clear() {
  if (!canClear.value) return
  // Establish page one before resetting the result; its watcher may correct pages.
  keyword.value = ''
  page.value = 1
  remoteSearch.reset()
  remoteBatch.reset()
  draft.values.value = []
  panel.value?.reset()
  emit('update:modelValue', [])
  emit('change', [])
  emit('clear')
  void formItem?.validate('change')
  request()
  focus()
}
function search(value: string) {
  keyword.value = value
  page.value = 1
  emit('search', value)
  request(true)
}
function changePage(value: number) {
  if (value === page.value) return
  page.value = value
  request()
}
function changePageSize(value: number, notify = true) {
  const normalized = normalizePageSize(value)
  if (normalized === pageSize.value) return
  pageSize.value = normalized
  page.value = 1
  if (notify) emit('update:pageSize', normalized)
  request()
}
let disposed = false
function handleFocusOut(event: FocusEvent) {
  if (!(event.target instanceof Node) || !dropdown.containsTarget(event.target)) return
  if (event.relatedTarget instanceof Node && dropdown.containsTarget(event.relatedTarget)) return
  // Wait for nested overlays and close/clear handlers to finish restoring focus.
  // Listening on the document also covers teleported child Select popups.
  void nextTick(() => {
    if (disposed || (document.activeElement && dropdown.containsTarget(document.activeElement))) return
    emit('blur', event)
    close()
    void formItem?.validate('blur')
  })
}
onMounted(() => document.addEventListener('focusout', handleFocusOut, true))
watch(() => props.pageSize, value => changePageSize(value, false))
watch(visible, value => emit('visible-change', value), { flush: 'sync' })
watch(disabled, value => { if (value) close() })
watch([() => props.remote, () => props.remoteMethod], () => {
  remoteSearch.reset()
  remoteBatch.reset()
  remoteOptions.value = []
  total.value = 0
  page.value = 1
  request()
})
onBeforeUnmount(() => {
  disposed = true
  document.removeEventListener('focusout', handleFocusOut, true)
  remoteSearch.dispose()
  remoteBatch.dispose()
})
defineExpose({ focus, blur, open, close, clear })
</script>

<template>
  <div ref="controlElement" :data-zt-theme="theme" :class="['zt-select-box', `zt-select-box--${size}`, attrs.class, { 'is-disabled': disabled, 'is-open': visible, 'is-error': formItem?.validateState.value === 'error' }]" :style="[providerStyle, attrs.style as StyleValue, { width }]">
    <button v-bind="Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'))" :id="(attrs.id as string) ?? formItem?.inputId" ref="triggerElement" type="button" class="zt-select-box__trigger" role="combobox" aria-haspopup="dialog" :aria-expanded="visible" :aria-controls="visible ? popupId : undefined" :aria-invalid="formItem?.validateState.value === 'error' || undefined" :aria-describedby="describedBy" :disabled="disabled" @click="toggle" @keydown.down.prevent="open" @keydown.esc="handleEscape" @focus="emit('focus', $event)">
      <span class="zt-select-box__summary" :class="{ 'is-placeholder': !summary }" :title="summary || undefined">{{ summary || placeholder }}</span>
      <ZtIcon class="zt-select-box__arrow" name="arrow-down" :size="14" />
    </button>
    <button v-if="canClear" type="button" class="zt-select-box__clear" aria-label="清空选择" @pointerdown.stop.prevent @mousedown.stop.prevent @click.stop="clear"><ZtIcon name="close" :size="14" /></button>
    <Teleport :to="dropdown.teleportTarget.value">
      <div v-if="visible" :id="popupId" ref="popupElement" class="zt-select-box__popup" :data-zt-theme="theme" :style="popupStyle" role="dialog" aria-label="选择选项" tabindex="-1" @keydown.esc="handleEscape">
        <SelectBoxPanel ref="panel" :model-value="modelValue" :options="remote ? remoteOptions : options" :known-options="knownOptions" :size="size" :disabled="disabled" :filterable="filterable" :remote="remote" :match-batch="matchBatch" :batch-loading="remoteBatch.loading.value" :loading="remote && remoteSearch.loading.value" :failed="remote && remoteSearch.failed.value" :page="page" :page-size="pageSize" :page-sizes="pageSizes" :total="total" :no-data-text="noDataText" :remote-error-text="remoteErrorText" @search="search" @update:page="changePage" @update:page-size="changePageSize" @confirm="commit" @cancel="close">
          <template v-if="$slots.option" #option="scope"><slot name="option" v-bind="scope" /></template>
        </SelectBoxPanel>
      </div>
    </Teleport>
  </div>
</template>
