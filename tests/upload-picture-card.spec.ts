import { mount, flushPromises } from '@vue/test-utils'
import { describe,it,expect } from 'vitest'
import { ZtUpload } from '../src'
import type { ZtUploadFile } from '../src'
const item:ZtUploadFile={uid:'image',name:'sample.svg',status:'success',url:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'}
describe('Upload picture cards',()=>{
 it('shows image cards, previews and restores the add tile after removal at the limit',async()=>{
  const w=mount(ZtUpload,{attachTo:document.body,props:{fileList:[item],listType:'picture-card',limit:1,size:'small'}})
  expect(w.classes()).toContain('is-picture-card');expect(w.classes()).toContain('zt-upload--small')
  expect(w.get('.zt-upload__card-media img').attributes('src')).toBe(item.url)
  expect(w.find('.zt-upload__add-card').exists()).toBe(false)
  await w.get('[aria-label="预览 sample.svg"]').trigger('click');await flushPromises()
  expect(document.querySelector('.zt-upload__preview')?.getAttribute('src')).toBe(item.url)
  await w.vm.remove(item);await flushPromises()
  expect(w.find('.zt-upload__file').exists()).toBe(false)
  expect(w.find('.zt-upload__add-card').exists()).toBe(true)
  w.unmount()
 })
 it('renders cancel/retry states and keeps disabled previews available',async()=>{
  const raw=new File(['a'],'sample.svg',{type:'image/svg+xml'})
  const w=mount(ZtUpload,{props:{listType:'picture-card',disabled:true,fileList:[{...item,raw,status:'fail',error:'failed'}]}})
  expect(w.get('.zt-upload__card-status').text()).toBe('上传失败')
  expect(w.get('[aria-label="重试 sample.svg"]').attributes('disabled')).toBeDefined()
  expect(w.get('[aria-label="移除 sample.svg"]').attributes('disabled')).toBeDefined()
  expect(w.get('[aria-label="预览 sample.svg"]').attributes('disabled')).toBeUndefined()
  await w.setProps({disabled:false,fileList:[{...item,status:'uploading',percentage:32}]})
  expect(w.get('[role=progressbar]').attributes('aria-valuenow')).toBe('32')
  expect(w.find('[aria-label="取消上传 sample.svg"]').exists()).toBe(true)
  w.unmount()
 })
 it('supports the trigger slot and hiding file lists for avatar upload',()=>{
  const w=mount(ZtUpload,{props:{fileList:[item],showFileList:false},slots:{trigger:'<button>替换头像</button>'}})
  expect(w.find('.zt-upload__list').exists()).toBe(false)
  expect(w.get('button').text()).toBe('替换头像');w.unmount()
 })
})
