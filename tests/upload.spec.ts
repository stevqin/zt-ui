import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { ZtUpload, ZtConfigProvider, ZtForm, ZtFormItem } from '../src'
import type { ZtUploadFile, ZtUploadRequestContext, ZtUploadRequestOptions } from '../src'
const text=(name='a.txt')=>new File(['hello'],name,{type:'text/plain'})
async function choose(w:ReturnType<typeof mount>,files:File[]){Object.defineProperty(w.get('input').element,'files',{value:files,configurable:true});await w.get('input').trigger('change');await flushPromises()}
function controlled(extra={}){const list=ref<ZtUploadFile[]>([]);const host=mount(defineComponent({setup:()=>()=>h(ZtUpload,{...extra,fileList:list.value,'onUpdate:fileList':(value:ZtUploadFile[])=>list.value=value})}));return {host,w:host.findComponent(ZtUpload),list}}
describe('Upload',()=>{
 it('selects without an endpoint and accepts the same file again after removal',async()=>{
  const {host,w,list}=controlled()
  await choose(w,[text()]);expect(list.value[0]?.status).toBe('ready')
  expect(w.get('input').element.value).toBe('')
  await w.vm.remove(list.value[0]!);await flushPromises();expect(list.value).toHaveLength(0)
  await choose(w,[text()]);expect(list.value).toHaveLength(1);host.unmount()
 })
 it('uploads automatically, reports progress and only settles once',async()=>{
  let request!:ZtUploadRequestOptions
  const {host,w,list}=controlled({httpRequest:(options:ZtUploadRequestOptions)=>{request=options}})
  await choose(w,[text()]);expect(list.value[0]?.status).toBe('uploading')
  request.onProgress(45);await flushPromises();expect(list.value[0]?.percentage).toBe(45)
  request.onSuccess({id:1});request.onError(new Error('late'));await flushPromises()
  expect(list.value[0]?.status).toBe('success');expect(list.value[0]?.percentage).toBe(100)
  expect(w.emitted('success')).toHaveLength(1);expect(w.emitted('error')).toBeUndefined();host.unmount()
 })
 it('passes multipart data to a direct request method and tracks its promise',async()=>{
  let body!:FormData,context!:ZtUploadRequestContext,resolveRequest!:(value:unknown)=>void
  const request=(nextBody:FormData,nextContext:ZtUploadRequestContext)=>{body=nextBody;context=nextContext;return new Promise<unknown>(resolve=>resolveRequest=resolve)}
  const {host,w,list}=controlled({request,name:'attachment',data:{folder:'documents',private:true}})
  await choose(w,[text('contract.txt')])
  expect(list.value[0]?.status).toBe('uploading')
  expect(body.get('folder')).toBe('documents');expect(body.get('private')).toBe('true')
  expect((body.get('attachment') as File).name).toBe('contract.txt')
  expect(context.file.name).toBe('contract.txt')
  context.onProgress(36);await flushPromises();expect(list.value[0]?.percentage).toBe(36)
  const response={data:{id:7}};resolveRequest(response);await flushPromises()
  expect(list.value[0]?.status).toBe('success');expect(list.value[0]?.response).toStrictEqual(response);host.unmount()
 })
 it('turns a rejected direct request into an upload failure',async()=>{
  const failure=new Error('登录已过期')
  const {host,w,list}=controlled({request:()=>Promise.reject(failure)})
  await choose(w,[text()])
  expect(list.value[0]?.status).toBe('fail');expect(list.value[0]?.error).toBe('登录已过期')
  expect(w.emitted('error')?.[0]?.[0]).toBe(failure);host.unmount()
 })
 it('passes cancellation to a direct request and keeps httpRequest precedence',async()=>{
  let signal!:AbortSignal
  const direct=vi.fn((_body:FormData,context:ZtUploadRequestContext)=>{signal=context.signal;return new Promise(()=>{})})
  const active=controlled({request:direct})
  await choose(active.w,[text()]);active.w.vm.abort(active.list.value[0]!);await flushPromises()
  expect(signal.aborted).toBe(true);expect(active.list.value[0]?.status).toBe('ready');active.host.unmount()
  const request=vi.fn(),httpRequest=vi.fn((options:ZtUploadRequestOptions)=>options.onSuccess('custom'))
  const preferred=controlled({request,httpRequest})
  await choose(preferred.w,[text()]);expect(httpRequest).toHaveBeenCalledOnce();expect(request).not.toHaveBeenCalled()
  expect(preferred.list.value[0]?.status).toBe('success');preferred.host.unmount()
 })
 it('supports manual submit, failed retry, cancellation and ignores stale callbacks',async()=>{
  const requests:ZtUploadRequestOptions[]=[]
  const {host,w,list}=controlled({autoUpload:false,httpRequest:(options:ZtUploadRequestOptions)=>{requests.push(options)}})
  await choose(w,[text()]);expect(requests).toHaveLength(0)
  const submitted=w.vm.submit();await flushPromises();requests[0]!.onError(new Error('断网'));await submitted;await flushPromises()
  expect(list.value[0]?.status).toBe('fail')
  const retried=w.vm.retry(list.value[0]!);await flushPromises();w.vm.abort(list.value[0]!);await retried;await flushPromises()
  expect(requests[1]!.signal.aborted).toBe(true);expect(list.value[0]?.status).toBe('ready')
  requests[1]!.onSuccess('late');await flushPromises();expect(list.value[0]?.status).toBe('ready')
  const next=w.vm.submit();await flushPromises();requests[2]!.onSuccess('ok');await next;await flushPromises()
  expect(list.value[0]?.status).toBe('success');host.unmount()
 })
 it('validates accept, size and limits for selection and drops',async()=>{
  const {host,w,list}=controlled({drag:true,multiple:true,accept:'.txt',limit:2,maxSize:0.00001})
  await choose(w,[text('a.png')]);expect(w.emitted('reject')![0]![1]).toBe('文件类型不符合要求')
  await choose(w,[new File(['x'.repeat(100)],'large.txt',{type:'text/plain'})]);expect(w.emitted('reject')).toHaveLength(2)
  await w.get('.zt-upload__dropzone').trigger('drop',{dataTransfer:{files:[text(),text('b.txt')]}});await flushPromises()
  expect(list.value).toHaveLength(2)
  await choose(w,[text('c.txt')]);expect(w.emitted('exceed')).toHaveLength(1);expect(list.value).toHaveLength(2);host.unmount()
 })
 it('does not resurrect files after clearing an asynchronous validation',async()=>{
  let allow!:(value:boolean)=>void
  const {host,w,list}=controlled({beforeUpload:()=>new Promise<boolean>(resolve=>allow=resolve)})
  await choose(w,[text()]);w.vm.clearFiles();allow(true);await flushPromises()
  expect(list.value).toHaveLength(0);host.unmount()
 })
 it('honors async remove veto and releases previews/requests when controlled files disappear',async()=>{
  const create=vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:test'),revoke=vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>{})
  let request!:ZtUploadRequestOptions
  const {host,w,list}=controlled({beforeRemove:async()=>false,httpRequest:(options:ZtUploadRequestOptions)=>{request=options},listType:'picture'})
  await choose(w,[new File(['image'],'a.png',{type:'image/png'})]);expect(create).toHaveBeenCalled()
  await w.vm.remove(list.value[0]!);expect(list.value).toHaveLength(1)
  list.value=[];await flushPromises();expect(request.signal.aborted).toBe(true);expect(revoke).toHaveBeenCalledWith('blob:test')
  request.onSuccess('late');await flushPromises();expect(list.value).toHaveLength(0)
  host.unmount();create.mockRestore();revoke.mockRestore()
 })
 it('inherits form size/disabled and does not add files when disabled',async()=>{
  const w=mount(ZtConfigProvider,{props:{size:'large'},slots:{default:()=>h(ZtForm,{model:{files:[]},disabled:true,size:'small'},()=>h(ZtFormItem,{prop:'files',label:'附件'},()=>h(ZtUpload)))}})
  const upload=w.findComponent(ZtUpload);expect(upload.classes()).toContain('zt-upload--small')
  await choose(upload,[text()]);expect(upload.emitted('update:fileList')).toBeUndefined()
  expect(upload.get('button').attributes('disabled')).toBeDefined();w.unmount()
 })
 it('aborts on unmount and handles rejected/transforming validation hooks',async()=>{
  const reject=mount(ZtUpload,{props:{beforeUpload:async()=>{throw new Error('校验失败')}}})
  await choose(reject,[text()]);expect(reject.emitted('reject')![0]![1]).toBe('校验失败');reject.unmount()
  let request!:ZtUploadRequestOptions
  const {host,w,list}=controlled({beforeUpload:()=>new Blob(['changed'],{type:'text/plain'}),httpRequest:(options:ZtUploadRequestOptions)=>{request=options}})
  await choose(w,[text()]);expect(list.value[0]?.size).toBe(7)
  host.unmount();expect(request.signal.aborted).toBe(true)
 })
})
