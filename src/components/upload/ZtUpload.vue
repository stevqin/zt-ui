<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useZtSize } from '../config-provider/context'
import { ztFormItemKey } from '../form/context'
import ZtModal from '../modal/ZtModal.vue'
import type { ZtUploadProps, ZtUploadFile, ZtUploadRequestContext, ZtUploadRequestOptions } from './types'
import { accepts, createUploadFormData, uploadRequest } from './request'
import './upload.scss'
defineOptions({name:'ZtUpload',inheritAttrs:false})
const props=withDefaults(defineProps<ZtUploadProps>(),{fileList:()=>[],action:'',method:'POST',name:'file',headers:()=>({}),data:()=>({}),withCredentials:false,timeout:0,accept:'',multiple:false,limit:0,maxSize:0,autoUpload:true,drag:false,disabled:false,status:'primary',listType:'text',showFileList:true})
const emit=defineEmits<{
 'update:fileList':[files:ZtUploadFile[]]
 change:[file:ZtUploadFile,files:ZtUploadFile[]]
 progress:[percentage:number,file:ZtUploadFile,files:ZtUploadFile[]]
 success:[response:unknown,file:ZtUploadFile,files:ZtUploadFile[]]
 error:[error:unknown,file:ZtUploadFile,files:ZtUploadFile[]]
 remove:[file:ZtUploadFile,files:ZtUploadFile[]]
 cancel:[file:ZtUploadFile]
 preview:[file:ZtUploadFile]
 exceed:[files:File[],fileList:ZtUploadFile[]]
 reject:[file:File,reason:string]
 blur:[event:FocusEvent]
}>()
const attrs=useAttrs(),form=inject(ztFormItemKey,undefined)
const size=useZtSize(props,()=>form?.size.value),disabled=computed(()=>props.disabled||form?.disabled.value||false)
const status=computed(()=>form?.validateState.value==='error'?'danger':props.status)
const input=ref<HTMLInputElement>(),root=ref<HTMLElement>(),files=ref<ZtUploadFile[]>([]),dragging=ref(false),previewFile=ref<ZtUploadFile>()
const previewOpen=ref(false),busy=ref(false)
const compactFormFeedback=computed(()=>Boolean(form)&&!props.drag&&props.listType!=='picture-card'&&(!props.showFileList||files.value.length===0))
const urls=new Map<string,string>(),sessions=new Map<string,{controller:AbortController;abort?:()=>void;done:()=>void}>(),removing=new Set<string>()
let epoch=0,disposed=false,serial=0,queue=Promise.resolve(),dragDepth=0
const snapshot=()=>files.value.map(file=>({...file}))
function publish(file?:ZtUploadFile,validate=true){emit('update:fileList',snapshot());if(file)emit('change',{...file},snapshot());if(validate)void nextTick(()=>form?.validate('change'))}
function stop(uid:string){const session=sessions.get(uid);if(!session)return;sessions.delete(uid);session.controller.abort();try{session.abort?.()}catch{/* Cancellation must still settle the request. */}session.done()}
function revoke(uid:string){const url=urls.get(uid);if(url){URL.revokeObjectURL(url);urls.delete(uid)}}
watch(()=>props.fileList,incoming=>{
 const ids=new Set(incoming.map(file=>file.uid))
 for(const file of files.value)if(!ids.has(file.uid)){stop(file.uid);revoke(file.uid);if(previewFile.value?.uid===file.uid)previewOpen.value=false}
 files.value=incoming.map(file=>({...file}))
},{immediate:true,deep:true})
watch(disabled,value=>{if(value){dragging.value=false;dragDepth=0}})
onBeforeUnmount(()=>{disposed=true;epoch++;for(const uid of sessions.keys())stop(uid);for(const uid of urls.keys())revoke(uid)})
const buttonAttrs=computed(()=>{const {class:_class,style:_style,...rest}=attrs;return rest})
const errorDescription=computed(()=>[attrs['aria-describedby'],form?.validateMessage.value?form.errorId:undefined].filter(Boolean).join(' ')||undefined)
function open(){if(!disabled.value&&!busy.value)input.value?.click()}
function safeUrl(url: string | undefined) {
  if (!url) return undefined
  // Only allow http(s) and relative/blob/data-image URLs for preview.
  if (/^javascript:/i.test(url.trim())) return undefined
  return url
}
function image(file:ZtUploadFile){return Boolean(safeUrl(file.url))&&(/^image\//.test(file.raw?.type??'')||/\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(file.name))}
function reason(file:File){return !accepts(file,props.accept)?'文件类型不符合要求':props.maxSize>0&&file.size>props.maxSize*1024*1024?`文件不能超过 ${props.maxSize} MB`:''}
function addFiles(candidates:File[]){
 const generation=epoch
 queue=queue.then(async()=>{
  if(disabled.value||disposed||generation!==epoch)return
  const chosen=props.multiple?candidates:candidates.slice(0,1)
  if(props.limit>0&&files.value.length+chosen.length>props.limit){emit('exceed',chosen,snapshot());return}
  busy.value=true
  try{for(const original of chosen){
   if(disabled.value||disposed||generation!==epoch)break
   let raw=original
   const invalid=reason(raw);if(invalid){emit('reject',raw,invalid);continue}
   try{
    const result=await props.beforeUpload?.(raw)
    if(disabled.value||disposed||generation!==epoch)break
    if(result===false){emit('reject',original,'上传前校验未通过');continue}
    if(result instanceof File)raw=result
    else if(result instanceof Blob)raw=new File([result],original.name,{type:result.type||original.type})
   }catch(error){if(!disposed&&generation===epoch)emit('reject',original,error instanceof Error?error.message:'上传前校验未通过');continue}
   const transformedError=reason(raw);if(transformedError){emit('reject',original,transformedError);continue}
   // Recheck after async hooks because the controlled list may have changed.
   if(props.limit>0&&files.value.length>=props.limit){emit('exceed',[original],snapshot());continue}
   const uid=`zt-upload-${Date.now()}-${++serial}`
   const file:ZtUploadFile={uid,name:raw.name,size:raw.size,raw,status:'ready',percentage:0}
   if(/^image\//.test(raw.type)&&typeof URL.createObjectURL==='function'){file.url=URL.createObjectURL(raw);urls.set(uid,file.url)}
   files.value.push(file);publish(file)
   if(props.autoUpload&&(props.action||props.request||props.httpRequest))void start(uid)
  }}finally{busy.value=false}
 })
 return queue
}
function selected(event:Event){const el=event.target as HTMLInputElement;void addFiles([...el.files??[]]);el.value=''}
function drop(event:DragEvent){dragDepth=0;dragging.value=false;if(!disabled.value)void addFiles([...event.dataTransfer?.files??[]])}
function enter(event:DragEvent){if(!disabled.value&&event.dataTransfer?.types.includes('Files')){dragDepth++;dragging.value=true}}
function leave(){dragDepth=Math.max(0,dragDepth-1);if(!dragDepth)dragging.value=false}
function start(uid:string):Promise<void>{
 const file=files.value.find(file=>file.uid===uid)
 if(disabled.value||disposed||sessions.has(uid)||!file?.raw||file.status==='success')return Promise.resolve()
 return new Promise(resolve=>{
  const session={controller:new AbortController(),done:resolve,abort:undefined as (()=>void)|undefined};sessions.set(uid,session)
  const current=()=>sessions.get(uid)===session?files.value.find(file=>file.uid===uid):undefined
  file.status='uploading';file.percentage=0;file.error=undefined;publish(file)
  function finish(error:unknown,response?:unknown){const item=current();if(!item)return;sessions.delete(uid);item.status=error?'fail':'success';item.percentage=error?item.percentage:100;item.response=response;item.error=error?(error instanceof Error?error.message:String(error)):undefined;publish(item);if(error)emit('error',error,{...item},snapshot());else emit('success',response,{...item},snapshot());resolve()}
  const options:ZtUploadRequestOptions={file:file.raw!,filename:props.name,action:props.action,method:props.method,headers:props.headers,data:props.data,withCredentials:props.withCredentials,timeout:props.timeout,signal:session.controller.signal,onProgress:percentage=>{const item=current();if(!item||!Number.isFinite(percentage))return;item.percentage=Math.max(item.percentage??0,Math.min(99,Math.max(0,Math.round(percentage))));publish(undefined,false);emit('progress',item.percentage,{...item},snapshot())},onSuccess:response=>finish(null,response),onError:error=>finish(error||new Error('上传失败'))}
  try{
   if(!props.httpRequest&&!props.request&&!props.action)throw new Error('请配置 action、request 或 httpRequest')
   const context:ZtUploadRequestContext={file:options.file,action:options.action,method:options.method,headers:options.headers,withCredentials:options.withCredentials,timeout:options.timeout,signal:options.signal,onProgress:options.onProgress}
   const result=props.httpRequest?props.httpRequest(options):props.request?props.request(createUploadFormData(options),context):uploadRequest(options)
   if(result&&'then' in result)result.then(options.onSuccess,options.onError)
   else if(result)session.abort=result.abort
  }catch(error){options.onError(error)}
 })
}
async function submit(){await queue;await Promise.all(files.value.filter(file=>file.status==='ready').map(file=>start(file.uid)))}
function abort(file?:ZtUploadFile){for(const uid of file?[file.uid]:[...sessions.keys()]){const item=files.value.find(item=>item.uid===uid);if(!sessions.has(uid))continue;stop(uid);if(item){item.status='ready';item.percentage=0;publish(item);emit('cancel',{...item})}}}
function retry(file:ZtUploadFile){return start(file.uid)}
async function remove(file:ZtUploadFile){
 if(disabled.value||removing.has(file.uid))return
 removing.add(file.uid)
 try{if(await props.beforeRemove?.({...file},snapshot())===false||disposed||disabled.value)return;if(!files.value.some(item=>item.uid===file.uid))return;stop(file.uid);files.value=files.value.filter(item=>item.uid!==file.uid);if(previewFile.value?.uid===file.uid)previewOpen.value=false;revoke(file.uid);publish(file);emit('remove',{...file},snapshot())}catch{/* A rejected beforeRemove promise preserves the file. */}finally{removing.delete(file.uid)}
}
function clearFiles(){if(disabled.value)return;epoch++;for(const uid of sessions.keys())stop(uid);for(const uid of urls.keys())revoke(uid);files.value=[];previewOpen.value=false;publish()}
function preview(file:ZtUploadFile){emit('preview',{...file});if(image(file)){previewFile.value={...file};previewOpen.value=true}}
function blur(event:FocusEvent){if(!root.value?.contains(event.relatedTarget as Node)){emit('blur',event);void form?.validate('blur')}}
function formatSize(bytes?:number){return bytes===undefined?'':bytes<1024?`${bytes} B`:bytes<1024*1024?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1024/1024).toFixed(1)} MB`}
defineExpose({submit,abort,retry,remove,clearFiles,open})
</script>
<template>
 <div ref="root" class="zt-upload" :class="[`zt-upload--${size}`,`zt-upload--${status}`,{'is-disabled':disabled,'is-dragging':dragging,'is-picture-card':listType==='picture-card','is-form-feedback-compact':compactFormFeedback},attrs.class]" :style="attrs.style" @focusout="blur">
  <input ref="input" type="file" class="zt-upload__input" tabindex="-1" aria-hidden="true" :accept="accept" :multiple="multiple" :disabled="disabled" @change="selected" />
  <slot v-if="listType!=='picture-card'||!showFileList||!limit||files.length<limit" name="trigger" :open="open" :disabled="disabled||busy"><button v-bind="buttonAttrs" :id="String(attrs.id??form?.inputId??'')||undefined" type="button" class="zt-upload__trigger" :class="{'zt-upload__dropzone':drag,'zt-upload__add-card':listType==='picture-card'}" :disabled="disabled||busy" :aria-busy="busy||undefined" :aria-invalid="form?.validateState.value==='error'?'true':undefined" :aria-describedby="errorDescription" @click="open" @dragover.prevent @dragenter.prevent="enter" @dragleave.prevent="leave" @drop.prevent="drop">
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 16V4m-4 4 4-4 4 4M4 15v5h16v-5"/></svg><span><slot>{{busy?'正在检查文件':listType==='picture-card'?'添加图片':drag?'拖拽文件到此处，或点击选择':'选择文件'}}</slot></span>
  </button></slot>
  <div v-if="$slots.tip" class="zt-upload__tip"><slot name="tip"/></div>
  <ul v-if="showFileList&&files.length" class="zt-upload__list" :class="`zt-upload__list--${listType}`" aria-label="上传文件列表">
   <li v-for="file in files" :key="file.uid" class="zt-upload__file" :class="`is-${file.status}`"><slot name="file" :file="file" :remove="()=>remove(file)" :abort="()=>abort(file)" :retry="()=>retry(file)" :preview="()=>preview(file)">
    <template v-if="listType==='picture-card'">
     <div class="zt-upload__card-media"><img v-if="image(file)" :src="safeUrl(file.url)" :alt="file.name"/><span v-else class="zt-upload__card-placeholder">{{file.name.split('.').pop()?.toUpperCase()??'文件'}}</span></div>
     <div class="zt-upload__card-actions"><button v-if="image(file)" type="button" :aria-label="`预览 ${file.name}`" @click="preview(file)">预览</button><button v-if="file.status==='uploading'" type="button" :disabled="disabled" :aria-label="`取消上传 ${file.name}`" @click="abort(file)">取消</button><button v-if="file.status==='fail'&&file.raw" type="button" :disabled="disabled" :aria-label="`重试 ${file.name}`" @click="retry(file)">重试</button><button type="button" :disabled="disabled" :aria-label="`移除 ${file.name}`" @click="remove(file)">删除</button></div>
     <div class="zt-upload__card-caption"><span class="zt-upload__card-name" :title="file.name">{{file.name}}</span><span class="zt-upload__card-status" :title="file.error">{{file.status==='uploading'?`上传中 ${file.percentage??0}%`:file.status==='fail'?'上传失败':file.status==='success'?'已上传':'待上传'}}</span></div>
     <div v-if="file.status==='uploading'" class="zt-upload__progress" role="progressbar" :aria-label="`${file.name} 上传进度`" :aria-valuenow="file.percentage??0" :aria-valuemin="0" :aria-valuemax="100"><span :style="{width:`${file.percentage??0}%`}"/></div>
    </template>
    <template v-else>
    <button v-if="listType==='picture'&&image(file)" type="button" class="zt-upload__thumbnail" :aria-label="`预览 ${file.name}`" @click="preview(file)"><img :src="safeUrl(file.url)" alt=""/></button>
    <span v-else class="zt-upload__file-icon" aria-hidden="true">↥</span>
    <div class="zt-upload__details"><button type="button" class="zt-upload__name" :title="file.name" @click="preview(file)">{{file.name}}</button><div class="zt-upload__meta"><span>{{formatSize(file.size)}}</span><span>{{file.status==='ready'?'待上传':file.status==='uploading'?`上传中 ${file.percentage??0}%`:file.status==='success'?'上传成功':'上传失败'}}</span></div><small v-if="file.error" class="zt-upload__error">{{file.error}}</small><div v-if="file.status==='uploading'" class="zt-upload__progress" role="progressbar" :aria-label="`${file.name} 上传进度`" :aria-valuenow="file.percentage??0" :aria-valuemin="0" :aria-valuemax="100"><span :style="{width:`${file.percentage??0}%`}"/></div></div>
    <div class="zt-upload__actions"><button v-if="file.status==='uploading'" type="button" :disabled="disabled" :aria-label="`取消上传 ${file.name}`" @click="abort(file)">取消</button><button v-if="file.status==='fail'&&file.raw" type="button" :disabled="disabled" :aria-label="`重试 ${file.name}`" @click="retry(file)">重试</button><button type="button" :disabled="disabled" :aria-label="`移除 ${file.name}`" @click="remove(file)">×</button></div>
    </template>
   </slot></li>
  </ul>
  <ZtModal v-model="previewOpen" :title="previewFile?.name??'图片预览'"><img v-if="previewOpen&&previewFile?.url" class="zt-upload__preview" :src="previewFile.url" :alt="previewFile.name"/></ZtModal>
 </div>
</template>
