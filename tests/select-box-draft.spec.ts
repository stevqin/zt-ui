import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import type { ZtSelectValue } from '../src/components/selection/types'
import {
  normalizePageSize,
  normalizePageSizes,
  useSelectBoxDraft,
} from '../src/components/select-box/useSelectBoxDraft'

describe('useSelectBoxDraft', () => {
  it('opens a de-duplicated draft from the confirmed model values', () => {
    const model = ref<ZtSelectValue[]>([1, '1', 1, true])
    const state = useSelectBoxDraft(model)

    state.open()

    expect(state.values.value).toEqual([1, '1', true])
    expect(state.selectedOptions.value).toEqual([
      { value: 1, label: '1' },
      { value: '1', label: '1' },
      { value: true, label: 'true' },
    ])
  })

  it('stages a toggle without replacing the confirmed model', () => {
    const model = ref<ZtSelectValue[]>([1])
    const state = useSelectBoxDraft(model)
    state.open()

    state.toggle({ value: 2, label: '二区' })

    expect(state.values.value).toEqual([1, 2])
    expect(model.value).toEqual([1])
  })

  it('selects and clears only enabled options from the current page', () => {
    const state = useSelectBoxDraft(ref<ZtSelectValue[]>([99, 3]))
    const currentPage = [
      { value: 1, label: '一区' },
      { value: 2, label: '二区', disabled: true },
      { value: 3, label: '三区' },
    ]
    state.open()

    state.toggleAll(currentPage)
    expect(state.values.value).toEqual([99, 3, 1])

    state.toggleAll(currentPage)
    expect(state.values.value).toEqual([99])
  })

  it('ignores a disabled option when selecting it', () => {
    const state = useSelectBoxDraft(ref<ZtSelectValue[]>([]))
    state.open()

    state.toggle({ value: 2, label: '二区', disabled: true })

    expect(state.values.value).toEqual([])
  })

  it('restores the confirmed model when a draft is cancelled', () => {
    const model = ref<ZtSelectValue[]>([1])
    const state = useSelectBoxDraft(model)
    state.open()
    state.toggle(2)

    state.cancel()

    expect(state.values.value).toEqual([1])
    expect(state.isOpen.value).toBe(false)
  })

  it('returns an independent snapshot when a draft is confirmed', () => {
    const model = ref<ZtSelectValue[]>([1])
    const state = useSelectBoxDraft(model)
    state.open()
    state.toggle(2)

    const confirmed = state.confirm()
    state.toggle(3)

    expect(confirmed).toEqual([1, 2])
    expect(state.isOpen.value).toBe(false)
    expect(model.value).toEqual([1])
  })

  it('rebuilds an open draft when the external model is reset', () => {
    const model = ref<ZtSelectValue[]>([1, 2])
    const state = useSelectBoxDraft(model)
    state.open()
    state.toggle(3)

    model.value = []

    expect(state.values.value).toEqual([])
  })

  it('merges option labels by value while preserving labels for unknown confirmed values', () => {
    const model = ref<ZtSelectValue[]>([1, 3])
    const state = useSelectBoxDraft(model)
    state.mergeOptions([
      { value: 1, label: '旧名称' },
      { value: 2, label: '二区' },
    ])
    state.mergeOptions([{ value: 1, label: '新名称' }])
    state.open()

    expect(state.cache.value.get(1)).toEqual({ value: 1, label: '新名称' })
    expect(state.selectedOptions.value).toEqual([
      { value: 1, label: '新名称' },
      { value: 3, label: '3' },
    ])
  })
})

describe('SelectBox page-size normalization', () => {
  it('normalizes a page size to a positive integer with the supplied fallback', () => {
    expect(normalizePageSize(12.8)).toBe(12)
    expect(normalizePageSize(0, 25)).toBe(25)
    expect(normalizePageSize(Number.POSITIVE_INFINITY, 25)).toBe(25)
  })

  it('keeps only unique positive integer page sizes and includes the effective size', () => {
    expect(normalizePageSizes([20, 10, 20, 0, -5, 12.5, Number.NaN], 15)).toEqual([20, 10, 15])
    expect(normalizePageSizes(undefined, 10)).toEqual([10])
  })
})
