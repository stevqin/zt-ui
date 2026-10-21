import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, KeepAlive, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZtModal, ZtDrawer } from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); resetOverlayManager(); document.body.innerHTML = '' })

describe.each([['Modal', ZtModal], ['Drawer', ZtDrawer]] as const)('%s retained lifecycle', (_, component) => {
  it('keeps narrow fullscreen geometry until its leave animation finishes', async () => {
    vi.stubGlobal('matchMedia',vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})))
    const w=mount(component as any,{attachTo:document.body,props:{modelValue:true,fullscreenBelow:768}});wrappers.push(w)
    await w.setProps({modelValue:false})
    const root=document.querySelector('.zt-modal, .zt-drawer-surface')!
    expect(root.classList.contains(component===ZtModal?'zt-modal--fullscreen':'zt-drawer-surface--narrow')).toBe(true)
    vi.unstubAllGlobals()
  })

  it('closes and releases body locking when its cached page deactivates', async () => {
    const active = ref(true), visible = ref(true)
    const Scene = defineComponent({setup: () => () => h(component as any, {modelValue: visible.value, 'onUpdate:modelValue': (v: boolean) => visible.value = v})})
    wrappers.push(mount({setup: () => () => h(KeepAlive, null, {default: () => active.value ? h(Scene) : h('div', '另一页')})}, {attachTo: document.body}))
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    active.value = false
    await nextTick()
    expect(visible.value).toBe(false)
    expect(document.body.style.overflow).not.toBe('hidden')
    active.value = true
    await nextTick()
    expect(visible.value).toBe(false)
  })

  it('does not let an obsolete async guard close a newly opened window', async () => {
    let resolve!: (value: boolean) => void
    const wrapper = mount(component as any, {attachTo: document.body, props: {modelValue: true, beforeClose: () => new Promise<boolean>(r => resolve = r)}})
    wrappers.push(wrapper)
    const close = (wrapper.vm as any).close()
    await wrapper.setProps({modelValue: false})
    await wrapper.setProps({modelValue: true})
    resolve(true)
    await close
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-busy')).toBe('false')
  })

  it('rechecks loading or saving after an asynchronous guard resolves', async () => {
    let resolve!: (value: boolean) => void
    const wrapper = mount(component as any, {attachTo: document.body, props: {modelValue:true, beforeClose: () => new Promise<boolean>(r => resolve=r)}})
    wrappers.push(wrapper)
    const close = (wrapper.vm as any).close()
    await wrapper.setProps({confirmLoading:true})
    resolve(true)
    expect(await close).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('releases busy state when reopened during its leave animation', async () => {
    const wrapper = mount(component as any, {attachTo: document.body, props: {modelValue: true}})
    wrappers.push(wrapper)
    await (wrapper.vm as any).close()
    await wrapper.setProps({modelValue: false})
    await wrapper.setProps({modelValue: true})
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-busy')).toBe('false')
  })

  it('leaves Escape from an external confirmation window alone when focusTrap is false', async () => {
    const wrapper = mount(component as any, {attachTo: document.body, props: {modelValue: true, focusTrap: false}})
    wrappers.push(wrapper)
    const external = document.createElement('button'); document.body.append(external)
    external.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}))
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

it('closes a retained nested drawer when its parent modal is hidden', async () => {
  const parent = ref(true), child = ref(true)
  wrappers.push(mount({setup: () => () => h(ZtModal, {modelValue: parent.value}, {default: () => h(ZtDrawer, {modelValue: child.value, 'onUpdate:modelValue': v => child.value = v})})}, {attachTo: document.body}))
  await nextTick()
  parent.value = false
  await nextTick()
  expect(child.value).toBe(false)
})
