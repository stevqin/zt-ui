<script setup lang="ts">
import { ref } from 'vue'
import { ZtDateTimePicker, ZtSwitch } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue, ZtDatePickerHoliday } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const value = ref<ZtDatePickerValue>(null)
const rangeValue = ref<ZtDatePickerValue>(null)
const limited = ref<ZtDatePickerValue>(null)
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const
const disabledDate = (date: Date) => date.getDay() === 0 || date.getDay() === 6
const codeBasic = sfc(`import { ref } from 'vue'
import { ZtDateTimePicker } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
const value = ref<ZtDatePickerValue>(null)`, `<ZtDateTimePicker v-model="value" clearable />`)
const codeRange = sfc(`import { ref } from 'vue'
import { ZtDateTimePicker } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
const rangeValue = ref<ZtDatePickerValue>(null)`, `<ZtDateTimePicker v-model="rangeValue" range clearable />`)
const codeDisabled = sfc(`import { ref } from 'vue'
import { ZtDateTimePicker } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
const limited = ref<ZtDatePickerValue>(null)
const disabledDate = (date: Date) => date.getDay() === 0 || date.getDay() === 6`, `<ZtDateTimePicker v-model="limited" :disabled-date="disabledDate" />
<ZtDateTimePicker model-value="2026-09-16 09:30:00" disabled />
<ZtDateTimePicker model-value="2026-09-16 09:30:00" readonly />`)
const codeSizes = sfc(`import { ZtDateTimePicker } from '@ztechjs/zt-ui'`, sizes.map(size => `<ZtDateTimePicker size="${size}" />`).join('\n'))

