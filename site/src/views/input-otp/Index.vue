<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import FormExample from './FormExample.vue';
import formCode from './FormExample.vue?raw';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import Example04 from './Example04.vue';
import Example04Code from './Example04.vue?raw';
import Example05 from './Example05.vue';
import Example05Code from './Example05.vue?raw';
import Example06 from './Example06.vue';
import Example06Code from './Example06.vue?raw';
import Example07 from './Example07.vue';
import Example07Code from './Example07.vue?raw';
import Methods from './Methods.vue';
import MethodsCode from './Methods.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock
      :code="Example01Code"
      desc="默认 6 位数字，输入完整时触发 complete。可直接粘贴 012345，空格和分隔字符会自动过滤。"
      ><Example01
    /></DemoBlock>
    <h3>位数与分隔符</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>字符验证码</h3>
    <DemoBlock :code="Example03Code" desc="integer-only=false 可输入字母等非空白字符。"
      ><Example03
    /></DemoBlock>
    <h3>遮蔽显示</h3>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>
    <h3>尺寸</h3>
    <DemoBlock :code="Example05Code"><Example05 /></DemoBlock>
    <h3>主题颜色</h3>
    <DemoBlock :code="Example06Code"><Example06 /></DemoBlock>
    <h3>禁用与只读</h3>
    <DemoBlock :code="Example07Code"><Example07 /></DemoBlock>
    <h3>表单联动</h3>
    <DemoBlock
      :code="formCode"
      desc="继承 Form 的尺寸与禁用状态，输入变化和失焦分别触发 change / blur 校验。complete 表示填满，不代表验证码验证成功。"
      ><FormExample
    /></DemoBlock>
    <h3>键盘与自动填充</h3>
    <p>
      Tab 聚焦整个验证码字段，← / → 移动到相邻格，Home / End
      跳到首格或末尾。点击已有格可替换字符；Backspace / Delete 删除后会将后续字符前移。Ctrl /
      Command + A 可全选；完整验证码粘贴到任意格都会替换整个值。
    </p>
    <p>
      默认
      autocomplete="one-time-code"；自动填充取决于浏览器、设备和短信格式。组件不会自动发送验证码或提交表单。length
      变化和外部 v-model 更新不会触发 complete。
    </p>

    <h3>事件反馈与实例方法</h3>
    <DemoBlock :code="MethodsCode" desc=""><Methods /></DemoBlock>
  </div>
</template>

<style scoped>
.otp-feedback {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  color: var(--zt-text-muted);
  font-size: 13px;
}
.otp-examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.otp-examples > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.otp-examples > div > span {
  color: var(--zt-text-muted);
  font-size: 12px;
}
</style>
