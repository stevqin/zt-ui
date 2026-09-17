<script setup lang="ts">
import { ref } from 'vue'
import { ZtInputOtp, ZtButton } from '@ztechjs/zt-ui'
import type { ZtInputOtpStatus, ZtComponentSize } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
import FormExample from './FormExample.vue'
import formCode from './FormExample.vue?raw'
const code=ref(''),completed=ref(false),short=ref(''),characters=ref(''),masked=ref('')
const sizes:ZtComponentSize[]=['mini','small','default','medium','large']
const statuses:ZtInputOtpStatus[]=['default','primary','success','warning','danger','info']
const basicCode=sfc("import { ref } from 'vue'\nimport { ZtInputOtp } from '@ztechjs/zt-ui'\nconst code = ref('')\nconst completed = ref(false)",'<ZtInputOtp v-model="code" aria-label="短信验证码" @complete="completed = true" @input="completed = false" />\n<p>{{ completed ? "输入完成" : "请输入 6 位验证码" }}</p>')
const lengthCode=sfc("import { ref } from 'vue'\nimport { ZtInputOtp } from '@ztechjs/zt-ui'\nconst code = ref('')",'<ZtInputOtp v-model="code" :length="4" separator="-" :separator-after="2" aria-label="四位验证码" />')
const characterCode=sfc("import { ref } from 'vue'\nimport { ZtInputOtp } from '@ztechjs/zt-ui'\nconst code = ref('')",'<ZtInputOtp v-model="code" :integer-only="false" :length="6" aria-label="字符验证码" />')
const maskCode=sfc("import { ref } from 'vue'\nimport { ZtInputOtp } from '@ztechjs/zt-ui'\nconst code = ref('')",'<ZtInputOtp v-model="code" mask aria-label="私密验证码" />')
const statesCode=sfc("import { ZtInputOtp } from '@ztechjs/zt-ui'",'<ZtInputOtp model-value="012345" disabled aria-label="禁用验证码" />\n<ZtInputOtp model-value="012345" readonly aria-label="只读验证码" />')
const sizeCode=sfc("import { ZtInputOtp } from '@ztechjs/zt-ui'\nimport type { ZtComponentSize } from '@ztechjs/zt-ui'\nconst sizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large']",'<div v-for="size in sizes" :key="size">\n  <ZtInputOtp model-value="012" :size="size" :aria-label="size + \'验证码\'" />\n</div>')
const statusCode=sfc("import { ZtInputOtp } from '@ztechjs/zt-ui'\nimport type { ZtInputOtpStatus } from '@ztechjs/zt-ui'\nconst statuses: ZtInputOtpStatus[] = ['default', 'primary', 'success', 'warning', 'danger', 'info']",'<div v-for="status in statuses" :key="status">\n  <ZtInputOtp model-value="012" :status="status" :aria-label="status + \'验证码\'" />\n</div>')
</script>
<template><div class="doc-section">
 <h1>InputOtp 一次性密码输入框</h1><p>用于短信验证码、邮箱验证码和动态口令。支持逐位输入、整段粘贴、键盘编辑以及浏览器 one-time-code 自动填充；使用字符串保留开头的 0。</p>
 <h2>基础用法</h2><DemoBlock :code="basicCode" desc="默认 6 位数字，输入完整时触发 complete。可直接粘贴 012345，空格和分隔字符会自动过滤。"><ZtInputOtp v-model="code" aria-label="短信验证码" @input="completed=false" @complete="completed=true"/><div class="otp-feedback"><span aria-live="polite">{{completed?'输入完成':'请输入 6 位验证码'}}</span><ZtButton size="small" @click="code='';completed=false">清空</ZtButton></div></DemoBlock>
 <h2>位数与分隔符</h2><DemoBlock :code="lengthCode"><ZtInputOtp v-model="short" :length="4" separator="-" :separator-after="2" aria-label="四位验证码"/></DemoBlock>
 <h2>字符验证码</h2><DemoBlock :code="characterCode" desc="integer-only=false 可输入字母等非空白字符。"><ZtInputOtp v-model="characters" :integer-only="false" aria-label="字符验证码"/></DemoBlock>
 <h2>遮蔽显示</h2><DemoBlock :code="maskCode"><ZtInputOtp v-model="masked" mask aria-label="私密验证码"/></DemoBlock>
 <h2>尺寸</h2><DemoBlock :code="sizeCode"><div class="otp-examples"><div v-for="size in sizes" :key="size"><span>{{size}}</span><ZtInputOtp model-value="012" :size="size" :aria-label="size+'验证码'"/></div></div></DemoBlock>
 <h2>主题颜色</h2><DemoBlock :code="statusCode"><div class="otp-examples"><div v-for="status in statuses" :key="status"><span>{{status}}</span><ZtInputOtp model-value="012" :status="status" :aria-label="status+'验证码'"/></div></div></DemoBlock>
 <h2>禁用与只读</h2><DemoBlock :code="statesCode"><div class="otp-examples"><ZtInputOtp model-value="012345" disabled aria-label="禁用验证码"/><ZtInputOtp model-value="012345" readonly aria-label="只读验证码"/></div></DemoBlock>
 <h2>表单联动</h2><DemoBlock :code="formCode" desc="继承 Form 的尺寸与禁用状态，输入变化和失焦分别触发 change / blur 校验。complete 表示填满，不代表验证码验证成功。"><FormExample/></DemoBlock>
 <h2>键盘与自动填充</h2><p>Tab 聚焦整个验证码字段，← / → 移动到相邻格，Home / End 跳到首格或末尾。点击已有格可替换字符；Backspace / Delete 删除后会将后续字符前移。Ctrl / Command + A 可全选；完整验证码粘贴到任意格都会替换整个值。</p><p>默认 autocomplete="one-time-code"；自动填充取决于浏览器、设备和短信格式。组件不会自动发送验证码或提交表单。length 变化和外部 v-model 更新不会触发 complete。</p>
 </div></template>
<style scoped>.otp-feedback{display:flex;align-items:center;gap:16px;margin-top:16px;color:var(--zt-text-muted);font-size:13px}.otp-examples{display:flex;flex-direction:column;gap:20px}.otp-examples>div{display:flex;flex-direction:column;align-items:flex-start;gap:8px}.otp-examples>div>span{color:var(--zt-text-muted);font-size:12px}</style>
