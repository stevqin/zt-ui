import { flushPromises, mount } from '@vue/test-utils'
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
    vi.runOnlyPendingTimers(); await nextTick(); await nextTick(); await flushPromises()
    expect(document.querySelector('[role=tooltip]')).not.toBeNull()
    await wrapper.get('button').trigger('click')
    await nextTick();await nextTick()
    expect(document.querySelector('[role=tooltip]')).toBeNull()
  } finally {wrapper.unmount();vi.useRealTimers()}
})

it('dismisses a sized Tooltip by keyboard without closing its Modal, and can reopen it', async () => {
 const { ZtModal } = await import('../src')
 vi.useFakeTimers()
 const wrapper = mount(ZtModal, {attachTo:document.body, props:{modelValue:true,zIndex:6400,showHeader:false},slots:{default:()=>h(ZtTooltip,{content:'嵌套提示',width:120,height:80,openDelay:0},()=>h('button','提示按钮'))}})
 try {
  await flushPromises()
  const tooltip = wrapper.findComponent(ZtTooltip)
  await tooltip.get('.zt-tooltip__trigger').trigger('pointerenter')
  vi.runOnlyPendingTimers(); await nextTick(); await nextTick(); await flushPromises()
  const popup = document.querySelector<HTMLElement>('.zt-popover')!
  expect(popup.closest('.zt-modal__panel')).toBeNull()
  expect(document.body.contains(popup)).toBe(true)
  expect(Number(popup.style.zIndex)).toBeGreaterThanOrEqual(6401)
  await tooltip.get('.zt-tooltip__trigger').trigger('keydown',{key:'Escape'})
  await nextTick(); await nextTick()
  expect(document.querySelector('[role=tooltip]')).toBeNull()
  expect(tooltip.get('.zt-tooltip__trigger').attributes('aria-describedby')).toBeUndefined()
  expect(tooltip.emitted('update:visible')?.at(-1)).toEqual([false])
  expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  await tooltip.get('.zt-tooltip__trigger').trigger('pointerenter')
  vi.runOnlyPendingTimers(); await nextTick(); await nextTick(); await flushPromises()
  expect(document.querySelector('[role=tooltip]')).not.toBeNull()
 } finally {wrapper.unmount();vi.useRealTimers();document.body.innerHTML=''}
})
