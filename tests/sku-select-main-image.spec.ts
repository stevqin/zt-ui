import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { h } from 'vue'
import Provider from '../src/components/config-provider/ZtConfigProvider.vue'
import SkuSelect from '../src/components/sku-select/ZtSkuSelect.vue'
const products = [{ product_no: 'P', skcs: [{ skc: 'P-BLUE', color_name: '蓝色', image_url: '/blue.svg', skus: [{ sku: 'P-BLUE-M', size_code: 'M' }] }] }]
it('shows the main image by default and removes its column when disabled without changing the selected SKU', async () => {
  const w = mount(SkuSelect, { props: { products } })
  expect(w.find('.zt-sku-select__preview').exists()).toBe(true)
  await w.get('[data-sku="P-BLUE-M"]').trigger('click')
  const before = w.emitted('change')!.length
  await w.setProps({ showMainImage: false })
  expect(w.find('.zt-sku-select__preview').exists()).toBe(false)
  expect(w.classes()).toContain('zt-sku-select--without-main-image')
  expect(w.get('[data-sku="P-BLUE-M"]').attributes('aria-pressed')).toBe('true')
  await w.setProps({ showMainImage: true })
  expect(w.find('.zt-sku-select__preview').exists()).toBe(true)
  expect(w.emitted('change')).toHaveLength(before)
  w.unmount()
})

it('prioritizes an explicit size over ConfigProvider', () => {
  const w = mount(Provider, { props: { size: 'large' }, slots: { default: () => h(SkuSelect, { products, size: 'mini' }) } })
  expect(w.get('.zt-sku-select').classes()).toContain('zt-sku-select--mini')
  w.unmount()
})
