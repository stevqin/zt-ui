import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ZtSlider, ZtProgress, ZtConfigProvider, ZtForm, ZtFormItem } from '../src'
import { snapSliderValue } from '../src/components/slider/slider'

describe('Slider', () => {
 it('snaps decimal steps relative to min and keeps max reachable', () => {
  expect(snapSliderValue(.35,.1,1,.1)).toBe(.4)
  expect(snapSliderValue(.39,.1,1,.1)).toBe(.4)
  expect(snapSliderValue(10,0,10,3)).toBe(10)
  expect(snapSliderValue(-100,0,10,1)).toBe(0)
  expect(snapSliderValue(NaN,0,10,1)).toBe(0)
 })
 it('supports arrow keys, Home, End and page steps with single commit', async () => {
  const w=mount(ZtSlider,{props:{modelValue:10,step:2}})
  const thumb=w.get('[role=slider]')
  await thumb.trigger('keydown',{key:'ArrowRight'})
  expect(w.emitted('update:modelValue')).toEqual([[12]])
  expect(w.emitted('change')).toEqual([[12]])
  await thumb.trigger('keydown',{key:'PageUp'})
  expect(thumb.attributes('aria-valuenow')).toBe('32')
  await thumb.trigger('keydown',{key:'End'})
  expect(thumb.attributes('aria-valuenow')).toBe('100')
  await thumb.trigger('keydown',{key:'Home'})
  expect(thumb.attributes('aria-valuenow')).toBe('0')
 })
 it('normalizes range values, prevents crossing, and updates accessible bounds',async()=>{
  const w=mount(ZtSlider,{props:{modelValue:[80,20],range:true}})
  const [start,end]=w.findAll('[role=slider]')
  expect(start!.attributes('aria-valuenow')).toBe('20')
  await start!.trigger('keydown',{key:'End'})
  expect(w.emitted('change')).toEqual([[[80,80]]])
  expect(end!.attributes('aria-valuemin')).toBe('80')
  await end!.trigger('keydown',{key:'Home'})
  expect(w.emitted('change')).toHaveLength(1)
 })
 it.each([{disabled:true},{min:10,max:10},{min:20,max:10}])('prevents invalid or disabled interaction %j',async(props)=>{
  const w=mount(ZtSlider,{props})
  await w.get('[role=slider]').trigger('keydown',{key:'ArrowRight'})
  expect(w.get('[role=slider]').attributes('disabled')).toBeDefined()
  expect(w.emitted('change')).toBeUndefined()
 })
 it('updates visual and accessible value when model and bounds change',async()=>{
  const w=mount(ZtSlider,{props:{modelValue:40}})
  await w.setProps({modelValue:200,max:60,formatTooltip:value=>`${value} 元`})
  expect(w.get('[role=slider]').attributes('aria-valuenow')).toBe('60')
  expect(w.get('[role=slider]').attributes('aria-valuetext')).toBe('60 元')
  expect(w.emitted('change')).toBeUndefined()
 })
 it('updates continuously during pointer drag but commits once on release',async()=>{
  const w=mount(ZtSlider,{props:{modelValue:0}})
  const track=w.get('.zt-slider__track')
  vi.spyOn(track.element,'getBoundingClientRect').mockReturnValue({left:0,width:100} as DOMRect)
  await track.trigger('pointerdown',{button:0,pointerId:1,clientX:20})
  await track.trigger('pointermove',{pointerId:1,clientX:45})
  expect(w.emitted('input')).toEqual([[20],[45]])
  expect(w.emitted('change')).toBeUndefined()
  await track.trigger('pointerup',{pointerId:1,clientX:45})
  await track.trigger('lostpointercapture',{pointerId:1})
  expect(w.emitted('change')).toEqual([[45]])
 })
 it('can reopen a collapsed range by clicking either side',async()=>{
  const w=mount(ZtSlider,{props:{modelValue:[80,80],range:true}})
  const track=w.get('.zt-slider__track')
  vi.spyOn(track.element,'getBoundingClientRect').mockReturnValue({left:0,width:100} as DOMRect)
  await track.trigger('pointerdown',{button:0,pointerId:1,clientX:20})
  await track.trigger('pointerup',{pointerId:1})
  expect(w.emitted('change')).toEqual([[[20,80]]])
 })
 it('inherits provider and form configuration',()=>{
  const w=mount(ZtConfigProvider,{props:{size:'large',theme:'dark'},slots:{default:()=>h(ZtForm,{model:{},size:'small',disabled:true},()=>h(ZtFormItem,{label:'音量'},()=>h(ZtSlider)))}})
  expect(w.get('.zt-slider').classes()).toContain('zt-slider--small')
  expect(w.get('[role=slider]').attributes('disabled')).toBeDefined()
 })
})
describe('Progress',()=>{
 it.each([[-10,'0'],[150,'100'],[NaN,'0'],[Infinity,'0'],[35.5,'35.5']])('clamps %s to %s', (percentage,expected)=>{
  const w=mount(ZtProgress,{props:{percentage}})
  expect(w.attributes('aria-valuenow')).toBe(expected)
  expect(w.text()).toBe(`${expected}%`)
 })
 it('does not report a fake percentage for indeterminate tasks',()=>{
  const w=mount(ZtProgress,{props:{indeterminate:true,percentage:50}})
  expect(w.attributes('aria-valuenow')).toBeUndefined()
  expect(w.text()).toBe('处理中')
 })
 it('supports formatting, status and inherited size',()=>{
  const w=mount(ZtConfigProvider,{props:{size:'large'},slots:{default:()=>h(ZtProgress,{percentage:70,status:'warning',format:n=>`完成 ${n}%`})}})
  expect(w.get('.zt-progress').classes()).toContain('zt-progress--large')
  expect(w.get('.zt-progress').classes()).toContain('zt-progress--status-warning')
  expect(w.get('.zt-progress').attributes('aria-valuetext')).toBe('完成 70%')
 })
})
