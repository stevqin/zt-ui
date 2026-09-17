<script setup lang="ts">
import { ref } from 'vue'
import { ZtDatePicker, ZtSwitch } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue, ZtDatePickerHoliday } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const value = ref<ZtDatePickerValue>(null)
const rangeValue = ref<ZtDatePickerValue>(null)
const limited = ref<ZtDatePickerValue>(null)
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const
const disabledDate = (date: Date) => date.getDay() === 0 || date.getDay() === 6
const codeBasic = sfc(`import { ref } from 'vue'
import { ZtDatePicker } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
const value = ref<ZtDatePickerValue>(null)`, `<ZtDatePicker v-model="value" clearable />`)
const codeRange = sfc(`import { ref } from 'vue'
import { ZtDatePicker } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
const rangeValue = ref<ZtDatePickerValue>(null)`, `<ZtDatePicker v-model="rangeValue" range clearable />`)
const codeDisabled = sfc(`import { ref } from 'vue'
import { ZtDatePicker } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
const limited = ref<ZtDatePickerValue>(null)
const disabledDate = (date: Date) => date.getDay() === 0 || date.getDay() === 6`, `<ZtDatePicker v-model="limited" :disabled-date="disabledDate" />
<ZtDatePicker model-value="2026-09-16" disabled />
<ZtDatePicker model-value="2026-09-16" readonly />`)
const codeSizes = sfc(`import { ZtDatePicker } from '@ztechjs/zt-ui'`, sizes.map(size => `<ZtDatePicker size="${size}" />`).join('\n'))

const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
const holidayValue = ref<ZtDatePickerValue>('2026-01-01')
const showHolidays = ref(true)
const holidays: ZtDatePickerHoliday[] = [
  { key: '2026-01-01', value: '元旦' },
  { key: '2026-01-15', value: '公司纪念日（示例）' },
]
const codeThemes = sfc(`import { ZtDatePicker } from '@ztechjs/zt-ui'`, statuses.map(status => `<ZtDatePicker status="${status}" model-value="2026-01-01" />`).join('\n'))
const codeHolidays = sfc(`import { ref } from 'vue'
import { ZtDatePicker, ZtSwitch } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue, ZtDatePickerHoliday } from '@ztechjs/zt-ui'
const holidayValue = ref<ZtDatePickerValue>('2026-01-01')
const showHolidays = ref(true)
const holidays: ZtDatePickerHoliday[] = [
  { key: '2026-01-01', value: '元旦' },
  { key: '2026-01-15', value: '公司纪念日（示例）' },
]`, `<ZtSwitch v-model="showHolidays" active-text="标识节假日" />
<ZtDatePicker v-model="holidayValue" :holidays="holidays" :show-holidays="showHolidays" status="success" clearable />`)
</script>
<template>
  <div class="doc-section">
    <h1>DatePicker 日期选择器</h1>
    <p>使用本地日历值 YYYY-MM-DD，不进行时区转换。支持单值和范围选择、清空、禁用日期及表单校验。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="空字符串和 null 显示占位提示。选择完成后立即提交。">
      <div class="date-demo-stack"><ZtDatePicker v-model="value" clearable /><span>当前值：{{ value ?? '未选择' }}</span></div>
    </DemoBlock>
    <h2>范围选择</h2>
    <DemoBlock :code="codeRange" desc="设置 range，使用左右双面板展示连续两个月，切换年月时联动；小屏下上下排列。依次选择开始和结束日期；反向选择会自动按日期排序。未完成的选择不会触发 change。">
      <div class="date-demo-stack"><ZtDatePicker v-model="rangeValue" range clearable /><span>当前范围：{{ rangeValue ?? '未选择' }}</span></div>
    </DemoBlock>
    <h2>禁用日期、禁用与只读</h2>
    <DemoBlock :code="codeDisabled" desc="此示例禁用周末。disabledDate 限制可选择的端点，范围中间可以包含禁用日期。">
      <div class="date-demo-stack"><ZtDatePicker v-model="limited" :disabled-date="disabledDate" /><ZtDatePicker model-value="2026-09-16" disabled /><ZtDatePicker model-value="2026-09-16" readonly /></div>
    </DemoBlock>
    <h2>五档尺寸</h2>
    <DemoBlock :code="codeSizes"><div class="date-demo-stack"><ZtDatePicker v-for="size in sizes" :key="size" :size="size" /></div></DemoBlock>
    <h2>主题颜色</h2>
    <DemoBlock :code="codeThemes" desc="status 统一控制焦点边框、选中日期、范围底色和确认按钮，默认 primary。">
      <div class="date-demo-stack"><ZtDatePicker v-for="status in statuses" :key="status" :status="status" model-value="2026-01-01" :placeholder="status" /></div>
    </DemoBlock>
    <h2>节假日标识</h2>
    <DemoBlock :code="codeHolidays" desc="holidays 数组中 key 为 YYYY-MM-DD，value 为节日名；长名称悬停查看。支持单值和范围，标识不改变可选状态，也不会自动禁用周末。">
      <div class="date-demo-stack"><ZtSwitch v-model="showHolidays" active-text="标识节假日" /><ZtDatePicker v-model="holidayValue" :holidays="holidays" :show-holidays="showHolidays" status="success" clearable /></div>
    </DemoBlock>
    </div>
</template>
<style scoped>
.date-demo-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; width: 100%; }
.date-demo-stack > span { color: #737d8b; font-size: 12px; overflow-wrap: anywhere; }
</style>
