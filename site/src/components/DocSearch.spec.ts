import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, expect, it } from 'vitest'
import DocSearch from './DocSearch.vue'
import Api from '../views/Api.vue'
const wrappers:ReturnType<typeof mount>[]=[]
afterEach(()=>{wrappers.splice(0).forEach(w=>w.unmount());document.body.innerHTML=''})
it('searches by keyboard and reveals an API row hidden by the current filter',async()=>{
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/api/:component',component:Api}]})
 await router.push('/api/date-picker');await router.isReady()
 const w=mount({components:{DocSearch},template:'<DocSearch/><router-view/>'},{attachTo:document.body,global:{plugins:[router]}});wrappers.push(w);await flushPromises()
 await w.get('.api-filter input').setValue('size')
 expect(w.find('#ztdatepicker-props-holidays').exists()).toBe(false)
 const search=w.get('[aria-label="搜索文档"]');await search.setValue('holidays')
 expect(w.findAll('[role=option]').length).toBeGreaterThan(0)
 await search.trigger('keydown',{key:'Enter'});await flushPromises()
 expect(router.currentRoute.value.hash).toBe('#ztdatepicker-props-holidays')
 expect(w.find('#ztdatepicker-props-holidays').exists()).toBe(true)
 expect(w.find('[role=listbox]').exists()).toBe(false)
})