const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
const holidayValue = ref<ZtDatePickerValue>('2026-01-01 09:00:00')
const showHolidays = ref(true)
const holidays: ZtDatePickerHoliday[] = [
  { key: '2026-01-01', value: '元旦' },
  { key: '2026-01-15', value: '公司纪念日（示例）' },
]
const codeThemes = sfc(`import { ZtDateTimePicker } from '@ztechjs/zt-ui'`, statuses.map(status => `<ZtDateTimePicker status="${status}" model-value="2026-01-01 09:00:00" />`).join('\n'))
const codeHolidays = sfc(`import { ref } from 'vue'
import { ZtDateTimePicker, ZtSwitch } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue, ZtDatePickerHoliday } from '@ztechjs/zt-ui'
const holidayValue = ref<ZtDatePickerValue>('2026-01-01 09:00:00')
const showHolidays = ref(true)
const holidays: ZtDatePickerHoliday[] = [
  { key: '2026-01-01', value: '元旦' },
  { key: '2026-01-15', value: '公司纪念日（示例）' },
]`, `<ZtSwitch v-model="showHolidays" active-text="标识节假日" />
<ZtDateTimePicker v-model="holidayValue" :holidays="holidays" :show-holidays="showHolidays" status="success" clearable />`)
</script>
<template>
  <div class="doc-section">
    <h1>DateTimePicker 日期时间选择器</h1>
    <p>使用本地日历值 YYYY-MM-DD HH:mm:ss，不进行时区转换。支持单值和范围选择、清空、禁用日期及表单校验。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="空字符串和 null 显示占位提示。选择日期和时间后点击确定提交；时间精确到秒。同一天范围的结束时间不能早于开始时间。">
      <div class="date-demo-stack"><ZtDateTimePicker v-model="value" clearable /><span>当前值：{{ value ?? '未选择' }}</span></div>
    </DemoBlock>
    <h2>范围选择</h2>
    <DemoBlock :code="codeRange" desc="设置 range，使用左右双面板展示连续两个月，切换年月时联动；小屏下上下排列。依次选择开始和结束日期；反向选择会自动按日期排序。未完成的选择不会触发 change。">
      <div class="date-demo-stack"><ZtDateTimePicker v-model="rangeValue" range clearable /><span>当前范围：{{ rangeValue ?? '未选择' }}</span></div>
    </DemoBlock>
    <h2>禁用日期、禁用与只读</h2>
    <DemoBlock :code="codeDisabled" desc="此示例禁用周末。disabledDate 限制可选择的端点，范围中间可以包含禁用日期。">
      <div class="date-demo-stack"><ZtDateTimePicker v-model="limited" :disabled-date="disabledDate" /><ZtDateTimePicker model-value="2026-09-16 09:30:00" disabled /><ZtDateTimePicker model-value="2026-09-16 09:30:00" readonly /></div>
    </DemoBlock>
    <h2>五档尺寸</h2>
    <DemoBlock :code="codeSizes"><div class="date-demo-stack"><ZtDateTimePicker v-for="size in sizes" :key="size" :size="size" /></div></DemoBlock>
    <h2>主题颜色</h2>
    <DemoBlock :code="codeThemes" desc="status 统一控制焦点边框、选中日期、范围底色和确认按钮，默认 primary。">
      <div class="date-demo-stack"><ZtDateTimePicker v-for="status in statuses" :key="status" :status="status" model-value="2026-01-01 09:00:00" :placeholder="status" /></div>
    </DemoBlock>
    <h2>节假日标识</h2>
    <DemoBlock :code="codeHolidays" desc="holidays 数组中 key 为 YYYY-MM-DD，value 为节日名；长名称悬停查看。支持单值和范围，标识不改变可选状态，也不会自动禁用周末。">
      <div class="date-demo-stack"><ZtSwitch v-model="showHolidays" active-text="标识节假日" /><ZtDateTimePicker v-model="holidayValue" :holidays="holidays" :show-holidays="showHolidays" status="success" clearable /></div>
    </DemoBlock>
    <h2>API</h2>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型 / 默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td>modelValue / v-model</td><td>string | [string, string] | null / null</td><td>YYYY-MM-DD HH:mm:ss；范围为两个同格式字符串。清空返回 null。无效值显示占位提示。</td></tr>
      <tr><td>range</td><td>boolean / false</td><td>范围选择</td></tr>
      <tr><td>placeholder</td><td>string</td><td>随单值、范围模式提供中文默认提示</td></tr>
      <tr><td>clearable</td><td>boolean / false</td><td>显示清空按钮</td></tr>
      <tr><td>disabled / readonly</td><td>boolean / false</td><td>禁用 / 只读</td></tr>
      <tr><td>disabledDate</td><td>(date: Date) =&gt; boolean</td><td>返回 true 禁止选择该日期</td></tr>
      <tr><td>size</td><td>mini | small | default | medium | large</td><td>控制输入框和日历面板尺寸；默认继承 FormItem 尺寸</td></tr>
      <tr><td>status</td><td>default | primary | success | warning | danger | info</td><td>颜色主题，默认 primary；兼容原 error 校验状态，danger 仅代表红色主题</td></tr>
      <tr><td>holidays</td><td>{ key: string; value: string }[] / []</td><td>key 是 YYYY-MM-DD 日期，value 是节日名；重复日期使用最后一项，无效日期和空名称忽略</td></tr>
      <tr><td>showHolidays</td><td>boolean / true</td><td>是否展示传入的节假日名称；不内置节假日数据</td></tr>
    </tbody></table>
    <h3>事件</h3>
    <p><code>update:modelValue</code>、<code>change</code>：提交完整值；<code>clear</code>：清空；<code>visible-change</code>：展开状态；<code>focus</code>、<code>blur</code>：焦点进入与离开。</p>
    <h3>方法与键盘</h3>
    <p>通过 ref 调用 focus、blur、open、close、clear。输入框按 Enter、空格或 ↓ 打开；日历内方向键移动，Enter 选择，Esc 取消未提交的选择。点击顶部年份进入十年网格，选择年份后进入月份网格，也可点击月份直接选择。年月网格支持方向键、Home / End、PageUp / PageDown；选年月不会提交日期值。年份支持 1–9999。</p>
  </div>
</template>
<style scoped>
.date-demo-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; width: 100%; }
.date-demo-stack > span { color: #737d8b; font-size: 12px; overflow-wrap: anywhere; }
</style>
