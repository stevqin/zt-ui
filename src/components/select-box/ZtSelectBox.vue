<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, provide, ref, toRef, useAttrs, watch, type StyleValue } from 'vue'
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
}
const dropdown = useAnchoredDropdown({ visible, trigger: triggerElement, popup: popupElement, minWidth: computed(() => 480), close, focus })
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
  if (disabled.value) return
  commit([])
  emit('clear')
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
function handleBlur(event: FocusEvent) {
  emit('blur', event)
  if (!(event.relatedTarget instanceof Node) || !dropdown.containsTarget(event.relatedTarget)) void formItem?.validate('blur')
}
watch(() => props.pageSize, value => changePageSize(value, false))
watch(visible, value => emit('visible-change', value), { flush: 'sync' })
watch(disabled, value => { if (value) close() })
watch([() => props.remote, () => props.remoteMethod], () => {
  remoteSearch.reset()
  remoteOptions.value = []
  total.value = 0
  page.value = 1
  request()
})
onBeforeUnmount(remoteSearch.dispose)
defineExpose({ focus, blur, open, close, clear })
</script>

<template>
  <div :class="['zt-select-box', `zt-select-box--${size}`, attrs.class, { 'is-disabled': disabled, 'is-open': visible }]" :style="[attrs.style as StyleValue, { width }]">
    <button v-bind="Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'))" :id="(attrs.id as string) ?? formItem?.inputId" ref="triggerElement" type="button" class="zt-select-box__trigger" role="combobox" aria-haspopup="dialog" :aria-expanded="visible" :aria-controls="visible ? popupId : undefined" :aria-invalid="formItem?.validateState.value === 'error' || undefined" :aria-describedby="describedBy" :disabled="disabled" @click="toggle" @keydown.down.prevent="open" @keydown.esc="handleEscape" @focus="emit('focus', $event)" @blur="handleBlur">
      <span class="zt-select-box__summary" :class="{ 'is-placeholder': !summary }" :title="summary || undefined">{{ summary || placeholder }}</span>
      <ZtIcon class="zt-select-box__arrow" name="arrow-down" :size="14" />
    </button>
    <button v-if="clearable && modelValue.length && !disabled" type="button" class="zt-select-box__clear" aria-label="清空选择" @click.stop="clear"><ZtIcon name="close" :size="14" /></button>
    <Teleport to="body">
      <div v-if="visible" :id="popupId" ref="popupElement" class="zt-select-box__popup" :data-zt-theme="theme" :style="popupStyle" role="dialog" aria-label="选择选项" tabindex="-1" @keydown.esc="handleEscape">
        <SelectBoxPanel :model-value="modelValue" :options="remote ? remoteOptions : options" :known-options="knownOptions" :size="size" :disabled="disabled" :filterable="filterable" :remote="remote" :loading="remote && remoteSearch.loading.value" :failed="remote && remoteSearch.failed.value" :page="page" :page-size="pageSize" :page-sizes="pageSizes" :total="total" :no-data-text="noDataText" :remote-error-text="remoteErrorText" @search="search" @update:page="changePage" @update:page-size="changePageSize" @confirm="commit" @cancel="close">
          <template v-if="$slots.option" #option="scope"><slot name="option" v-bind="scope" /></template>
        </SelectBoxPanel>
      </div>
    </Teleport>
  </div>
</template>
