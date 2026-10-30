import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Sku from '../src/components/sku-select/ZtSkuSelect.vue'
const products = [{ product_no: 'P01', product_name: '示例商品', skcs: [
  { skc: 'P01-BLUE', color_code: 'blue', color_name: '雾蓝', image_url: '/blue.svg', skus: [{ sku: 'P01-BLUE-S', size_code: 'S' }] },
  { skc: 'P01-WHITE', color_code: 'white', color_name: '白色', image_url: '/white.svg', skus: [{ sku: 'P01-WHITE-M', size_code: 'M' }] },
] }]
describe('SKU business fields and initial SKC', () => {
  it('selects the first SKC and its image without selecting a size or emitting a SKU', () => {
    const w = mount(Sku, { props: { products, modelValue: null } })
    expect(w.get('[data-skc="P01-BLUE"]').attributes('aria-pressed')).toBe('true')
    expect(w.get('[data-sku="P01-BLUE-S"]').attributes('aria-pressed')).toBe('false')
    expect(w.get('.zt-sku-select__preview img').attributes('src')).toBe('/blue.svg')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
  it('selects a single SKC by default, skipping disabled or unavailable colors', () => {
    const w = mount(Sku, { props: { products: [{ spu: 'P', skcs: [{ ...products[0].skcs[0], disabled: true }, products[0].skcs[1]] }] } })
    expect(w.get('[data-skc="P01-WHITE"]').attributes('aria-pressed')).toBe('true')
    expect(w.emitted('change')).toBeUndefined()
  })
  it('preserves raw snake-case event context and clears only the SKU', async () => {
    const w = mount(Sku, { props: { products, clearable: true } })
    await w.get('[data-sku="P01-BLUE-S"]').trigger('click')
    expect(w.emitted('change')?.[0]).toEqual([{ spu: products[0], skc: products[0].skcs[0], sku: products[0].skcs[0].skus[0] }])
    await w.get('[aria-label="清空选择"]').trigger('click')
    expect(w.get('[data-skc="P01-BLUE"]').attributes('aria-pressed')).toBe('true')
    expect(w.findAll('[data-sku][aria-pressed="true"]')).toHaveLength(0)
  })
})
