<script setup lang="ts">
import { ref } from 'vue'
import { ZtUpload, ZtSwitch } from '@ztechjs/zt-ui'
import type { ZtUploadFile, ZtUploadRequestOptions } from '@ztechjs/zt-ui'
const files=ref<ZtUploadFile[]>([
 {uid:'coast',name:'海岸.svg',status:'success',url:'/upload-demo/coast.svg'},
 {uid:'forest',name:'森林.svg',status:'success',url:'/upload-demo/forest.svg'},
])
const disabled=ref(false),fail=ref(false),message=ref('')
const tried=new WeakSet<File>()
// 本地模拟进度，不发送网络请求。
function request(options:ZtUploadRequestOptions){
 const shouldFail=fail.value&&!tried.has(options.file);tried.add(options.file)
 return new Promise((resolve,reject)=>{
  let percent=0
  const cancel=()=>{clearInterval(timer);reject(new Error('已取消'))}
  const timer=setInterval(()=>{
   percent+=10;options.onProgress(percent)
   if(shouldFail&&percent===50){clearInterval(timer);options.signal.removeEventListener('abort',cancel);reject(new Error('模拟失败，可重试'));return}
   if(percent===100){clearInterval(timer);options.signal.removeEventListener('abort',cancel);resolve({mock:true})}
  },150)
  options.signal.addEventListener('abort',cancel,{once:true})
 })
}
</script>
<template><div class="card-options"><ZtSwitch v-model="disabled" active-text="禁用上传和删除"/><ZtSwitch v-model="fail" active-text="首次模拟失败"/></div><ZtUpload v-model:file-list="files" list-type="picture-card" accept="image/*" multiple :limit="5" :max-size="5" :disabled="disabled" :http-request="request" @reject="(_file,reason)=>message=reason" @exceed="message='最多 5 张图片'" @error="message='模拟失败，可在图片上重试'"><template #tip>最多 5 张，每张 5 MB；悬停或键盘聚焦可预览、删除，触屏直接显示操作。新图片仅模拟上传。</template></ZtUpload><p aria-live="polite">{{message}}</p></template>
<style scoped>.card-options{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px}</style>
