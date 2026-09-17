<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtPopconfirm, ZtText } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const message=ref('尚未操作'),saving=ref(false)
const basicCode=sfc("import { ZtButton, ZtPopconfirm } from '@ztechjs/zt-ui'",'<ZtPopconfirm title="确定删除这条记录？" description="删除后无法恢复" status="danger" @confirm="remove">\n  <ZtButton status="danger">删除</ZtButton>\n</ZtPopconfirm>')
const asyncCode=sfc("import { ZtButton, ZtPopconfirm } from '@ztechjs/zt-ui'\nconst submit = () => new Promise(resolve => setTimeout(resolve, 800))",'<ZtPopconfirm title="提交审批？" :before-confirm="submit"><ZtButton>提交</ZtButton></ZtPopconfirm>')
function submit(){saving.value=true;return new Promise<void>(resolve=>setTimeout(()=>{saving.value=false;message.value='审批已提交';resolve()},700))}
</script>
<template><div class="doc-section"><h1>Popconfirm 气泡确认框</h1><p>在当前操作附近完成二次确认，支持状态图标、说明和异步确认。</p><h2>危险操作</h2><DemoBlock :code="basicCode"><div class="confirm-row"><ZtPopconfirm title="确定删除这条记录？" description="删除后无法恢复" status="danger" @confirm="message='记录已删除'" @cancel="message='已取消'"><ZtButton status="danger">删除</ZtButton></ZtPopconfirm><ZtText>{{message}}</ZtText></div></DemoBlock><h2>异步确认</h2><DemoBlock :code="asyncCode" desc="Promise 完成前锁定按钮并显示进度；返回 false 或拒绝时保持打开。"><div class="confirm-row"><ZtPopconfirm title="提交审批？" :before-confirm="submit"><ZtButton :loading="saving">提交</ZtButton></ZtPopconfirm><ZtText status="info">{{message}}</ZtText></div></DemoBlock></div></template>
<style scoped>.confirm-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap}</style>
