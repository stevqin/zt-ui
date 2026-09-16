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
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));await nextTick();expect(wrapper.emitted('switch')?.[0]).toEqual([1])
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));await nextTick();expect(document.querySelector('[role="dialog"]')).toBeNull();wrapper.unmount()
  })
})
describe('Avatar',()=>{
  it('falls back to first grapheme and retries after src changes',async()=>{
    const wrapper=mount(ZtAvatar,{props:{src:'/bad.svg',alt:'林青'}});await wrapper.get('img').trigger('error');expect(wrapper.text()).toBe('林');expect(wrapper.emitted('error')).toHaveLength(1)
    await wrapper.setProps({src:'/good.svg'});expect(wrapper.get('img').attributes('src')).toBe('/good.svg')
  })
  it('supports numeric size, shape and status',()=>{const wrapper=mount(ZtAvatar,{props:{size:52,shape:'circle',status:'success'}});expect(wrapper.attributes('style')).toContain('52px');expect(wrapper.classes()).toContain('zt-avatar--success')})
})
