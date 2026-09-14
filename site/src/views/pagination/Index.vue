<script setup lang="ts">
import { ref } from 'vue'
import { ZtPagination, ZtSwitch } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

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
const codeSize = sfc(paginationImport, `<ZtPagination size="small" layout="prev, pager, next" :total="100" />
<ZtPagination size="small" background layout="prev, pager, next" :total="100" />
<ZtPagination disabled layout="prev, pager, next" :total="100" />`)
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

    <h2>完整功能</h2>
    <DemoBlock :code="codeComplete" desc="通过 layout 自由组合总数、每页条数、页码和跳转输入框。">
      <ZtPagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="400" layout="total, sizes, prev, pager, next, jumper" />
    </DemoBlock>

    <h2>尺寸与禁用</h2>
    <DemoBlock :code="codeSize" desc="size 支持 small、default 和 large；disabled 禁止所有交互。">
      <div class="pagination-stack"><ZtPagination size="small" layout="prev, pager, next" :total="100" /><ZtPagination size="small" background layout="prev, pager, next" :total="100" /><ZtPagination disabled layout="prev, pager, next" :total="100" /></div>
    </DemoBlock>

    <h2>左右对齐与插槽</h2>
    <DemoBlock :code="codeAlign" desc="layout 中的 -> 将后续模块推到右侧，slot 插入自定义内容。">
      <ZtPagination layout="slot, ->, prev, pager, next" :total="100"><span class="pagination-note">已选择 12 条</span></ZtPagination>
    </DemoBlock>

    <h2>单页隐藏</h2>
    <DemoBlock :code="codeHide" desc="hide-on-single-page 在只有一页时隐藏分页栏。">
      <div class="pagination-stack"><ZtSwitch v-model="hideSingle" active-text="隐藏单页" /><ZtPagination :total="5" :hide-on-single-page="hideSingle" layout="prev, pager, next" /></div>
    </DemoBlock>

    <h2>API</h2>
    <h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>currentPage</code></td><td><code>number</code></td><td><code>1</code></td><td>当前页，支持 v-model</td></tr>
      <tr><td><code>pageSize</code></td><td><code>number</code></td><td><code>10</code></td><td>每页条数，支持 v-model</td></tr>
      <tr><td><code>total</code></td><td><code>number</code></td><td><code>0</code></td><td>数据总数</td></tr>
      <tr><td><code>pageCount</code></td><td><code>number</code></td><td>—</td><td>总页数，优先于 total</td></tr>
      <tr><td><code>pagerCount</code></td><td><code>number</code></td><td><code>7</code></td><td>最多显示的页码按钮数</td></tr>
      <tr><td><code>pageSizes</code></td><td><code>number[]</code></td><td><code>[10, 20, 30, 40, 50, 100]</code></td><td>每页条数选项</td></tr>
      <tr><td><code>layout</code></td><td><code>string</code></td><td><code>prev, pager, next, jumper, ->, total</code></td><td>模块排列方式</td></tr>
      <tr><td><code>size</code></td><td><code>small | default | large</code></td><td><code>default</code></td><td>组件尺寸</td></tr>
      <tr><td><code>background</code></td><td><code>boolean</code></td><td><code>false</code></td><td>按钮背景样式</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用分页</td></tr>
      <tr><td><code>hideOnSinglePage</code></td><td><code>boolean</code></td><td><code>false</code></td><td>单页时隐藏</td></tr>
      <tr><td><code>prevText / nextText</code></td><td><code>string</code></td><td>—</td><td>上一页、下一页文字</td></tr>
    </tbody></table>

    <h3>Events</h3>
    <table class="doc-table"><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>update:currentPage</code></td><td><code>page</code></td><td>更新当前页</td></tr>
      <tr><td><code>update:pageSize</code></td><td><code>size</code></td><td>更新每页条数</td></tr>
      <tr><td><code>current-change</code></td><td><code>page</code></td><td>当前页变化</td></tr>
      <tr><td><code>size-change</code></td><td><code>size</code></td><td>每页条数变化</td></tr>
      <tr><td><code>change</code></td><td><code>(page, size)</code></td><td>页码或每页条数变化</td></tr>
      <tr><td><code>prev-click / next-click</code></td><td><code>page</code></td><td>上一页或下一页按钮触发</td></tr>
    </tbody></table>

    <h3>Slots</h3>
    <table class="doc-table"><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>layout 包含 slot 时显示的自定义内容</td></tr></tbody></table>
  </div>
</template>

<style scoped>
.pagination-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; width: 100%; }
.pagination-note { color: #626b78; font-size: 13px; white-space: nowrap; }
</style>
