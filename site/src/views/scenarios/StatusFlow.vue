<script setup lang="ts">
import { ref } from 'vue'
import { ZtSteps, ZtStep, ZtTag, ZtButton } from '@ztechjs/zt-ui'
const active=ref(0)
const titles=['填写申请','主管审核','处理完成']
</script>
<template><div><ZtSteps :active="active" finish-status="success" align-center><ZtStep v-for="title in titles" :key="title" :title="title" /></ZtSteps><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:28px"><ZtTag :status="active===3?'success':'primary'">{{active===3?'流程已完成':titles[active]}}</ZtTag><ZtButton status="primary" :disabled="active===3" @click="active++">{{active===2?'完成处理':'下一步'}}</ZtButton><ZtButton :disabled="active===0" @click="active=0">重新开始</ZtButton></div><p role="status" style="margin-top:16px">{{active===3?'申请已完成全部处理。':'当前阶段：'+titles[active]+'。点击按钮模拟推进。'}}</p></div></template>
