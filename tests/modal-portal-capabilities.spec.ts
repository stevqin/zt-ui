import { mount, flushPromises } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZtModal } from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'
const wrappers: ReturnType<typeof mount>[] = []
function scene(props = {}, slots = {}) {
 const wrapper = mount(ZtModal, {attachTo: document.body, props: {modelValue: true, ...props} as any, slots})
 wrappers.push(wrapper); return wrapper
}
afterEach(() => {wrappers.splice(0).forEach(w => w.unmount());resetOverlayManager();vi.unstubAllGlobals();document.body.innerHTML = ''})

describe('Modal Portal capabilities', () => {
 it('applies fixed body geometry and custom scroll without losing existing defaults', async () => {
  const w = scene({height: '640', maxHeight: '88%', bodyScroll: false, bodyPadding: 0, subtitle: '副标题', closeLabel: '退出编辑'})
  const panel = document.querySelector<HTMLElement>('.zt-modal__panel')!
  expect(panel.style.height).toBe('640px');expect(panel.style.maxHeight).toBe('88%')
  expect(panel.querySelector('.zt-modal__subtitle')?.textContent).toBe('副标题')
  expect(panel.querySelector('.zt-modal__close')?.getAttribute('aria-label')).toBe('退出编辑')
  expect(panel.querySelector('.zt-modal__body--custom-scroll')).not.toBeNull()
  expect((panel.querySelector('.zt-modal__body') as HTMLElement).style.padding).toBe('0px')
  await w.setProps({fullscreen: true}); expect(panel.style.height).toBe('100%')
  await w.setProps({fullscreen: false}); expect(panel.style.height).toBe('640px')
 })
 it('allows a custom content layout and header actions with exposed fullscreen control', async () => {
  const w = scene({showZoom: true, classNames: {panel:'legacy-panel', tools:'legacy-tools'}}, {
   content: ({close}: any) => h('button', {id:'custom-close',onClick: () => close('cancel')}, '关闭布局'),
   'header-actions': ({toggleFullscreen}: any) => h('button', {id:'custom-full',onClick:toggleFullscreen}, '切换全屏'),
  })
  expect(document.querySelector('.zt-modal__fullscreen')).not.toBeNull()
  expect(document.querySelector('.zt-modal__body')).toBeNull()
  expect(document.querySelector('.legacy-panel')).not.toBeNull()
  expect(document.querySelector('.legacy-tools')).not.toBeNull()
  document.querySelector<HTMLButtonElement>('#custom-full')!.click();await nextTick()
  expect(w.emitted('update:fullscreen')?.[0]).toEqual([true])
  expect(typeof (w.vm as any).toggleFullscreen).toBe('function')
  document.querySelector<HTMLButtonElement>('#custom-close')!.click();await flushPromises()
  expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
 })
 it('provides fullscreen control to legacy footer slots and respects an explicit disabled fullscreen button', async () => {
  let toggle: unknown
  scene({showZoom:true, showFullscreenButton:false}, {footer: (scope:any) => {toggle=scope.toggleFullscreen;return h('span','自定义底部')}})
  expect(typeof toggle).toBe('function')
  expect(document.querySelector('.zt-modal__fullscreen')).toBeNull()
 })
 it('blocks loading interactions and all close paths until loading finishes', async () => {
  const w = scene({loading: true, loadingText:'读取明细…', showFooter:true}, {default: () => h('input')})
  expect(document.querySelector('[role=status]')?.textContent).toContain('读取明细…')
  expect(document.querySelector('.zt-modal__body')?.hasAttribute('inert')).toBe(true)
  expect(await (w.vm as any).close()).toBe(false)
  document.querySelector<HTMLButtonElement>('.zt-modal__confirm')!.click();await flushPromises()
  expect(w.emitted('confirm')).toBeUndefined()
  await w.setProps({loading:false}); expect(await (w.vm as any).close()).toBe(true)
 })
 it('uses narrow fullscreen without changing the explicit fullscreen model', async () => {
  let change!: () => void
  const media = {matches:true,addEventListener: (_: string, cb: () => void) => change=cb,removeEventListener:vi.fn()}
  vi.stubGlobal('matchMedia', vi.fn(() => media))
  const w=scene({fullscreenBelow:768,showZoom:true,placement:'bottom'})
  expect(document.querySelector('.zt-modal--fullscreen')).not.toBeNull()
  expect(document.querySelector('.zt-modal__fullscreen')).toBeNull()
  expect(w.emitted('update:fullscreen')).toBeUndefined()
  media.matches=false;change();await nextTick()
  expect(document.querySelector('.zt-modal--fullscreen')).toBeNull()
  expect(document.querySelector('.zt-modal--bottom')).not.toBeNull()
 })
})
