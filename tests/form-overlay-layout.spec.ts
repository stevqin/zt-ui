import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { expect, it, vi } from 'vitest'
import { ZtForm, ZtFormItem, ZtInput } from '../src'

it('keeps error tooltips outside filtered high-z-index dialogs', async () => {
  const dialog = document.createElement('div')
  dialog.style.cssText = 'position:fixed;z-index:6000;filter:blur(0px)'
  document.body.append(dialog)
  const wrapper = mount(ZtForm, {attachTo:dialog, props:{model:{name:''}}, slots:{default:()=>h(ZtFormItem,{prop:'name',label:'名称',error:'名称必填'},()=>h(ZtInput))}})
  await nextTick(); await nextTick()
  const indicator = wrapper.get('.zt-form-item__error-indicator')
  const tooltip = document.getElementById(indicator.attributes('aria-describedby'))!
  expect(tooltip.parentElement).toBe(document.body)
  expect(Number(tooltip.style.zIndex)).toBeGreaterThan(6000)
  expect(wrapper.find('.zt-form-item__error').exists()).toBe(false)
  wrapper.unmount();dialog.remove()
})

it('allows one field to override form label alignment', async () => {
  const wrapper = mount(ZtForm, {props:{labelPosition:'right',labelWidth:120},slots:{default:()=>[
    h(ZtFormItem,{label:'名称',prop:'name'}),
    h(ZtFormItem,{label:'备注',prop:'note',labelPosition:'left'}),
    h(ZtFormItem,{label:'说明',prop:'description',labelPosition:'top'}),
  ]}})
  const labels=wrapper.findAll('.zt-form-item__label')
  expect(labels[0].attributes('style')).toContain('width: 120px')
  expect(labels[1].attributes('style')).toContain('text-align: left')
  expect(labels[2].attributes('style')).not.toContain('width: 120px')
  wrapper.unmount()
})


it('aligns auto-width labels and releases the width when a longer field is removed', async () => {
  const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return {width:this.classList.contains('zt-form-item__label-text') ? this.textContent!.length * 10 : 0,height:26,x:0,y:0,top:0,left:0,bottom:26,right:0,toJSON:()=>({})} as DOMRect
  })
  const expanded=ref(true)
  const wrapper=mount({render:()=>h(ZtForm,{model:{},labelWidth:'auto'},()=>[
    h(ZtFormItem,{label:'名称'}), expanded.value ? h(ZtFormItem,{label:'权限参考人'}) : null,
  ])})
  try {
    await nextTick();await nextTick()
    expect(wrapper.findAll('.zt-form-item__label').map(label=>(label.element as HTMLElement).style.width)).toEqual(['50px','50px'])
    expanded.value=false;await nextTick();await nextTick()
    expect((wrapper.get('.zt-form-item__label').element as HTMLElement).style.width).toBe('20px')
  } finally {wrapper.unmount();rect.mockRestore()}
})
