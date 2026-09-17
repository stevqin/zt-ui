import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { expect, it, vi } from 'vitest'
import { ZtPopover, ZtTooltip } from '../src'

it('places popovers above containing portal overlays and responds to their layer changes', async () => {
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;z-index:6400'
  document.body.append(host)
  const wrapper = mount(ZtPopover, {attachTo:host, slots:{default:()=>h('button','打开'),content:()=> '菜单'}})
  try {
    await wrapper.get('button').trigger('click'); await nextTick()
    const popup = document.querySelector<HTMLElement>('.zt-popover')!
    expect(Number(popup.style.zIndex)).toBe(6401)
    host.style.zIndex = '7200'
    window.dispatchEvent(new Event('resize')); await nextTick()
    expect(Number(popup.style.zIndex)).toBe(7201)
  } finally {wrapper.unmount();host.remove()}
})

it('dismisses tooltip immediately when its trigger is activated', async () => {
  vi.useFakeTimers()
  const wrapper = mount(ZtTooltip, {attachTo:document.body, props:{content:'列设置',openDelay:0},slots:{default:()=>h('button','列设置')}})
  try {
    await wrapper.get('.zt-tooltip__trigger').trigger('pointerenter')
    vi.runOnlyPendingTimers(); await nextTick(); await nextTick()
    expect(document.querySelector('[role=tooltip]')).not.toBeNull()
    await wrapper.get('button').trigger('click')
    await nextTick();await nextTick()
    expect(document.querySelector('[role=tooltip]')).toBeNull()
  } finally {wrapper.unmount();vi.useRealTimers()}
})
