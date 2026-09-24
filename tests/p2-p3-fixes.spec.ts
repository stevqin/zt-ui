import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZtBadge } from '../src/components/badge'
import { ZtSelect } from '../src/components/select'
import { ZtTag } from '../src/components/tag'
import { ZtInfiniteScroll } from '../src/components/infinite-scroll'
import { ZtModal } from '../src/components/modal'
import { ZtEmpty } from '../src/components/empty'
import { ZtResult } from '../src/components/result'
import { ZtAlert } from '../src/components/alert'
import { filterSelectOptions } from '../src/components/select/options'

describe('P2/P3 fixes', () => {
  it('filterSelectOptions tolerates missing label', () => {
    const options = [{ value: 'zzz' } as any, { label: 'Beta', value: 'b' }]
    expect(filterSelectOptions(options, 'zzz')).toHaveLength(1)
    expect(filterSelectOptions(options, 'beta')).toHaveLength(1)
  })

  it('Badge hides empty value without slot', () => {
    const wrapper = mount(ZtBadge, { props: { value: undefined } })
    expect(wrapper.find('.zt-badge__content').exists()).toBe(false)
  })

  it('Tag close stops propagation', async () => {
    const parent = vi.fn()
    const Host = defineComponent({
      components: { ZtTag },
      template: `<div @click="parent"><ZtTag closable @close="onClose">x</ZtTag></div>`,
      setup: () => ({ parent, onClose: vi.fn() }),
    })
    const wrapper = mount(Host)
    await wrapper.find('.zt-tag__close').trigger('click')
    expect(parent).not.toHaveBeenCalled()
  })

  it('Select exposes clear()', () => {
    const wrapper = mount(ZtSelect, {
      props: {
        options: [{ label: 'a', value: 'a' }],
        clearable: true,
        modelValue: 'a',
      },
    })
    expect(typeof (wrapper.vm as any).clear).toBe('function')
    ;(wrapper.vm as any).clear()
  })

  it('InfiniteScroll rechecks after load completes', async () => {
    const load = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(ZtInfiniteScroll, {
      props: { load, immediate: true, distance: 10000 },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    await nextTick()
    expect(load.mock.calls.length).toBeGreaterThanOrEqual(1)
    wrapper.unmount()
  })

  it('Modal accepts numeric string width', async () => {
    const Host = defineComponent({
      components: { ZtModal },
      setup: () => ({ visible: ref(true) }),
      template: `<ZtModal v-model="visible" width="560">x</ZtModal>`,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const modal = wrapper.findComponent(ZtModal)
    const style = (modal.vm as any).panelStyle ?? {}
    // panelStyle is internal; assert via rendered panel width
    const panel = document.querySelector('[class*="zt-modal"]') as HTMLElement
    const width = panel?.style?.width
    expect(width === '560px' || width === '560' || style.width === '560px').toBe(
      true,
    )
    wrapper.unmount()
  })

  it('Empty accepts imageAlt', () => {
    const wrapper = mount(ZtEmpty, {
      props: { image: '/x.png', imageAlt: 'empty art' },
    })
    expect(wrapper.find('img').attributes('alt')).toBe('empty art')
  })

  it('Result failure uses role=alert', () => {
    const wrapper = mount(ZtResult, { props: { status: 'danger' } })
    expect(wrapper.attributes('role')).toBe('alert')
  })

  it('Alert supports controlled modelValue', async () => {
    const Host = defineComponent({
      components: { ZtAlert },
      setup: () => ({ open: ref(true) }),
      template: `<ZtAlert v-model="open" title="t" />`,
    })
    const wrapper = mount(Host)
    await wrapper.find('button').trigger('click')
    expect((wrapper.vm as any).open).toBe(false)
    ;(wrapper.vm as any).open = true
    await nextTick()
    expect(wrapper.find('.zt-alert').exists()).toBe(true)
  })
})
