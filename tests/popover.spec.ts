import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ZtPopover } from '../src'
import { placePopover } from '../src/components/popover/position'

afterEach(()=>{document.body.innerHTML='';vi.useRealTimers()})

describe('popover positioning',()=>{
 it('flips bottom to top and preserves end alignment',()=>{
  expect(placePopover(
   {top:170,bottom:190,left:260,right:290,width:30,height:20},
   {width:120,height:80},{width:300,height:220,padding:8},'bottom-end',8,
  )).toMatchObject({placement:'top-end',top:82,left:170})
 })
 it('clamps a popup inside the viewport',()=>{
  expect(placePopover({top:4,bottom:24,left:0,right:20,width:20,height:20},{width:100,height:50},{width:120,height:100,padding:8},'top-start',6)).toMatchObject({placement:'bottom-start',top:30,left:8})
 })
})

describe('Popover',()=>{
 it('opens by click, closes on Escape and restores trigger focus',async()=>{
  const wrapper=mount(ZtPopover,{attachTo:document.body,props:{trigger:'click'},slots:{default:'<button>打开</button>',content:'<button>内容按钮</button>'}})
  const trigger=wrapper.get('button');trigger.element.focus();await trigger.trigger('click');await nextTick()
  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await nextTick()
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();expect(document.activeElement).toBe(trigger.element)
 })
 it('closes click popovers outside but keeps manual popovers controlled',async()=>{
  const click=mount(ZtPopover,{attachTo:document.body,slots:{default:'<button>触发</button>',content:'内容'}})
  await click.get('button').trigger('click');document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));await nextTick()
  expect(document.body.querySelector('.zt-popover')).toBeNull();click.unmount()
  const manual=mount(ZtPopover,{attachTo:document.body,props:{trigger:'manual',visible:true},slots:{default:'<button>手动</button>',content:'受控内容'}})
  document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));await nextTick()
  expect(document.body.querySelector('.zt-popover')?.textContent).toContain('受控内容');manual.unmount()
 })
 it('honors hover delays across trigger and popup',async()=>{
  vi.useFakeTimers()
  const wrapper=mount(ZtPopover,{attachTo:document.body,props:{trigger:'hover',openDelay:30,closeDelay:40},slots:{default:'<button>悬停</button>',content:'提示内容'}})
  await wrapper.get('.zt-popover__reference').trigger('pointerenter');vi.advanceTimersByTime(29);await nextTick();expect(document.body.querySelector('.zt-popover')).toBeNull()
  vi.advanceTimersByTime(1);await nextTick();expect(document.body.querySelector('.zt-popover')).not.toBeNull()
  await wrapper.get('.zt-popover__reference').trigger('pointerleave');document.body.querySelector('.zt-popover')?.dispatchEvent(new PointerEvent('pointerenter',{bubbles:true}));vi.advanceTimersByTime(50);await nextTick()
  expect(document.body.querySelector('.zt-popover')).not.toBeNull()
 })
})

it.each([
 ['top', {top:12,bottom:32,left:180,right:220,width:40,height:20}, 'bottom', 40, 150, 50, 10],
 ['bottom', {top:268,bottom:288,left:180,right:220,width:40,height:20}, 'top', 200, 150, 50, 50],
 ['left', {top:140,bottom:160,left:12,right:52,width:40,height:20}, 'right', 120, 60, 10, 30],
 ['right', {top:140,bottom:160,left:348,right:388,width:40,height:20}, 'left', 120, 240, 90, 30],
] as const)('flips %s and aligns the arrow after measured dimensions change', (requested, trigger, placement, top, left, arrowX, arrowY) => {
 expect(placePopover(trigger,{width:100,height:60},{width:400,height:300,padding:8},requested,8)).toMatchObject({placement,top,left,arrowX,arrowY})
})
it('points the arrow at the trigger after horizontal viewport clamping', () => {
 expect(placePopover({top:140,bottom:160,left:10,right:30,width:20,height:20},{width:240,height:60},{width:400,height:300,padding:8},'top',8)).toMatchObject({top:72,left:8,arrowX:12})
})
it.each([[88, '88px'], ['9rem', '9rem']] as const)('supports low-level Popover height %s', async (height, expected) => {
 const wrapper = mount(ZtPopover, {attachTo:document.body, props:{visible:true,height},slots:{content:'内容'}})
 try { await nextTick(); expect(document.querySelector<HTMLElement>('.zt-popover')!.style.height).toBe(expected) }
 finally {wrapper.unmount()}
})
