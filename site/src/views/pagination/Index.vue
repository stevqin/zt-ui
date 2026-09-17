<script setup lang="ts">
import { ref } from 'vue'
import { ZtPagination, ZtSwitch } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
const codeStatus = sfc(`import { ZtPagination } from '@ztechjs/zt-ui'`, statuses.map(status => `<ZtPagination status="${status}" :total="100" layout="prev, pager, next" />`).join('\n'))

const currentPage = ref(5)
const pageSize = ref(20)
const hideSingle = ref(true)

const paginationImport = `import { ZtPagination } from '@ztechjs/zt-ui'`
const codeBasic = sfc(paginationImport, `<ZtPagination layout="prev, pager, next" :total="50" />
<ZtPagination layout="prev, pager, next" :total="1000" />`)
const codeBackground = sfc(paginationImport, `<ZtPagination background layout="prev, pager, next" :total="1000" />`)
const codeComplete = sfc(`import { ref } from 'vue'
import { ZtPagination } from '@ztechjs/zt-ui'

const currentPage = ref(5)
const pageSize = ref(20)`, `<ZtPagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :page-sizes="[10, 20, 50, 100]"
  :total="400"
  layout="total, sizes, prev, pager, next, jumper"
/>`)
const codeSize = sfc(paginationImport, `<ZtPagination size="mini" layout="prev, pager, next" :total="100" />
<ZtPagination size="small" layout="prev, pager, next" :total="100" />
<ZtPagination layout="prev, pager, next" :total="100" />
<ZtPagination size="medium" background layout="prev, pager, next" :total="100" />
<ZtPagination size="large" layout="prev, pager, next" :total="100" />`)
const codeAlign = sfc(paginationImport, `<ZtPagination layout="slot, ->, prev, pager, next">
  <span>已选择 12 条</span>
</ZtPagination>`)
const codeHide = sfc(`import { ref } from 'vue'
import { ZtPagination, ZtSwitch } from '@ztechjs/zt-ui'

const hideSingle = ref(true)`, `<ZtSwitch v-model="hideSingle" active-text="隐藏单页" />
<ZtPagination :total="5" :hide-on-single-page="hideSingle" layout="prev, pager, next" />`)
</script>

<template>
  <div class="doc-section">
    <h1>Pagination 分页</h1>
    <p>当数据量较多时，通过分页控制每次展示的数据范围。</p>

    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="当页数超过 pager-count 时，中间页码会自动折叠。">
      <div class="pagination-stack"><ZtPagination layout="prev, pager, next" :total="50" /><ZtPagination layout="prev, pager, next" :total="1000" /></div>
    </DemoBlock>

    <h2>带背景色</h2>
    <DemoBlock :code="codeBackground" desc="background 为按钮增加轻量背景和边框。">
      <ZtPagination background layout="prev, pager, next" :total="1000" />
    </DemoBlock>

    <h2>主题颜色</h2>
    <DemoBlock :code="codeStatus" desc="status 与 Button 的六种主题一致，默认 primary。当前页悬停保留主题高亮。">
      <div class="pagination-stack"><ZtPagination v-for="status in statuses" :key="status" :status="status" :total="100" layout="prev, pager, next" /></div>
    </DemoBlock>
    <h2>完整功能</h2>
    <DemoBlock :code="codeComplete" desc="通过 layout 自由组合总数、每页条数、页码和跳转输入框。">
      <ZtPagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="400" layout="total, sizes, prev, pager, next, jumper" />
    </DemoBlock>

    <h2>尺寸与禁用</h2>
    <DemoBlock :code="codeSize" desc="size 支持五档尺寸；disabled 可以和任意尺寸组合并禁止全部交互。">
      <div class="pagination-stack"><ZtPagination size="mini" layout="prev, pager, next" :total="100" /><ZtPagination size="small" layout="prev, pager, next" :total="100" /><ZtPagination layout="prev, pager, next" :total="100" /><ZtPagination size="medium" background layout="prev, pager, next" :total="100" /><ZtPagination size="large" layout="prev, pager, next" :total="100" /><ZtPagination disabled layout="prev, pager, next" :total="100" /></div>
    </DemoBlock>

    <h2>左右对齐与插槽</h2>
    <DemoBlock :code="codeAlign" desc="layout 中的 -> 将后续模块推到右侧，slot 插入自定义内容。">
      <ZtPagination layout="slot, ->, prev, pager, next" :total="100"><span class="pagination-note">已选择 12 条</span></ZtPagination>
    </DemoBlock>

    <h2>单页隐藏</h2>
    <DemoBlock :code="codeHide" desc="hide-on-single-page 在只有一页时隐藏分页栏。">
      <div class="pagination-stack"><ZtSwitch v-model="hideSingle" active-text="隐藏单页" /><ZtPagination :total="5" :hide-on-single-page="hideSingle" layout="prev, pager, next" /></div>
    </DemoBlock>

    </div>
</template>

<style scoped>
.pagination-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; width: 100%; }
.pagination-note { color: #626b78; font-size: 13px; white-space: nowrap; }
</style>
