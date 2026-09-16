<script setup lang="ts">
import { ref } from 'vue'
import { ZtUpload } from '@ztechjs/zt-ui'
import type { ZtUploadFile, ZtComponentSize } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
import Playground from './Playground.vue'
import playgroundCode from './Playground.vue?raw'
import PictureCard from './PictureCard.vue'
import pictureCardCode from './PictureCard.vue?raw'
import Avatar from './Avatar.vue'
import avatarCode from './Avatar.vue?raw'
import FormExample from './FormExample.vue'
import formCode from './FormExample.vue?raw'
const pictures=ref<ZtUploadFile[]>([{uid:'dunes',name:'沙丘.svg',status:'success',url:'/upload-demo/dunes.svg'}]),pictureMessage=ref(''),limited=ref<ZtUploadFile[]>([]),limitMessage=ref('')
const sizes:ZtComponentSize[]=['mini','small','default','medium','large']
const pictureCode=sfc("import { ref } from 'vue'\nimport { ZtUpload } from '@ztechjs/zt-ui'\nimport type { ZtUploadFile } from '@ztechjs/zt-ui'\nconst files = ref<ZtUploadFile[]>([])",'<ZtUpload v-model:file-list="files" accept="image/*" list-type="picture" :auto-upload="false" multiple :limit="4" :max-size="5">\n  <template #tip>仅本地选择，点击缩略图预览。</template>\n</ZtUpload>')
const limitCode=sfc("import { ref } from 'vue'\nimport { ZtUpload } from '@ztechjs/zt-ui'\nimport type { ZtUploadFile } from '@ztechjs/zt-ui'\nconst files = ref<ZtUploadFile[]>([])\nconst message = ref('')",'<ZtUpload v-model:file-list="files" drag multiple accept=".pdf,.txt" :limit="2" :max-size="2" :auto-upload="false" @reject="(_file, reason) => message = reason" @exceed="message = \'最多两个文件\'" />\n<p>{{ message }}</p>')
const disabledCode=sfc("import { ZtUpload } from '@ztechjs/zt-ui'",'<ZtUpload disabled :file-list="[{ uid: \'saved-1\', name: \'已归档附件.pdf\', size: 12345, status: \'success\' }]" />')
const sizeCode=sfc("import { ZtUpload } from '@ztechjs/zt-ui'\nimport type { ZtComponentSize } from '@ztechjs/zt-ui'\nconst sizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large']",'<div v-for="size in sizes" :key="size">\n  <ZtUpload :size="size" :auto-upload="false" />\n</div>')
const requestCode=sfc("import { ref } from 'vue'\nimport { ZtUpload } from '@ztechjs/zt-ui'\nimport type { ZtUploadFile, ZtUploadRequestContext } from '@ztechjs/zt-ui'\nimport http from '@/utils/http'\n\nconst files = ref<ZtUploadFile[]>([])\n\n// http 是项目中已配置认证、错误处理等拦截器的 Axios 实例\nconst uploadAttachment = (formData: FormData, context: ZtUploadRequestContext) =>\n  http.post('/attachments/upload', formData, {\n    signal: context.signal,\n    onUploadProgress: event => {\n      if (event.total) context.onProgress(event.loaded / event.total * 100)\n    }\n  })",'<ZtUpload\n  v-model:file-list="files"\n  :request="uploadAttachment"\n  name="attachment"\n  :data="{ folder: \'documents\' }"\n  multiple\n/>')
</script>
<template><div class="doc-section">
 <h1>Upload 上传</h1><p>选择、拖拽和上传文件，提供进度、取消、重试及图片预览。通过 v-model:file-list 管理文件列表，继承全局尺寸、主题和圆角。</p>
 <h2>上传交互体验</h2><DemoBlock :code="playgroundCode" desc="此示例使用本地模拟请求。可切换自动/手动上传、拖拽和失败重试，或切换 status 查看六种主题。"><Playground/></DemoBlock>
 <h2>图片列表与预览</h2><DemoBlock :code="pictureCode" desc="图片预览使用本地临时 URL，移除文件或卸载组件后释放。此示例不执行上传。"><ZtUpload v-model:file-list="pictures" accept="image/*" list-type="picture" :auto-upload="false" multiple :limit="4" :max-size="5" @reject="(_file,reason)=>pictureMessage=reason" @exceed="pictureMessage='最多选择 4 张图片'"><template #tip>选择图片后点击缩略图预览，单张不超过 5 MB。</template></ZtUpload><p aria-live="polite">{{pictureMessage}}</p></DemoBlock>
 <h2>照片墙</h2><DemoBlock :code="pictureCardCode" desc="list-type=picture-card 将文件显示为图片卡片；卡片大小随全局 size 调整，达到 limit 后隐藏添加入口，删除后恢复。"><PictureCard/></DemoBlock>
 <h2>单张头像上传</h2><DemoBlock :code="avatarCode" desc="参考头像上传用法，通过 trigger 自定义入口和 show-file-list=false 隐藏常规列表。"><Avatar/></DemoBlock>
 <h2>类型、大小与数量限制</h2><DemoBlock :code="limitCode"><ZtUpload v-model:file-list="limited" drag multiple accept=".pdf,.txt" :limit="2" :max-size="2" :auto-upload="false" @reject="(_file,reason)=>limitMessage=reason" @exceed="limitMessage='最多两个文件，本次选择已取消'"><template #tip>仅支持 PDF / TXT，最多两个，每个不超过 2 MB。仅本地选择。</template></ZtUpload><p aria-live="polite">{{limitMessage}}</p></DemoBlock>
 <h2>尺寸</h2><DemoBlock :code="sizeCode"><div class="upload-sizes"><div v-for="size in sizes" :key="size"><span>{{size}}</span><ZtUpload :size="size" :auto-upload="false"/></div></div></DemoBlock>
 <h2>禁用与文件回显</h2><DemoBlock :code="disabledCode"><ZtUpload disabled :file-list="[{uid:'saved-1',name:'已归档附件.pdf',size:12345,status:'success'}]"/></DemoBlock>
 <h2>表单联动</h2><DemoBlock :code="formCode"><FormExample/></DemoBlock>
 <h2>接入真实接口</h2><DemoBlock :code="requestCode" desc="将项目中已经封装好的 Axios 接口方法直接传给 request；action 可以省略。以下仅展示配置，本站不执行这个请求。"><p>组件负责根据 name、data 和文件构建 FormData，接口方法返回的 Promise 决定成功或失败，因此项目现有的认证、统一响应和错误拦截器都会继续生效。第二个 context 参数提供 signal 和 onProgress；不需要取消或进度时，业务方法只声明 formData 一个参数即可。请让 Axios 自动生成 multipart boundary，无需手写 Content-Type。</p></DemoBlock>
 <h2>请求与校验约定</h2><p>未配置 action、request 或 httpRequest 时只选择文件。auto-upload=false 时，通过组件 ref 的 submit() 上传待上传项；失败项使用 retry(file)。abort(file?) 取消指定或全部请求并恢复为待上传，迟到的回调不会覆盖新状态。clearFiles() 取消请求、释放预览并清空列表。</p><p>beforeUpload 在文件加入列表前执行，可异步校验、返回 false 拒绝，或返回 File / Blob 替换内容。accept 和 maxSize 会再次校验替换后的文件。beforeRemove 可通过 false 或 Promise 拒绝阻止移除；clearFiles() 是直接清空操作，不执行逐项移除钩子。</p><p>请求优先级为 httpRequest、request、内置 XHR。request 适合直接复用返回 Promise 的业务接口；httpRequest 适合完全接管底层上传，可返回 Promise，也可调用 onProgress / onSuccess / onError，并通过 signal 或返回 abort() 停止实际请求。fileList 回显条目需有唯一 uid、name 和 status；有图片 url 时可预览，没有 raw 的历史文件不能重传。</p>
 <h2>事件与插槽</h2><p>change 表示文件列表中的文件状态变化；progress、success、error 分别报告请求过程。reject 报告类型、大小或前置校验失败，exceed 报告数量超限，remove / cancel / preview 对应用户操作。trigger 插槽提供 open 与 disabled；file 插槽提供当前 file 以及 remove、abort、retry、preview 操作，tip 插槽用于限制说明。</p>
 <h2>API</h2><p><RouterLink to="/api/upload">查看完整 Props、Events、Slots、Methods 和类型定义 →</RouterLink></p>
</div></template>
<style scoped>.upload-sizes{display:flex;flex-direction:column;gap:16px}.upload-sizes>div{display:flex;align-items:center;gap:16px}.upload-sizes>div>span{width:70px;flex:none;color:var(--zt-text-muted);font-size:12px}</style>
