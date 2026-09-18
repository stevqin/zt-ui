import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtTag, ZtBadge, ZtSwitch, ZtCheckbox, ZtPassword, ZtInputNumber, ZtSteps, ZtPagination, ZtConfigProvider, ZtButton, ZtInput, ZtForm, ZtFormItem, ZtRadio, ZtRadioGroup, ZtSelect, ZtDatePicker, ZtDateTimePicker, ZtModal, ZtDrawer, ZtIcon, ZtAlert } from '../src'
const wrappers:ReturnType<typeof mount>[]=[]
afterEach(()=>{wrappers.splice(0).forEach(w=>w.unmount());document.body.innerHTML=''})
function render(slots:()=>any, props:Record<string,unknown>={size:'large',theme:'dark',borderRadius:6}){const w=mount(ZtConfigProvider,{attachTo:document.body,props,slots:{default:slots}});wrappers.push(w);return w}
describe('ConfigProvider',()=>{
 it('reactively inherits global size while respecting explicit default',async()=>{
  const w=render(()=>[h(ZtButton,{},()=> '继承'),h(ZtButton,{size:'default'},()=> '覆盖'),h(ZtInput)])
  expect(w.findAll('button')[0]!.classes()).toContain('zt-button--large')
  expect(w.findAll('button')[1]!.classes()).not.toContain('zt-button--large')
  expect(w.find('.zt-input').classes()).toContain('zt-input--large')
  await w.setProps({size:'mini'})
  expect(w.findAll('button')[0]!.classes()).toContain('zt-button--mini')
 })
 it('does not apply provider size to Icon or Alert',()=>{
  const w=render(()=>[h(ZtIcon,{name:'check'}),h(ZtAlert,{title:'提示'})],{size:'large'})
  expect(w.find('.zt-icon-glyph').classes().some((name)=>/^zt-icon-glyph--(?:mini|small|default|medium|large)$/.test(name))).toBe(false)
  expect(w.find('.zt-icon-glyph').attributes('style')).toContain('--zt-icon-size: 1em')
  expect(w.find('.zt-alert').classes()).toEqual(['zt-alert','zt-alert--info'])
 })
 it('prioritizes component then form/group then provider',()=>{
  const w=render(()=>[h(ZtForm,{size:'small'},()=>h(ZtFormItem,{},()=>[h(ZtInput),h(ZtInput,{size:'mini'})])),h(ZtRadioGroup,{size:'small'},()=>[h(ZtRadio,{label:'a'}),h(ZtRadio,{label:'b',size:'mini'})])])
  expect(w.findAll('.zt-input')[0]!.classes()).toContain('zt-input--small')
  expect(w.findAll('.zt-input')[1]!.classes()).toContain('zt-input--mini')
  expect(w.findAll('.zt-radio')[0]!.classes()).toContain('zt-radio--small')
  expect(w.findAll('.zt-radio')[1]!.classes()).toContain('zt-radio--mini')
 })
 it.each([
  [ZtTag, {}, '.zt-tag--mini'], [ZtBadge, {value:1}, '.zt-badge--mini'],
  [ZtSwitch, {}, '.zt-switch--mini'], [ZtCheckbox, {}, '.zt-checkbox--mini'],
  [ZtPassword, {}, '.zt-input--mini'], [ZtInputNumber, {}, '.zt-input-number--mini'],
  [ZtSteps, {}, '.zt-steps--mini'], [ZtPagination, {total:100}, '.zt-pagination--mini'],
 ] as const)('applies global size consistently', (component,props,selector)=>{
  const w=render(()=>h(component as any,props),{size:'mini'})
  expect(w.find(selector).exists()).toBe(true)
 })
 it('isolates nested providers and accepts square corners',async()=>{
  const w=render(()=>h(ZtConfigProvider,{theme:'light',borderRadius:0},()=>h(ZtButton)))
  const nested=w.findAll('.zt-config-provider')[1]!
  expect(nested.attributes('data-zt-theme')).toBe('light')
  expect((nested.element as HTMLElement).style.getPropertyValue('--zt-radius')).toBe('0px')
  expect(w.find('button').classes()).toContain('zt-button--large')
  await w.setProps({borderRadius:-1});expect((w.element as HTMLElement).style.getPropertyValue('--zt-radius')).toBe('11px')
 })
 it('resets inherited Button depth at both boundaries and ignores invalid radii',async()=>{
  const w=render(()=>h(ZtConfigProvider,{borderRadius:16},()=>h(ZtButton)),{borderRadius:3})
  const image=()=> (w.element as HTMLElement).style.getPropertyValue('--zt-button-depth-image')
  const nested=w.findAll('.zt-config-provider')[1]!.element as HTMLElement
  expect(image()).toBe('none')
  expect(nested.style.getPropertyValue('--zt-button-depth-image')).toContain('linear-gradient')
  await w.setProps({borderRadius:8});expect(image()).toBe('none')
  await w.setProps({borderRadius:9});expect(image()).toContain('linear-gradient')
  for(const borderRadius of [-1,NaN,Infinity]) {
   await w.setProps({borderRadius})
   expect((w.element as HTMLElement).style.getPropertyValue('--zt-radius')).toBe('11px')
   expect(image()).toContain('linear-gradient')
  }
 })
 it.each([ZtSelect,ZtDatePicker,ZtDateTimePicker])('carries reactive configuration to a teleported popup',async component=>{
  const w=render(()=>h(component))
  await w.find('input').trigger('click');await nextTick()
  const popup=document.querySelector<HTMLElement>('.zt-select__dropdown,.zt-date-picker__panel')!
  expect(popup.style.getPropertyValue('--zt-radius')).toBe('6px')
  expect(popup.style.colorScheme).toBe('dark')
  await w.setProps({theme:'light',borderRadius:0})
  expect(popup.style.colorScheme).toBe('light')
  expect(popup.style.getPropertyValue('--zt-radius')).toBe('0px')
 })
 it.each([ZtModal,ZtDrawer])('carries provider configuration into overlays',async component=>{
  render(()=>h(component,{modelValue:true,title:'测试'},()=>h(ZtButton)))
  await nextTick()
  const overlay=document.querySelector<HTMLElement>('.zt-modal,.zt-drawer-surface')!
  expect(overlay.style.colorScheme).toBe('dark')
  expect(overlay.querySelector('button.zt-button--large')).not.toBeNull()
 })
 it('scopes explicit Modal size to implicit children while preserving child overrides',()=>{
  const w=render(()=>h(ZtModal,{modelValue:true,size:'small'},()=>[h(ZtInput),h(ZtInput,{size:'large'})]))
  expect(document.querySelector('.zt-modal')?.classList).toContain('zt-modal--small')
  const inputs=document.querySelectorAll('.zt-input')
  expect(inputs[0]?.classList).toContain('zt-input--small')
  expect(inputs[1]?.classList).toContain('zt-input--large')
 })
})
