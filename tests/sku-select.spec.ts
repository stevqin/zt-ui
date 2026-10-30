import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import ZtSkuSelect from '../src/components/sku-select/ZtSkuSelect.vue'
import ZtConfigProvider from '../src/components/config-provider/ZtConfigProvider.vue'
import type { ZtSkuProduct, ZtSkuSelectProps } from '../src/components/sku-select/types'

const products: ZtSkuProduct[] = [
  { product_no: 'shirt', product_name: '衬衫', skcs: [
    { skc: 'blue', color_name: '蓝色', image_url: '/blue.png', skus: [{ sku: 'blue-s', size_code: 's', size_name: '小码' }, { sku: 'blue-m', size_code: 'm', disabled: true }] },
    { skc: 'white', color_name: '白色', image_url: '/white.png', skus: [{ sku: 'white-s', size_code: 's', size_name: '小码' }] },
    { skc: 'black', color_name: '黑色', disabled: true, skus: [{ sku: 'black-s', size_code: 's' }] },
    { skc: 'red', color_name: '红色', skus: [{ sku: 'red-s', size_code: 's', disabled: true }] },
  ] },
  { product_no: 'coat', product_name: '外套', skcs: [{ skc: 'blue', color_name: '蓝色', skus: [{ sku: 'coat-s', size_code: 's' }] }] },
]
const color = (code: string) => `[data-color="${code}"]`
const sku = (code: string) => `[data-sku="${code}"]`

function mountWithModel(initial: ZtSkuSelectProps) {
  const host = mount(defineComponent({
    setup() {
      const value = ref(initial.modelValue ?? null)
      return () => h(ZtSkuSelect, { ...initial, modelValue: value.value, 'onUpdate:modelValue': next => { value.value = next } })
    },
  }))
  return host.getComponent(ZtSkuSelect)
}

