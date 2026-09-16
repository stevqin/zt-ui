import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { ZtInputOtp, ZtConfigProvider, ZtForm, ZtFormItem } from '../src'
function setup(props={}){
 const value=ref('')
 const host=mount(defineComponent({setup:()=>()=>h(ZtInputOtp,{...props,modelValue:value.value,'onUpdate:modelValue':(v:string)=>value.value=v})}),{attachTo:document.body})
 return {host,w:host.findComponent(ZtInputOtp),value}
}
async function type(w:ReturnType<typeof mount>,value:string){const el=w.get('input').element as HTMLInputElement;el.value=value;el.setSelectionRange(value.length,value.length);await w.get('input').trigger('input');await flushPromises()}
async function paste(w:ReturnType<typeof mount>,text:string){await w.get('input').trigger('paste',{clipboardData:{getData:()=>text}});await flushPromises()}
describe('InputOtp',()=>{
 it('keeps leading zeros, normalizes pasted digits and emits completion once per edit',async()=>{
  const {host,w,value}=setup()
  await paste(w,'０1 2-34567')
  expect(value.value).toBe('012345')
  expect(w.emitted('complete')).toEqual([['012345']])
  expect(w.findAll('.is-filled')).toHaveLength(6)
  await paste(w,'012345')
  expect(w.emitted('complete')).toHaveLength(1)
  expect(w.get('input').attributes('autocomplete')).toBe('one-time-code')
  expect(w.findAll('input')).toHaveLength(1)
  host.unmount()
 })
 it('advances, edits a selected cell and handles arrows, deletion and select-all paste',async()=>{
  const {host,w,value}=setup()
  await type(w,'1');expect(w.findAll('.zt-input-otp__cell')[1]!.classes()).toContain('is-active')
  await paste(w,'234');expect(value.value).toBe('1234')
  w.vm.focus(1);await paste(w,'9');expect(value.value).toBe('1934')
  await w.get('input').trigger('keydown',{key:'Backspace'});await flushPromises()
  expect(value.value).toBe('194')
  await w.get('input').trigger('keydown',{key:'Home'});expect((w.get('input').element as HTMLInputElement).selectionStart).toBe(0)
  ;(w.get('input').element as HTMLInputElement).select()
  await paste(w,'56');expect(value.value).toBe('56')
  await w.get('input').trigger('keydown',{key:'End'});await w.get('input').trigger('keydown',{key:'ArrowLeft'})
  expect((w.get('input').element as HTMLInputElement).selectionStart).toBe(1)
  host.unmount()
 })
 it('supports masked character codes and controlled reset/length changes',async()=>{
  const w=mount(ZtInputOtp,{props:{integerOnly:false,length:4,mask:true,separator:'-'}})
  await paste(w,'A b9X')
  expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['Ab9X'])
  expect(w.findAll('.zt-input-otp__cell').map(cell=>cell.text())).toEqual(['•','•','•','•'])
  expect(w.get('.zt-input-otp__separator').text()).toBe('-')
  await w.setProps({modelValue:'AB',length:2})
  expect(w.findAll('.zt-input-otp__cell')).toHaveLength(2)
  await w.setProps({modelValue:null});expect(w.get('input').element.value).toBe('')
  w.unmount()
 })
 it.each([{disabled:true},{readonly:true}])('prevents edits when %o',async props=>{
  const w=mount(ZtInputOtp,{props:{...props,modelValue:'123456'}})
  await paste(w,'654321');w.vm.clear();if('disabled' in props)expect(w.get('input').attributes('disabled')).toBeDefined();else await type(w,'9')
  expect(w.emitted('update:modelValue')).toBeUndefined()
  expect(w.get('input').element.value).toBe('123456')
  w.unmount()
 })
 it('defers composition, clears via the public method and inherits global size',async()=>{
  const w=mount(ZtConfigProvider,{props:{size:'mini'},slots:{default:()=>h(ZtInputOtp,{integerOnly:false})}})
  const otp=w.findComponent(ZtInputOtp)
  expect(otp.classes()).toContain('zt-input-otp--mini')
  await otp.get('input').trigger('compositionstart');await type(otp,'A')
  expect(otp.emitted('input')).toBeUndefined()
  await otp.get('input').trigger('compositionend');await flushPromises()
  expect(otp.emitted('input')).toEqual([['A']])
  otp.vm.clear();await flushPromises();expect(otp.emitted('clear')).toHaveLength(1)
  expect(otp.get('input').element.value).toBe('')
  w.unmount()
 })
 it('inherits form settings and associates validation errors with the native input',async()=>{
  const model=ref({code:''})
  const w=mount(defineComponent({setup:()=>()=>h(ZtForm,{model:model.value,size:'small'},()=>h(ZtFormItem,{prop:'code',label:'验证码',rules:[{required:true,message:'请输入验证码',trigger:'blur'}]},()=>h(ZtInputOtp,{modelValue:model.value.code,'onUpdate:modelValue':(v:string)=>model.value.code=v})))}))
  const otp=w.findComponent(ZtInputOtp)
  expect(otp.classes()).toContain('zt-input-otp--small')
  expect(w.get('label').attributes('for')).toBe(otp.get('input').attributes('id'))
  await otp.get('input').trigger('blur');await flushPromises()
  expect(otp.get('input').attributes('aria-invalid')).toBe('true')
  expect(otp.get('input').attributes('aria-describedby')).toContain('-error')
  await paste(otp,'123456');await flushPromises()
  expect(model.value.code).toBe('123456')
  w.unmount()
 })
})
