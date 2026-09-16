import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect } from 'vitest'
import ZtMenu from '../../../../src/components/menu/ZtMenu.vue'
const items=[{key:'/home',label:'首页'},{key:'business',label:'业务',children:[{key:'orders',label:'订单',route:{name:'orders',query:{tab:'pending'}}},{key:'/blocked',label:'拦截'},{key:'/error',label:'错误'}]}]
async function setup(){
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/home',component:{template:'<div/>'}},{path:'/orders',name:'orders',component:{template:'<div/>'}},{path:'/blocked',component:{template:'<div/>'}},{path:'/error',component:{template:'<div/>'}}]})
 router.beforeEach(to=>{if(to.path==='/blocked')return false;if(to.path==='/error')throw new Error('test navigation error')})
 router.onError(()=>{})
 await router.push('/home');await router.isReady()
 const w=mount(ZtMenu,{attachTo:document.body,global:{plugins:[router]},props:{items,router:true}})
 return {w,router}
}
describe('Menu Vue Router integration',()=>{
 it('uses key paths and route objects, and follows external navigation and history',async()=>{
  const {w,router}=await setup()
  expect(w.get('[data-menu-key="/home"]').attributes('aria-current')).toBe('page')
  await w.get('[data-menu-key=business]').trigger('click')
  expect(w.get('[data-menu-key=orders]').attributes('href')).toBe('/orders?tab=pending')
  await w.get('[data-menu-key=orders]').trigger('click');await flushPromises()
  expect(router.currentRoute.value.fullPath).toBe('/orders?tab=pending')
  expect(w.get('[data-menu-key=orders]').attributes('aria-current')).toBe('page')
  router.back();await flushPromises()
  expect(w.get('[data-menu-key="/home"]').attributes('aria-current')).toBe('page')
  await router.push('/orders?tab=pending');await flushPromises()
  expect(w.get('[data-menu-key=orders]').attributes('aria-current')).toBe('page')
  w.unmount()
 })
 it('keeps active route when guards abort or throw and preserves modifier links',async()=>{
  const {w,router}=await setup()
  await w.get('[data-menu-key=business]').trigger('click')
  await w.get('[data-menu-key="/blocked"]').trigger('click');await flushPromises()
  expect(router.currentRoute.value.path).toBe('/home')
  expect(w.get('[data-menu-key="/home"]').attributes('aria-current')).toBe('page')
  await w.get('[data-menu-key="/error"]').trigger('click');await flushPromises()
  expect(w.emitted('route-error')).toHaveLength(1)
  await w.get('[data-menu-key=orders]').trigger('click',{ctrlKey:true});await flushPromises()
  expect(router.currentRoute.value.path).toBe('/home')
  w.unmount()
 })
})
