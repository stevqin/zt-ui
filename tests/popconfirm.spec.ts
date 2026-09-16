import { mount,flushPromises } from '@vue/test-utils'
import { afterEach,describe,expect,it } from 'vitest'
import { nextTick } from 'vue'
import { ZtPopconfirm } from '../src'
afterEach(()=>{document.body.innerHTML=''})
describe('Popconfirm',()=>{
 it('waits for async confirmation and closes after success',async()=>{
  let finish!:()=>void
  const wrapper=mount(ZtPopconfirm,{attachTo:document.body,props:{title:'删除记录？',beforeConfirm:()=>new Promise<void>(resolve=>finish=resolve)},slots:{default:'<button>删除</button>'}})
  await wrapper.get('button').trigger('click');await nextTick()
  const confirm=[...document.body.querySelectorAll<HTMLButtonElement>('.zt-popconfirm button')].find(button=>button.textContent?.includes('确定'))!
  confirm.click();await nextTick();expect(confirm.disabled).toBe(true)
  finish();await flushPromises();expect(wrapper.emitted('confirm')).toHaveLength(1);expect(document.body.querySelector('.zt-popconfirm')).toBeNull()
 })
 it('keeps open on false or rejection and reports rejection',async()=>{
  const error=new Error('不能删除')
  const wrapper=mount(ZtPopconfirm,{attachTo:document.body,props:{title:'继续？',beforeConfirm:()=>Promise.reject(error)},slots:{default:'<button>操作</button>'}})
  await wrapper.get('button').trigger('click');await nextTick();const confirm=[...document.body.querySelectorAll<HTMLButtonElement>('.zt-popconfirm button')].find(button=>button.textContent?.includes('确定'))!;confirm.click();await flushPromises()
  expect(document.body.querySelector('.zt-popconfirm')).not.toBeNull();expect(wrapper.emitted('confirm-error')?.[0]).toEqual([error]);expect(confirm.disabled).toBe(false)
 })
 it('emits cancel and closes from the cancel button',async()=>{
  const wrapper=mount(ZtPopconfirm,{attachTo:document.body,props:{title:'继续？'},slots:{default:'<button>操作</button>'}})
  await wrapper.get('button').trigger('click');await nextTick();const cancel=[...document.body.querySelectorAll<HTMLButtonElement>('.zt-popconfirm button')].find(button=>button.textContent==='取消')!;cancel.click();await nextTick()
  expect(wrapper.emitted('cancel')).toHaveLength(1);expect(document.body.querySelector('.zt-popconfirm')).toBeNull()
 })
})
