import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ZtSegmented from '../src/components/segmented/ZtSegmented.vue'
import ZtCollapse from '../src/components/collapse/ZtCollapse.vue'
import ZtCollapseItem from '../src/components/collapse/ZtCollapseItem.vue'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.forEach(w => w.unmount()); wrappers.length = 0; vi.restoreAllMocks(); vi.unstubAllGlobals() })

// happy-dom has no layout: these stand in for browser button geometry only.
function layout() {
  const widths = [70, 120, 90]
  for (const [property, read] of Object.entries({
    offsetLeft: (i: number) => [3, 76, 199][i], offsetTop: () => 3,
    offsetWidth: (i: number) => widths[i], offsetHeight: () => 34,
  })) vi.spyOn(HTMLElement.prototype, property, 'get').mockImplementation(function (this: HTMLElement) {
    return this.getAttribute('role') === 'radio' ? read(Array.from(this.parentElement!.querySelectorAll('[role="radio"]')).indexOf(this)) : 0
  })
  return widths
}

describe('Segmented active capsule', () => {
  it('measures a single capsule on mount and moves/resizes it after controlled updates', async () => {
    layout()
    const wrapper = mount(ZtSegmented, { props: { modelValue: 'a', options: ['a', 'long label', 'c'] } }); wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.findAll('.zt-segmented__indicator')).toHaveLength(1)
    const indicator = wrapper.get('.zt-segmented__indicator')
    expect(indicator.attributes('aria-hidden')).toBe('true')
    expect(indicator.attributes('style')).toContain('translateX(3px)')
    expect(indicator.attributes('style')).toContain('width: 70px')
    expect(indicator.classes()).not.toContain('is-animated')
    await wrapper.setProps({ modelValue: 'long label' })
    expect(indicator.attributes('style')).toContain('translateX(76px)')
    expect(indicator.attributes('style')).toContain('width: 120px')
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.setProps({ options: ['a', 'c'] })
    expect(wrapper.find('.zt-segmented__indicator').exists()).toBe(false)
    await wrapper.setProps({ modelValue: 'c' })
    expect(wrapper.get('.zt-segmented__indicator').attributes('style')).toContain('translateX(76px)')
  })

  it('tracks container/button resizes and ignores disabled selections', async () => {
    const widths = layout()
    let resized: () => void = () => {}
    vi.stubGlobal('ResizeObserver', class { constructor(callback: () => void) { resized = callback } observe() {} disconnect() {} })
    const wrapper = mount(ZtSegmented, { props: { modelValue: 'a', block: true, options: ['a', { label: 'B', value: 'b', disabled: true }, 'c'] } }); wrappers.push(wrapper)
    await nextTick()
    widths[0] = 150
    resized()
    await nextTick()
    expect(wrapper.get('.zt-segmented__indicator').attributes('style')).toContain('width: 150px')
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.findAll('button')[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['c']])
  })
})

it('uses a tail-free disclosure chevron while preserving collapse toggling', async () => {
  const wrapper = mount(ZtCollapse, { slots: { default: () => h(ZtCollapseItem, { name: 'a', title: '详情' }, () => '内容') } }); wrappers.push(wrapper)
  expect(wrapper.get('.zt-collapse-item__arrow path').attributes('d')).toBe('m9 6 6 6-6 6')
  await wrapper.get('button').trigger('click')
  expect(wrapper.emitted('update:modelValue')).toEqual([[['a']]])
})
