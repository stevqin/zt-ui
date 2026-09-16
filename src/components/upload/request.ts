import type { ZtUploadRequestOptions } from './types'
export function createUploadFormData(options:Pick<ZtUploadRequestOptions,'file'|'filename'|'data'>){
 const body=new FormData()
 for(const [key,value] of Object.entries(options.data))body.append(key,value instanceof Blob?value:String(value))
 body.append(options.filename,options.file,options.file.name)
 return body
}
export function uploadRequest(options:ZtUploadRequestOptions):Promise<unknown>{
 return new Promise((resolve,reject)=>{
  const xhr=new XMLHttpRequest()
  const abort=()=>{xhr.abort();reject(new Error('上传已取消'))}
  const cleanup=()=>options.signal.removeEventListener('abort',abort)
  xhr.open(options.method,options.action,true)
  xhr.withCredentials=options.withCredentials;xhr.timeout=options.timeout
  for(const [key,value] of Object.entries(options.headers))xhr.setRequestHeader(key,value)
  xhr.upload.onprogress=event=>{if(event.lengthComputable)options.onProgress(event.loaded/event.total*100)}
  xhr.onload=()=>{cleanup();if(xhr.status>=200&&xhr.status<300){let response:unknown=xhr.responseText;try{response=JSON.parse(xhr.responseText)}catch{/* Non-JSON responses are supported. */}resolve(response)}else reject(new Error(`上传失败（HTTP ${xhr.status}）`))}
  xhr.onerror=()=>{cleanup();reject(new Error('网络连接失败'))}
  xhr.ontimeout=()=>{cleanup();reject(new Error('上传超时'))}
  xhr.onabort=()=>{cleanup();reject(new Error('上传已取消'))}
  options.signal.addEventListener('abort',abort,{once:true})
  if(options.signal.aborted){cleanup();abort();return}
  xhr.send(createUploadFormData(options))
 })
}
export function accepts(file:File,accept:string){
 if(!accept.trim())return true
 return accept.split(',').some(value=>{const rule=value.trim().toLowerCase();return rule.startsWith('.')?file.name.toLowerCase().endsWith(rule):rule.endsWith('/*')?file.type.toLowerCase().startsWith(rule.slice(0,-1)):file.type.toLowerCase()===rule})
}
