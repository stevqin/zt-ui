import { mount, flushPromises } from '@vue/test-utils'
import { reactive, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import SearchForm from '../src/components/vtable-grid/search-form'
import { createGridOptionLoader } from '../src/components/vtable-grid/option-loader'
import type { ZtFormInstance } from '../src/components/form/types'

describe('grid options', () => {
  it('deduplicates per cache and retries failures', async () => {
    const loader = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue([{ label: 'A', value: 1 }])
    const cache = createGridOptionLoader(loader)
    const first = cache.load('brand')
    expect(cache.load('brand')).toBe(first)
    await expect(first).rejects.toThrow('offline')
    await expect(cache.load('brand')).resolves.toEqual([{ label: 'A', value: 1 }])
    await cache.load('brand')
    expect(loader).toHaveBeenCalledTimes(2)
    await createGridOptionLoader(loader).load('brand')
    expect(loader).toHaveBeenCalledTimes(3)
  })
  it('settles cancellation even when the loader ignores the abort signal', async () => {
    const cache = createGridOptionLoader(() => new Promise(() => {}))
    const request = cache.load('slow')
    cache.dispose()
    await expect(request).rejects.toMatchObject({name:'AbortError'})
  })
  it('aborts invalidated requests and rejects late results', async () => {
    let resolve!: (value: never[]) => void
    let signal!: AbortSignal
    const cache = createGridOptionLoader((_source, context) => {
      signal = context.signal
      return new Promise(done => { resolve = done })
    })
    const pending = cache.load('brand')
    cache.invalidate()
    expect(signal.aborted).toBe(true)
    resolve([])
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    cache.dispose()
    await expect(cache.load('brand')).rejects.toMatchObject({ name: 'AbortError' })
  })
})
describe('configured search form', () => {
  it('validates submission, resets values and gives explicit model precedence', async () => {
    const model = reactive({ name: '' })
    const wrapper = mount(SearchForm, { props: { model, config: { data: { name: 'ignored' }, rules: { name: { required: true } }, items: [{ field: 'name', title: '名称', itemRender: { name: 'ZtInput' } }] } } })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.emitted('submit')).toBeUndefined()
    await wrapper.get('input').setValue('新名称')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.emitted('submit')?.[0]).toEqual([model])
    await wrapper.get('form').trigger('reset')
    expect(model.name).toBe('')
    expect(wrapper.emitted('reset')).toHaveLength(1)
    expect(typeof (wrapper.vm as unknown as ZtFormInstance).validate).toBe('function')
  })
  it('keeps folded fields mounted, supports named slots and unified size', async () => {
    const wrapper = mount(SearchForm, { props: { size: 'small', model: { name: 'A' }, config: { items: [{ field: 'name', folding: true, slots: { default: 'name' } }, { collapseNode: true }] } }, slots: { name: ({ data }) => h('span', { class: 'custom-field' }, String(data.name)) } })
    expect(wrapper.get('.custom-field').text()).toBe('A')
    expect(wrapper.get('.zt-form-item').attributes('style')).toContain('display: none')
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('.zt-form-item').attributes('style') || '').not.toContain('display: none')
  })
  it('loads remote options and discards a replaced loader response', async () => {
    let resolve!: (options: {label:string;value:number}[]) => void
    const config = { items: [{ field: 'brand', itemRender: { name: 'ZtSelect', optionSource: 'brand' } }] }
    const wrapper = mount(SearchForm, { props: { config, optionLoader: () => new Promise(done => { resolve = done }) } })
    await wrapper.setProps({ optionLoader: async () => [{label:'Current',value:2}] })
    resolve([{label:'Old',value:1}])
    await flushPromises()
    expect(wrapper.findComponent({name:'ZtSelect'}).props('options')).toEqual([{label:'Current',value:2,disabled:false}])
    wrapper.unmount()
  })
  it('uses value adapters for business formats without forcing an alternate size', async () => {
    const model = reactive({ date: '20261030' })
    const wrapper = mount(SearchForm, { props: { model, size: 'small', config: { size: 'large', items: [{ field:'date', itemRender: { name: 'ZtDatePicker', props: {valueFormat: 'YYYYMMDD'}, valueAdapter: {toControl: value => String(value).replace(/(....)(..)(..)/, '$1-$2-$3'), fromControl: value => value === null ? null : String(value).replaceAll('-', '')} } }] } } })
    const control = wrapper.findComponent({name:'ZtDatePicker'})
    expect(control.props('modelValue')).toBe('2026-10-30')
    expect(control.props('size')).toBe('small')
    control.vm.$emit('update:modelValue', null)
    expect(model.date).toBeNull()
  })
  it.each([['ZtDateTimePicker', {type:'quarter'}], ['ZtTimeSelect', {range:true}], ['ZtDateTimePicker', {valueFormat:'timestamp'}]])('rejects unsupported %s options instead of forwarding them', (name, controlProps) => {
    expect(() => mount(SearchForm, {props:{config:{items:[{field:'date',itemRender:{name,props:controlProps}}]}}})).toThrow(/需要|不支持/)
  })
  it('requires an explicit renderer for unsupported temporal modes', () => {
    expect(() => mount(SearchForm, { props: { config: { items: [{ field: 'date', itemRender: { name: 'ZtDatePicker', props: { type: 'quarter' } } }] } } })).toThrow(/quarter/)
  })
})

it('passes size and busy state into configured named form slots', async () => {
  const field = vi.fn(() => h('span', '自定义字段'))
  const wrapper = mount(SearchForm, { props: { size: 'small', disabled: true, loading: true, model: { name: 'A' }, config: { items: [{ field: 'name', slots: { default: 'custom' } }] } }, slots: { custom: field } })
  try {
    expect(field.mock.calls[0]?.[0]).toMatchObject({ size: 'small', disabled: true, loading: true, data: { name: 'A' }, field: 'name' })
  } finally { wrapper.unmount() }
})
