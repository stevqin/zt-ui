import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import type { ZtSelectOption, ZtSelectValue } from '../selection/types'

export interface SelectBoxDraft {
  isOpen: Ref<boolean>
  values: Ref<ZtSelectValue[]>
  cache: Ref<Map<ZtSelectValue, ZtSelectOption>>
  selectedOptions: ComputedRef<ZtSelectOption[]>
  open: () => void
  cancel: () => void
  confirm: () => ZtSelectValue[]
  toggle: (option: ZtSelectOption | ZtSelectValue) => boolean
  toggleAll: (options: ZtSelectOption[]) => boolean
  mergeOptions: (options: ZtSelectOption[]) => void
}

function uniqueValues(values: readonly ZtSelectValue[]) {
  const result: ZtSelectValue[] = []
  for (const value of values) {
    if (!result.includes(value)) result.push(value)
  }
  return result
}

function fallbackOption(value: ZtSelectValue): ZtSelectOption {
  return { value, label: String(value) }
}

export function normalizePageSize(value: number | undefined, fallback = 10) {
  const normalizedFallback = Number.isFinite(fallback) && fallback > 0
    ? Math.max(1, Math.floor(fallback))
    : 10
  return Number.isFinite(value) && value! > 0
    ? Math.max(1, Math.floor(value!))
    : normalizedFallback
}

export function normalizePageSizes(values: number[] | undefined, pageSize: number) {
  const sizes: number[] = []
  for (const value of values ?? []) {
    if (!Number.isInteger(value) || value <= 0 || sizes.includes(value)) continue
    sizes.push(value)
  }

  const effectivePageSize = normalizePageSize(pageSize)
  if (!sizes.includes(effectivePageSize)) sizes.push(effectivePageSize)
  return sizes
}

export function useSelectBoxDraft(
  model: Ref<ZtSelectValue[] | undefined>,
): SelectBoxDraft {
  const isOpen = ref(false)
  const values = ref<ZtSelectValue[]>([])
  const cache = ref(new Map<ZtSelectValue, ZtSelectOption>())

  function addFallbacks(selected: readonly ZtSelectValue[]) {
    const next = new Map(cache.value)
    let changed = false
    for (const value of selected) {
      if (next.has(value)) continue
      next.set(value, fallbackOption(value))
      changed = true
    }
    if (changed) cache.value = next
  }

  function rebuild() {
    const confirmed = uniqueValues(model.value ?? [])
    values.value = confirmed
    addFallbacks(confirmed)
  }

  function mergeOptions(nextOptions: ZtSelectOption[]) {
    if (!nextOptions.length) return
    const next = new Map(cache.value)
    for (const option of nextOptions) next.set(option.value, option)
    cache.value = next
  }

  function resolveOption(option: ZtSelectOption | ZtSelectValue) {
    if (typeof option === 'object') {
      mergeOptions([option])
      return option
    }
    const known = cache.value.get(option)
    if (known) return known
    const fallback = fallbackOption(option)
    mergeOptions([fallback])
    return fallback
  }

  function open() {
    rebuild()
    isOpen.value = true
  }

  function cancel() {
    rebuild()
    isOpen.value = false
  }

  function confirm() {
    const confirmed = [...values.value]
    isOpen.value = false
    return confirmed
  }

  function toggle(option: ZtSelectOption | ZtSelectValue) {
    const resolved = resolveOption(option)
    if (resolved.disabled) return false
    if (values.value.includes(resolved.value)) {
      values.value = values.value.filter(value => value !== resolved.value)
    } else {
      values.value = [...values.value, resolved.value]
    }
    return true
  }

  function toggleAll(currentOptions: ZtSelectOption[]) {
    mergeOptions(currentOptions)
    const selectable = new Map<ZtSelectValue, ZtSelectOption>()
    for (const option of currentOptions) {
      if (!option.disabled && !selectable.has(option.value)) {
        selectable.set(option.value, option)
      }
    }
    const selectableValues = [...selectable.keys()]
    if (!selectableValues.length) return false

    if (selectableValues.every(value => values.value.includes(value))) {
      values.value = values.value.filter(value => !selectable.has(value))
    } else {
      values.value = uniqueValues([...values.value, ...selectableValues])
    }
    return true
  }

  const selectedOptions = computed(() => values.value.map(value => (
    cache.value.get(value) ?? fallbackOption(value)
  )))

  // Snapshot primitive values so parent splice/push/index writes also replace a draft.
  // Draft edits never touch this source; confirmation returns a separate snapshot.
  watch(() => [...(model.value ?? [])], rebuild, { immediate: true, flush: 'sync' })

  return {
    isOpen,
    values,
    cache,
    selectedOptions,
    open,
    cancel,
    confirm,
    toggle,
    toggleAll,
    mergeOptions,
  }
}
