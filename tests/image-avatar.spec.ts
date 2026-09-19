import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { ZtAvatar, ZtImage } from '../src'

describe('Image', () => {
  it('moves through placeholder, loaded and error states and resets on src change', async () => {
    const wrapper=mount(ZtImage,{props:{src:'/first.svg',alt:'第一张'},slots:{placeholder:'正在加载',error:'加载失败'}})
    expect(wrapper.text()).toContain('正在加载');await wrapper.get('img').trigger('load');expect(wrapper.text()).not.toContain('正在加载')
    await wrapper.setProps({src:'/second.svg'});expect(wrapper.text()).toContain('正在加载');await wrapper.get('img').trigger('error');expect(wrapper.text()).toContain('加载失败')
  })
  it('opens an accessible preview and switches images',async()=>{
    const wrapper=mount(ZtImage,{attachTo:document.body,props:{src:'/a.svg',previewSrcList:['/a.svg','/b.svg']}})
    await wrapper.trigger('click');await nextTick();expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.querySelector<HTMLImageElement>('[role="dialog"] img')?.getAttribute('src')).toBe('/a.svg')
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));await nextTick();expect(wrapper.emitted('switch')?.[0]).toEqual([1])
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));await nextTick();expect(document.querySelector('[role="dialog"]')).toBeNull();wrapper.unmount()
  })
  it('previews src by default when preview-src-list is omitted',async()=>{
    const wrapper=mount(ZtImage,{attachTo:document.body,props:{src:'/single.svg'}})
    expect(wrapper.classes()).toContain('is-preview')
    expect(wrapper.attributes('role')).toBe('button')
    await wrapper.trigger('click');await nextTick()
    expect(document.querySelector<HTMLImageElement>('[role="dialog"] img')?.getAttribute('src')).toBe('/single.svg')
    expect(document.querySelector('.zt-image-viewer__toolbar')?.textContent).toContain('1 / 1')
    wrapper.unmount()
  })
  it('uses an explicit preview-src-list instead of src',async()=>{
    const wrapper=mount(ZtImage,{attachTo:document.body,props:{src:'/thumb.svg',previewSrcList:['/large-a.svg','/large-b.svg'],initialIndex:1}})
    await wrapper.trigger('click');await nextTick()
    expect(document.querySelector<HTMLImageElement>('[role="dialog"] img')?.getAttribute('src')).toBe('/large-b.svg')
    expect(document.querySelector('.zt-image-viewer__toolbar')?.textContent).toContain('2 / 2')
    wrapper.unmount()
  })
  it('disables every preview entry point when show-preview is false',async()=>{
    const wrapper=mount(ZtImage,{attachTo:document.body,props:{src:'/single.svg',previewSrcList:['/large.svg'],showPreview:false}})
    expect(wrapper.classes()).not.toContain('is-preview')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.find('.zt-image__preview-mask').exists()).toBe(false)
    await wrapper.trigger('click');await wrapper.trigger('keydown',{key:'Enter'});await nextTick()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(wrapper.emitted('show')).toBeUndefined()
    wrapper.unmount()
  })
  it('treats an explicitly empty preview-src-list as no preview source',async()=>{
    const wrapper=mount(ZtImage,{attachTo:document.body,props:{src:'/single.svg',previewSrcList:[]}})
    expect(wrapper.classes()).not.toContain('is-preview')
    await wrapper.trigger('click');await nextTick()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    wrapper.unmount()
  })
})
describe('Avatar',()=>{
  it('falls back to first grapheme and retries after src changes',async()=>{
    const wrapper=mount(ZtAvatar,{props:{src:'/bad.svg',alt:'林青'}});await wrapper.get('img').trigger('error');expect(wrapper.text()).toBe('林');expect(wrapper.emitted('error')).toHaveLength(1)
    await wrapper.setProps({src:'/good.svg'});expect(wrapper.get('img').attributes('src')).toBe('/good.svg')
  })
  it('supports numeric size, shape and status',()=>{const wrapper=mount(ZtAvatar,{props:{size:52,shape:'circle',status:'success'}});expect(wrapper.attributes('style')).toContain('52px');expect(wrapper.classes()).toContain('zt-avatar--success')})
})
