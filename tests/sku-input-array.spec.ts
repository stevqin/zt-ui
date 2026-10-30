import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SkuInput from '../src/components/sku-input/ZtSkuInput.vue'
const product = { product_no: 'P', skcs: [
  { skc: 'RED', skus: [{ sku: 'R-S', size_code: 'S' }, { sku: 'R-M', size_code: 'M', disabled: true }] },
  { skc: 'BLUE', skus: [{ sku: 'B-S', size_code: 'S' }, { sku: 'B-M', size_code: 'M' }] },
] }
const field = (w: ReturnType<typeof mount>, sku: string) => w.get(`[data-sku="${sku}"] input`)
describe('SKU quantity array mode', () => {
  it('reflects array values silently, filters unknown and invalid entries, and resolves duplicate SKU with the last entry', () => {
    const w = mount(SkuInput, { props: { product, valueType: 'array', modelValue: [{ sku: 'R-S', quantity: 2 }, { sku: 'B-S', quantity: 3 }, { sku: 'R-S', quantity: 5 }, { sku: 'UNKNOWN', quantity: 90 }, { sku: 'B-M', quantity: -1 }] } })
    expect((field(w, 'R-S').element as HTMLInputElement).value).toBe('5')
    expect(w.get('[data-total]').text()).toContain('8')
    expect(w.emitted('change')).toBeUndefined()
  })
  it('emits ordered array values and preserves rich entries without mutating the input', async () => {
    const initial = [{ sku: 'B-S', quantity: 2 }]
    Object.freeze(initial[0]); Object.freeze(initial)
    const w = mount(SkuInput, { props: { product, valueType: 'array', modelValue: initial } })
    await field(w, 'R-S').setValue('4')
    const expected = [{ sku: 'R-S', quantity: 4 }, { sku: 'B-S', quantity: 2 }]
    expect(w.emitted('update:modelValue')?.[0]).toEqual([expected])
    const change = w.emitted('change')![0][0] as any
    expect(change.values).toEqual(expected)
    expect(change.totalQuantity).toBe(6)
    expect(change.entries[0]).toEqual({ spu: product, skc: product.skcs[0], sku: product.skcs[0].skus[0], quantity: 4 })
    expect(initial).toEqual([{ sku: 'B-S', quantity: 2 }])
    expect((field(w, 'R-S').element as HTMLInputElement).value).toBe('')
  })
  it('clears array values to an empty array', async () => {
    const w = mount(SkuInput, { props: { product, valueType: 'array', modelValue: [{ sku: 'R-S', quantity: 2 }] } })
    await field(w, 'R-S').setValue('0')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect((w.emitted('change')![0][0] as any).values).toEqual([])
  })
  it('pastes once in matrix order, keeps disabled quantities, and clamps quantities', async () => {
    const w = mount(SkuInput, { props: { product, valueType: 'array', max: 20, modelValue: [{ sku: 'R-M', quantity: 7 }] } })
    await field(w, 'R-S').trigger('paste', { clipboardData: { getData: () => '3\t4\n5\t99' } })
    expect(w.emitted('update:modelValue')).toEqual([[[{ sku: 'R-S', quantity: 3 }, { sku: 'R-M', quantity: 7 }, { sku: 'B-S', quantity: 5 }, { sku: 'B-M', quantity: 20 }]]])
    expect(w.emitted('change')).toHaveLength(1)
  })
  it('supports uncontrolled arrays and changes output mode without a spurious event or clearing quantities', async () => {
    const w = mount(SkuInput, { props: { product, valueType: 'array' } })
    await field(w, 'R-S').setValue('3')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([[{ sku: 'R-S', quantity: 3 }]])
    await w.setProps({ valueType: 'object' })
    expect(w.emitted('update:modelValue')).toHaveLength(1)
    expect((field(w, 'R-S').element as HTMLInputElement).value).toBe('3')
    await field(w, 'B-S').setValue('2')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([{ 'R-S': 3, 'B-S': 2 }])
  })
  it('preserves quantity display when only the output mode changes on a controlled object', async () => {
    const w = mount(SkuInput, { props: { product, modelValue: { 'R-S': 2 } } })
    await w.setProps({ valueType: 'array' })
    expect((field(w, 'R-S').element as HTMLInputElement).value).toBe('2')
    expect(w.emitted('change')).toBeUndefined()
    await field(w, 'B-S').setValue('4')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([[{ sku: 'R-S', quantity: 2 }, { sku: 'B-S', quantity: 4 }]])
  })
})
