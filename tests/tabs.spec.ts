import { mount,flushPromises } from '@vue/test-utils'
import { defineComponent,h,nextTick,ref } from 'vue'
import { describe,expect,it,vi } from 'vitest'
import { ZtTabPane,ZtTabs } from '../src'

function host(beforeLeave?:(next:string|number,previous:string|number)=>boolean|Promise<boolean>){
 const active=ref<string|number>('a')
 return mount(defineComponent({setup:()=>()=>h(ZtTabs,{modelValue:active.value,beforeLeave,'onUpdate:modelValue':value=>active.value=value},()=>[
  h(ZtTabPane,{name:'a',label:'甲'},()=> '甲内容'),h(ZtTabPane,{name:'b',label:'乙',disabled:true},()=> '乙内容'),h(ZtTabPane,{name:'c',label:'丙',closable:true},()=> '丙内容'),
 ])}),{attachTo:document.body})
}
describe('Tabs',()=>{
 it('links tabs to panels and skips disabled tabs with arrows',async()=>{
  const wrapper=host();await nextTick();const tabs=wrapper.findAll('[role="tab"]')
  expect(tabs[0].attributes('aria-controls')).toBe(wrapper.get('[role="tabpanel"]').attributes('id'))
  await tabs[0].trigger('keydown',{key:'ArrowRight'});expect(document.activeElement).toBe(tabs[2].element)
  await tabs[2].trigger('keydown',{key:'Enter'});expect(tabs[2].attributes('aria-selected')).toBe('true');expect(wrapper.findAll('[role="tabpanel"]').find(panel=>panel.isVisible())?.text()).toBe('丙内容')
  wrapper.unmount()
 })
 it('waits for beforeLeave and ignores rejected switches',async()=>{
  let finish!:(value:boolean)=>void;const guard=vi.fn(()=>new Promise<boolean>(resolve=>finish=resolve)),wrapper=host(guard);await nextTick()
  await wrapper.findAll('[role="tab"]')[2].trigger('click');expect(wrapper.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('true')
  finish(false);await flushPromises();expect(wrapper.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('true');expect(guard).toHaveBeenCalledWith('c','a');wrapper.unmount()
 })
 it('emits remove without selecting and supports lazy panes',async()=>{
  const wrapper=mount(ZtTabs,{props:{modelValue:'a',closable:true},slots:{default:()=>[h(ZtTabPane,{name:'a',label:'甲'},()=> '甲'),h(ZtTabPane,{name:'b',label:'乙',lazy:true},()=> '懒内容')]}});await nextTick()
  expect(wrapper.text()).not.toContain('懒内容');await wrapper.findAll('[role="tab"]')[1].trigger('click');expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);const clicks=wrapper.emitted('tab-click')?.length
  await wrapper.findAll('button[aria-label^="关闭"]')[0].trigger('click');expect(wrapper.emitted('tab-remove')?.[0]).toEqual(['a']);expect(wrapper.emitted('tab-click')?.length).toBe(clicks)
 })
})

// The island variant must retain the same public interaction contract.
it('island tabs preserve guards, disabled navigation and close without selecting', async () => {
 const wrapper=mount(ZtTabs,{props:{modelValue:'a',type:'island',size:'mini',status:'success',beforeLeave:()=>false},slots:{default:()=>[
  h(ZtTabPane,{name:'a',label:'甲'}),h(ZtTabPane,{name:'b',label:'乙',closable:true}),h(ZtTabPane,{name:'c',label:'停用',disabled:true}),
 ]}})
 await nextTick()
 await wrapper.findAll('[role="tab"]')[1].trigger('click');await flushPromises()
 expect(wrapper.emitted('update:modelValue')).toBeUndefined()
 await wrapper.get('button[aria-label="关闭 乙"]').trigger('click')
 expect(wrapper.emitted('tab-remove')?.[0]).toEqual(['b'])
 await wrapper.findAll('[role="tab"]')[2].trigger('click')
 expect(wrapper.emitted('tab-click')).toEqual([['b']])
 wrapper.unmount()
})
