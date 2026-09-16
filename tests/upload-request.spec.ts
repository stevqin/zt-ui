import { describe, it, expect, vi } from 'vitest'
import { uploadRequest } from '../src/components/upload/request'
import type { ZtUploadRequestOptions } from '../src'
class FakeXHR {
 static last:FakeXHR
 upload={onprogress:null as null|((event:ProgressEvent)=>void)}
 status=201;responseText='{"id":1}';withCredentials=false;timeout=0
 onload=()=>{};onerror=()=>{};ontimeout=()=>{};onabort=()=>{}
 open=vi.fn();setRequestHeader=vi.fn();send=vi.fn();abort=vi.fn(()=>this.onabort())
 constructor(){FakeXHR.last=this}
}
function options():ZtUploadRequestOptions{return {file:new File(['hello'],'a.txt'),filename:'attachment',action:'/upload',method:'POST',headers:{Authorization:'test-only'},data:{folder:'demo',count:1},withCredentials:true,timeout:5000,signal:new AbortController().signal,onProgress:vi.fn(),onSuccess:vi.fn(),onError:vi.fn()}}
describe('multipart upload request',()=>{
 it('builds form data, reports progress and parses successful responses',async()=>{
  vi.stubGlobal('XMLHttpRequest',FakeXHR)
  try{const opts=options(),pending=uploadRequest(opts),xhr=FakeXHR.last
   expect(xhr.open).toHaveBeenCalledWith('POST','/upload',true);expect(xhr.withCredentials).toBe(true);expect(xhr.timeout).toBe(5000)
   expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization','test-only')
   const body=xhr.send.mock.calls[0]![0] as FormData
   expect(body.get('folder')).toBe('demo');expect((body.get('attachment') as File).name).toBe('a.txt')
   xhr.upload.onprogress?.({lengthComputable:true,loaded:5,total:10} as ProgressEvent);expect(opts.onProgress).toHaveBeenCalledWith(50)
   xhr.onload();await expect(pending).resolves.toEqual({id:1})
  }finally{vi.unstubAllGlobals()}
 })
 it('rejects HTTP errors and responds to cancellation',async()=>{
  vi.stubGlobal('XMLHttpRequest',FakeXHR)
  try{const pending=uploadRequest(options());FakeXHR.last.status=500;FakeXHR.last.onload();await expect(pending).rejects.toThrow('HTTP 500')
   const controller=new AbortController(),cancelled=uploadRequest({...options(),signal:controller.signal});controller.abort();await expect(cancelled).rejects.toThrow('上传已取消');expect(FakeXHR.last.abort).toHaveBeenCalled()
  }finally{vi.unstubAllGlobals()}
 })
})
