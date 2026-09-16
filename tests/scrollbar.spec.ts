import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZtConfigProvider, ZtScrollbar } from '../src'
import { calculateThumb } from '../src/components/scrollbar/scrollbar'

function metric(element:Element,name:string,value:number){Object.defineProperty(element,name,{value,writable:true,configurable:true})}

describe('Scrollbar geometry',()=>{
  it('derives a minimum thumb and maps scroll to its track',()=>{
    expect(calculateThumb(100,1000,450,20)).toEqual({size:20,offset:40})
    expect(calculateThumb(100,100,0,20)).toEqual({size:0,offset:0})
    expect(calculateThumb(0,100,20,20)).toEqual({size:0,offset:0})
  })
})

describe('Scrollbar',()=>{
  afterEach(()=>vi.unstubAllGlobals())

  it('emits native scroll positions and exposes scrolling methods',async()=>{
    const wrapper=mount(ZtScrollbar,{props:{height:100},slots:{default:'内容'}})
    const wrap=wrapper.get('.zt-scrollbar__wrap').element as HTMLElement
    metric(wrap,'scrollTop',36);metric(wrap,'scrollLeft',4)
    await wrapper.get('.zt-scrollbar__wrap').trigger('scroll')
    expect(wrapper.emitted('scroll')?.[0]).toEqual([{scrollTop:36,scrollLeft:4}])
    wrapper.vm.setScrollTop(72);wrapper.vm.setScrollLeft(18)
    expect(wrap.scrollTop).toBe(72);expect(wrap.scrollLeft).toBe(18)
    const scrollTo=vi.spyOn(wrap,'scrollTo');wrapper.vm.scrollTo({top:90,behavior:'smooth'})
    expect(scrollTo).toHaveBeenCalledWith({top:90,behavior:'smooth'})
  })

  it('updates thumb sizes and hides axes without overflow',async()=>{
    const wrapper=mount(ZtScrollbar,{props:{height:100,minSize:20},slots:{default:'内容'}})
    const wrap=wrapper.get('.zt-scrollbar__wrap').element as HTMLElement
    metric(wrap,'clientHeight',100);metric(wrap,'scrollHeight',500);metric(wrap,'clientWidth',200);metric(wrap,'scrollWidth',200);metric(wrap,'scrollTop',200)
    wrapper.vm.update();await wrapper.vm.$nextTick()
    expect(wrapper.get('.zt-scrollbar__thumb--vertical').attributes('style')).toContain('height: 20px')
    expect(wrapper.get('.zt-scrollbar__thumb--vertical').attributes('style')).toContain('translateY(40px)')
    expect(wrapper.find('.zt-scrollbar__bar--horizontal').exists()).toBe(false)
  })

  it('uses native bars when requested and inherits global size',()=>{
    const wrapper=mount(ZtConfigProvider,{props:{size:'large'},slots:{default:()=>h(ZtScrollbar,{native:true,height:80},()=> '内容')}})
    const scrollbar=wrapper.findComponent(ZtScrollbar)
    expect(scrollbar.classes()).toContain('zt-scrollbar--large')
    expect(scrollbar.find('.zt-scrollbar__bar').exists()).toBe(false)
    expect(scrollbar.get('.zt-scrollbar__wrap').classes()).toContain('is-native')
  })

  it('observes dimensions and disconnects on unmount',()=>{
    const disconnect=vi.fn(),observe=vi.fn()
    class Observer{constructor(_callback:ResizeObserverCallback){}observe=observe;disconnect=disconnect}
    vi.stubGlobal('ResizeObserver',Observer)
    const wrapper=mount(ZtScrollbar,{slots:{default:'内容'}})
    expect(observe).toHaveBeenCalledTimes(2)
    wrapper.unmount();expect(disconnect).toHaveBeenCalledOnce()
  })
})
