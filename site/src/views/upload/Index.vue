<script setup lang="ts">
import { ref } from 'vue';
import { ZtUpload } from '@ztechjs/zt-ui';
import type { ZtUploadFile } from '@ztechjs/zt-ui';
import DemoBlock from '@/components/DemoBlock.vue';
import { sfc } from '@/utils/exampleCode';
import Playground from './Playground.vue';
import playgroundCode from './Playground.vue?raw';
import PictureCard from './PictureCard.vue';
import pictureCardCode from './PictureCard.vue?raw';
import Avatar from './Avatar.vue';
import avatarCode from './Avatar.vue?raw';
import FormExample from './FormExample.vue';
import formCode from './FormExample.vue?raw';
const requestCode = sfc(
  "import { ref } from 'vue'\nimport { ZtUpload } from '@ztechjs/zt-ui'\nimport type { ZtUploadFile, ZtUploadRequestContext } from '@ztechjs/zt-ui'\nimport http from '@/utils/http'\n\nconst files = ref<ZtUploadFile[]>([])\n\n// http 是项目中已配置认证、错误处理等拦截器的 Axios 实例\nconst uploadAttachment = (formData: FormData, context: ZtUploadRequestContext) =>\n  http.post('/attachments/upload', formData, {\n    signal: context.signal,\n    onUploadProgress: event => {\n      if (event.total) context.onProgress(event.loaded / event.total * 100)\n    }\n  })",
  '<ZtUpload\n  v-model:file-list="files"\n  :request="uploadAttachment"\n  name="attachment"\n  :data="{ folder: \'documents\' }"\n  multiple\n/>',
);
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example05 from './Example05.vue';
import Example05Code from './Example05.vue?raw';
import Example06 from './Example06.vue';
import Example06Code from './Example06.vue?raw';
import Example07 from './Example07.vue';
import Example07Code from './Example07.vue?raw';
import Hooks from './Hooks.vue';
import HooksCode from './Hooks.vue?raw';
import Request from './Request.vue';
import RequestCode from './Request.vue?raw';
import FileSlot from './FileSlot.vue';
import FileSlotCode from './FileSlot.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>上传交互体验</h3>
    <DemoBlock
      :code="playgroundCode"
      desc="此示例使用本地模拟请求。可切换自动/手动上传、拖拽和失败重试，或切换 status 查看六种主题。"
      ><Playground
    /></DemoBlock>
    <h3>图片列表与预览</h3>
    <DemoBlock
      :code="Example02Code"
      desc="图片预览使用本地临时 URL，移除文件或卸载组件后释放。此示例不执行上传。"
      ><Example02
    /></DemoBlock>
    <h3>照片墙</h3>
    <DemoBlock
      :code="pictureCardCode"
      desc="list-type=picture-card 将文件显示为图片卡片；卡片大小随全局 size 调整，达到 limit 后隐藏添加入口，删除后恢复。"
      ><PictureCard
    /></DemoBlock>
    <h3>单张头像上传</h3>
    <DemoBlock
      :code="avatarCode"
      desc="参考头像上传用法，通过 trigger 自定义入口和 show-file-list=false 隐藏常规列表。"
      ><Avatar
    /></DemoBlock>
    <h3>类型、大小与数量限制</h3>
    <DemoBlock :code="Example05Code"><Example05 /></DemoBlock>
    <h3>尺寸</h3>
    <DemoBlock :code="Example06Code"><Example06 /></DemoBlock>
    <h3>禁用与文件回显</h3>
    <DemoBlock :code="Example07Code"><Example07 /></DemoBlock>
    <h3>表单联动</h3>
    <DemoBlock :code="formCode"><FormExample /></DemoBlock>
    <h3>接入真实接口</h3>
    <DemoBlock
      code-only
      :code="requestCode"
      desc="将项目中已经封装好的 Axios 接口方法直接传给 request；action 可以省略。以下仅展示配置，本站不执行这个请求。"
    ></DemoBlock>
    <h3>请求与校验约定</h3>
    <p>
      未配置 action、request 或 httpRequest 时只选择文件。auto-upload=false 时，通过组件 ref 的
      submit() 上传待上传项；失败项使用 retry(file)。abort(file?)
      取消指定或全部请求并恢复为待上传，迟到的回调不会覆盖新状态。clearFiles()
      取消请求、释放预览并清空列表。
    </p>
    <p>
      beforeUpload 在文件加入列表前执行，可异步校验、返回 false 拒绝，或返回 File / Blob
      替换内容。accept 和 maxSize 会再次校验替换后的文件。beforeRemove 可通过 false 或 Promise
      拒绝阻止移除；clearFiles() 是直接清空操作，不执行逐项移除钩子。
    </p>
    <p>
      请求优先级为 httpRequest、request、内置 XHR。request 适合直接复用返回 Promise
      的业务接口；httpRequest 适合完全接管底层上传，可返回 Promise，也可调用 onProgress / onSuccess
      / onError，并通过 signal 或返回 abort() 停止实际请求。fileList 回显条目需有唯一 uid、name 和
      status；有图片 url 时可预览，没有 raw 的历史文件不能重传。
    </p>
    <h3>事件与插槽</h3>
    <p>
      change 表示文件列表中的文件状态变化；progress、success、error 分别报告请求过程。reject
      报告类型、大小或前置校验失败，exceed 报告数量超限，remove / cancel / preview
      对应用户操作。trigger 插槽提供 open 与 disabled；file 插槽提供当前 file 以及
      remove、abort、retry、preview 操作，tip 插槽用于限制说明。
    </p>

    <h3>异步校验与删除保护</h3>
    <DemoBlock :code="HooksCode" desc=""><Hooks /></DemoBlock>

    <h3>直接传入业务接口函数</h3>
    <DemoBlock
      :code="RequestCode"
      desc="此演示实际执行 FormData 接口函数，用本地 Promise 模拟返回，不发送网络请求。"
      ><Request
    /></DemoBlock>

    <h3>自定义文件行与实例清空</h3>
    <DemoBlock :code="FileSlotCode" desc=""><FileSlot /></DemoBlock>
  </div>
</template>

<style scoped>
.upload-sizes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.upload-sizes > div {
  display: flex;
  align-items: center;
  gap: 16px;
}
.upload-sizes > div > span {
  width: 70px;
  flex: none;
  color: var(--zt-text-muted);
  font-size: 12px;
}
</style>
