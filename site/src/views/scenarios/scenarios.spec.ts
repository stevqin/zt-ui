import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { ZtInput, ZtSelect, ZtInputNumber } from '@ztechjs/zt-ui'
import FormEntry from './FormEntry.vue'
import QueryFilter from './QueryFilter.vue'
import DataList from './DataList.vue'
import OverlayEdit from './OverlayEdit.vue'
import StatusFlow from './StatusFlow.vue'
const wrappers:ReturnType<typeof mount>[]=[]
function render(component:any){const w=mount(component,{attachTo:document.body});wrappers.push(w);return w}
afterEach(()=>{wrappers.splice(0).forEach(w=>w.unmount());document.body.innerHTML=''})
const settle=async()=>{for(let i=0;i<12;i++)await nextTick()}
describe('scenario interactions',()=>{
 it('validates a form before reporting a successful local submission',async()=>{
  const w=render(FormEntry)
  await w.findAll('button').find(b=>b.text()==='提交申请')!.trigger('click');await settle()
  expect(w.text()).toContain('请检查标记的字段')
  w.findComponent(ZtInput).vm.$emit('update:modelValue','设备申请');w.findComponent(ZtSelect).vm.$emit('update:modelValue','it');w.findComponent(ZtInputNumber).vm.$emit('update:modelValue',2)
  await nextTick();await w.findAll('button').find(b=>b.text()==='提交申请')!.trigger('click');await settle()
  expect(w.text()).toContain('已提交：设备申请，数量 2')
 })
 it('submits and resets filter state',async()=>{const w=render(QueryFilter);await w.find('input').setValue('衬衫');await w.findAll('button').find(b=>b.text()==='查询')!.trigger('click');expect(w.get('[role=status]').text()).toContain('衬衫');await w.findAll('button').find(b=>b.text()==='重置')!.trigger('click');expect(w.get('[role=status]').text()).toContain('已重置');expect((w.find('input').element as HTMLInputElement).value).toBe('')})
 it('filters before pagination and displays an empty result',async()=>{const w=render(DataList);expect(w.findAll('tbody tr')).toHaveLength(5);await w.get('input').setValue('不存在');expect(w.text()).toContain('没有匹配的商品');await w.get('input').setValue('SP023');expect(w.findAll('tbody tr')).toHaveLength(1);expect(w.text()).toContain('SP023')})
 it('does not change saved data when an edit is cancelled',async()=>{const w=render(OverlayEdit);await w.find('button').trigger('click');await settle();const input=document.querySelector<HTMLInputElement>('.zt-drawer input')!;input.value='未保存修改';input.dispatchEvent(new Event('input',{bubbles:true}));await nextTick();const cancel=[...document.querySelectorAll<HTMLButtonElement>('.zt-drawer button')].find(b=>b.textContent==='取消')!;cancel.click();await settle();expect(w.get('h3').text()).toBe('杭州湖滨店')})
 it('completes and resets a flow',async()=>{const w=render(StatusFlow);for(let i=0;i<3;i++)await w.findAll('button')[0]!.trigger('click');expect(w.text()).toContain('流程已完成');expect(w.findAll('button')[0]!.attributes('disabled')).toBeDefined();await w.findAll('button')[1]!.trigger('click');expect(w.text()).toContain('当前阶段：填写申请')})
})