describe('ZtSkuSelect', () => {
  it('keeps an explicitly controlled null until the parent accepts a selection', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: null } })
    await w.get(color('blue')).trigger('click')
    await w.get(sku('blue-s')).trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['blue-s']])
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('false')
    expect(w.get('.zt-sku-select__summary').text()).toBe('请选择尺码')
    await w.setProps({ modelValue: 'blue-s' })
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('true')
  })
  it('retains the parent SKU when color or clear requests are rejected', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: 'blue-s', clearable: true } })
    await w.get(color('white')).trigger('click')
    expect(w.get(color('blue')).attributes('aria-pressed')).toBe('true')
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('true')
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('true')
    await w.get('[aria-label="清空选择"]').trigger('click')
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('true')
  })
  it('retains the parent SKU when another available size is rejected', async () => {
    const w = mount(ZtSkuSelect, { props: { products: [{ product_no: 'one', skcs: [{ skc: 'a', skus: [{ sku: 'a-s', size_code: 'S' }, { sku: 'a-m', size_code: 'M' }] }] }], modelValue: 'a-s' } })
    await w.get(sku('a-m')).trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['a-m']])
    expect(w.get(sku('a-s')).attributes('aria-pressed')).toBe('true')
    expect(w.get(sku('a-m')).attributes('aria-pressed')).toBe('false')
  })
  it('stores selections internally when modelValue is omitted', async () => {
    const w = mount(ZtSkuSelect, { props: { products, clearable: true } })
    await w.get(color('blue')).trigger('click')
    await w.get(sku('blue-s')).trigger('click')
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('true')
    await w.get('[aria-label="清空选择"]').trigger('click')
    expect(w.findAll('[data-sku][aria-pressed="true"]')).toHaveLength(0)
  })
  it('preserves draft colors through accepted v-model updates and resets them across products', async () => {
    const w = mountWithModel({ products, modelValue: 'blue-s' })
    await w.get(color('white')).trigger('click')
    expect(w.props('modelValue')).toBeNull()
    expect(w.get(color('white')).attributes('aria-pressed')).toBe('true')
    await w.get(sku('white-s')).trigger('click')
    expect(w.props('modelValue')).toBe('white-s')
    expect(w.get(sku('white-s')).attributes('aria-pressed')).toBe('true')
  })
  it('selects one SKU with original context and uses SKC images without mutating data', async () => {
    const before = JSON.stringify(products)
    const w = mountWithModel({ products, modelValue: null })
    await w.get(color('blue')).trigger('click')
    expect(w.get('.zt-sku-select__preview img').attributes('src')).toBe('/blue.png')
    await w.get(sku('blue-s')).trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['blue-s']])
    expect(w.emitted('change')?.[0]).toEqual([{ spu: products[0], skc: products[0]!.skcs[0], sku: products[0]!.skcs[0]!.skus[0] }])
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('true')
    expect(JSON.stringify(products)).toBe(before)
  })
  it('echoes controlled values and clears old SKU when changing color while retaining the new color', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: 'blue-s' } })
    expect(w.get(sku('blue-s')).attributes('aria-pressed')).toBe('true')
    await w.get(color('white')).trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null])
    await w.setProps({ modelValue: null })
    expect(w.get(color('white')).attributes('aria-pressed')).toBe('true')
    expect(w.get(sku('white-s')).attributes('aria-pressed')).toBe('false')
    await w.setProps({ modelValue: 'coat-s' })
    expect(w.get(sku('coat-s')).attributes('aria-pressed')).toBe('true')
  })
  it('switches SPU without carrying color identity across products', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: 'blue-s' } })
    await w.setProps({ products: [products[1]!] })
    await w.setProps({ modelValue: null })
    expect(w.findAll('[data-color][aria-pressed="true"]')).toHaveLength(1)
    expect(w.get(sku('coat-s')).attributes('aria-pressed')).toBe('false')
    expect(w.emitted('change')?.at(-1)).toEqual([null])
  })
  it('disables unavailable colors and sizes and respects global disabled', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: 'blue-s' } })
    expect(w.get(color('black')).attributes('disabled')).toBeDefined()
    expect(w.get(color('red')).attributes('disabled')).toBeDefined()
    expect(w.get(sku('blue-m')).attributes('disabled')).toBeDefined()
    await w.setProps({ disabled: true, clearable: true })
    expect(w.get(color('white')).attributes('disabled')).toBeDefined()
    expect(w.get('[aria-label="清空选择"]').attributes('disabled')).toBeDefined()
    await w.get(color('white')).trigger('click')
    expect(w.emitted('change')).toBeUndefined()
  })
  it('clears when data invalidates a selected SKU, including nested disabled changes', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: 'blue-s' } })
    const changed = structuredClone(products)
    changed[0]!.skcs[0]!.skus[0]!.disabled = true
    await w.setProps({ products: changed })
    expect(w.emitted('update:modelValue')).toEqual([[null]])
    expect(w.emitted('change')).toEqual([[null]])
    expect(w.findAll('[data-sku][aria-pressed="true"]')).toHaveLength(0)
  })
  it('handles invalid external values, empty products and clearability', async () => {
    const w = mount(ZtSkuSelect, { props: { products: [], modelValue: 'missing' } })
    expect(w.text()).toContain('暂无商品')
    expect(w.emitted('update:modelValue')).toEqual([[null]])
    await w.setProps({ products: products.slice(0, 1), modelValue: 'white-s', clearable: true })
    expect(w.find('[aria-label="切换商品"]').exists()).toBe(false)
    await w.get('[aria-label="清空选择"]').trigger('click')
    expect(w.emitted('change')?.at(-1)).toEqual([null])
    await w.setProps({ clearable: false })
    expect(w.find('[aria-label="清空选择"]').exists()).toBe(false)
  })
  it('inherits size and exposes selected context to its summary slot', () => {
    const w = mount(ZtConfigProvider, { props: { size: 'small' }, slots: {
      default: () => h(ZtSkuSelect, { products, modelValue: 'blue-s' }, { summary: ({ selection }: any) => selection?.sku.sku }),
    } })
    expect(w.findComponent(ZtSkuSelect).classes()).toContain('zt-sku-select--small')
    expect(w.text()).toContain('blue-s')
  })
  it('keeps distinct codes when display names repeat and exposes native keyboard buttons', async () => {
    const w = mountWithModel({ products: [{ product_no: 'one', skcs: [
      { skc: 'a', color_name: '同名颜色', skus: [{ sku: 'a-1', size_code: '1', size_name: '均码' }, { sku: 'a-2', size_code: '2', size_name: '均码' }] },
      { skc: 'b', color_name: '同名颜色', skus: [{ sku: 'b-1', size_code: '1', size_name: '均码' }] },
    ] }], modelValue: 'a-1' })
    expect(w.get(sku('a-1')).element.tagName).toBe('BUTTON')
    expect(w.get(sku('a-1')).attributes('type')).toBe('button')
    await w.get(sku('a-1')).trigger('click')
    expect(w.emitted('change')).toBeUndefined()
    await w.get(sku('a-2')).trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['a-2'])
    await w.get(color('b')).trigger('click')
    expect(w.get(color('b')).attributes('aria-pressed')).toBe('true')
    expect(w.get(sku('b-1')).attributes('aria-pressed')).toBe('false')
  })
  it('responds to external changes while disabled and clears when the selected product disappears', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: null, disabled: true } })
    await w.setProps({ modelValue: 'coat-s' })
    expect(w.get(sku('coat-s')).attributes('aria-pressed')).toBe('true')
    expect(w.emitted('change')).toBeUndefined()
    await w.setProps({ products: products.slice(0, 1) })
    expect(w.emitted('update:modelValue')).toEqual([[null]])
    expect(w.findAll('[data-sku][aria-pressed="true"]')).toHaveLength(0)
  })
  it('allows initially empty products to load and clears a selected SKU if its color is disabled', async () => {
    const w = mount(ZtSkuSelect, { props: { products: [] as ZtSkuProduct[], modelValue: null } })
    await w.setProps({ products })
    expect(w.find(color('blue')).exists()).toBe(true)
    await w.setProps({ modelValue: 'blue-s' })
    const changed = structuredClone(products)
    changed[0]!.skcs[0]!.disabled = true
    await w.setProps({ products: changed })
    expect(w.emitted('change')).toEqual([[null]])
    expect(w.get(color('white')).attributes('aria-pressed')).toBe('true')
    expect(w.get(sku('white-s')).attributes('aria-pressed')).toBe('false')
  })

  it('clears a partial color draft back to the first SKC without selecting a SKU', async () => {
    const w = mount(ZtSkuSelect, { props: { products, modelValue: null, clearable: true } })
    await w.get(color('white')).trigger('click')
    await w.get('[aria-label="清空选择"]').trigger('click')
    expect(w.findAll('[data-color][aria-pressed="true"]')).toHaveLength(1)
    expect(w.get(color('blue')).attributes('aria-pressed')).toBe('true')
    expect(w.emitted('change')).toEqual([[null]])
    expect(w.emitted('update:modelValue')).toEqual([[null]])
  })

})
