import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtModal, ZtPopover, ZtTooltip } from '../src'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(wrapper => wrapper.unmount()); document.body.innerHTML = '' })
function button(id: string) { return document.getElementById(id) as HTMLButtonElement }
async function click(id: string) {
  const target = button(id)
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  await nextTick()
  // A native click cannot reach an element removed by the preceding pointerdown.
  if (target.isConnected) target.click()
  await flushPromises()
}
function fixture(inModal = false, persistent = false) {
  const events: string[] = []
  const parent = ref<InstanceType<typeof ZtPopover>>()
  const show = ref(true)
  const nested = () => h(ZtPopover, { ref: parent, persistent, 'onUpdate:visible': value => events.push(`parent:${value}`) }, {
    default: () => h('button', { id: 'outer-trigger' }, 'Outer'),
    content: () => h(ZtPopover, { persistent, 'onUpdate:visible': value => events.push(`child:${value}`) }, {
      default: () => h('button', { id: 'inner-trigger' }, 'Inner'),
      content: () => h('button', { id: 'inner-action', onClick: () => events.push('action') }, 'Action'),
    }),
  })
  const wrapper = mount(defineComponent({ setup: () => () => show.value ? (inModal ? h(ZtModal, { modelValue: true, showHeader: false }, nested) : nested()) : null }), { attachTo: document.body })
  wrappers.push(wrapper)
  return { wrapper, parent, show, events }
}
const visiblePopups = () => [...document.querySelectorAll<HTMLElement>('.zt-popover')].filter(popup => popup.style.display !== 'none')
describe('nested teleported Popover ownership', () => {
  it.each([false, true])('delivers a child pointer action and keeps both branches open (Modal=%s)', async inModal => {
    const { events } = fixture(inModal)
    await flushPromises(); await click('outer-trigger'); await click('inner-trigger'); await click('inner-action')
    expect(events).toEqual(['parent:true', 'child:true', 'action'])
    expect(visiblePopups()).toHaveLength(2)
  })
  it.each([false, true])('Escape closes only the innermost branch and restores its trigger (Modal=%s)', async inModal => {
    const { events, wrapper } = fixture(inModal)
    await flushPromises(); await click('outer-trigger'); await click('inner-trigger')
    button('inner-action').focus()
    button('inner-action').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(events).toEqual(['parent:true', 'child:true', 'child:false'])
    expect(visiblePopups()).toHaveLength(1)
    expect(document.activeElement).toBe(button('inner-trigger'))
    if (inModal) expect(wrapper.findComponent(ZtModal).emitted('update:modelValue')).toBeUndefined()
  })
  it('closes persistent descendants with their parent and cleans registrations on unmount', async () => {
    const { events, parent, show } = fixture(false, true)
    await click('outer-trigger'); await click('inner-trigger')
    parent.value!.hide(); await flushPromises()
    expect(events).toContain('child:false')
    expect(visiblePopups()).toHaveLength(0)
    await click('outer-trigger')
    expect(visiblePopups()).toHaveLength(1)
    await click('inner-trigger')
    show.value = false; await flushPromises()
    expect(document.querySelector('.zt-popover')).toBeNull()
    const eventCount = events.length
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(events).toHaveLength(eventCount)
  })
  it('lets a nested Tooltip own its manual Escape without closing its Popover', async () => {
    const wrapper = mount(ZtPopover, { attachTo: document.body, props: { visible: true }, slots: {
      default: () => h('button', 'Outer'),
      content: () => h(ZtTooltip, { content: 'Hint', visible: true }, () => h('button', 'Tooltip trigger')),
    } })
    wrappers.push(wrapper); await flushPromises()
    const trigger = document.querySelector<HTMLElement>('.zt-tooltip__trigger')!
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    expect(visiblePopups()).toHaveLength(1)
    expect(wrapper.emitted('update:visible')).toBeUndefined()
  })
})
