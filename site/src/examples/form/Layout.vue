<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtForm, ZtFormItem, ZtInput, ZtSwitch } from '@ztechjs/zt-ui';
const top = ref(false);
const model = reactive({ name: '', department: '', keyword: '' });
</script>
<template>
  <div class="demo">
    <ZtSwitch v-model="top" active-text="顶部标签" />
    <ZtForm :model="model" :label-position="top ? 'top' : 'right'" label-width="auto" @submit.prevent>
      <ZtFormItem label="姓名" prop="name"><ZtInput v-model="model.name" /></ZtFormItem>
      <ZtFormItem label="所属工作小组" prop="department"><ZtInput v-model="model.department" /></ZtFormItem>
      <ZtFormItem label="独立宽度" label-width="100px"><ZtInput placeholder="此项覆盖全局宽度" /></ZtFormItem>
    </ZtForm>
    <p>auto 将同一表单的横向标签对齐到最宽标签；数字宽度按 px 处理，也可使用 CSS 长度。顶部布局不使用标签宽度。</p>
    <ZtForm :model="model" inline label-position="left" :label-width="64" @submit.prevent>
      <ZtFormItem label="关键字" prop="keyword"><ZtInput v-model="model.keyword" placeholder="行内筛选" /></ZtFormItem>
    </ZtForm>
  </div>
</template>
<style scoped>.demo { display: grid; gap: 16px; } p { margin: 0; }</style>
