<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue'
import Example01 from './Example01.vue'
import Example01Code from './Example01.vue?raw'
import Remote from './Remote.vue'
import RemoteCode from './Remote.vue?raw'
import Batch from './Batch.vue'
import BatchCode from './Batch.vue?raw'
import Clearable from './Clearable.vue'
import ClearableCode from './Clearable.vue?raw'
</script>

<template>
  <div class="component-examples">
    <h3>本地搜索与分页</h3>
    <DemoBlock :code="Example01Code" desc="列表全选仅影响当前页可用项，跨页保留选择；查看可切换至已选列表。本地搜索先过滤完整 options，再分页。"><Example01 /></DemoBlock>
    <h3>远程分页与自定义选项</h3>
    <DemoBlock :code="RemoteCode" desc="remoteMethod 接收可判别请求：search 包含 keyword、从 1 开始的 page 和 pageSize，返回当前页 options 与总数 total；batch 接收去重后的 keywords 并返回全部精确 matches。option 插槽只替换左侧复选框之后的内容。"><Remote /></DemoBlock>
    <p>使用 v-model:page-size 保存用户选择的每页条数。搜索或修改每页条数会回到第 1 页，翻页立即请求；请求失败会保留草稿与上次成功结果，重新搜索即可恢复。</p>
    <h3>远程批量粘贴与部分匹配</h3>
    <DemoBlock :code="BatchCode" desc="进入批量粘贴，选择换行、逗号、分号或制表符。服务端按名称或值精确匹配完整数据集，跨页结果也能选中；匹配结果与已有草稿合并去重并立即提交。"><Batch /></DemoBlock>
    <p>部分匹配和零匹配仍会提交有效草稿并关闭面板，@ztechjs/zt-alert 消息会报告粘贴数量、去重数量、匹配数量和新增勾选数量。禁用项不会选中；批量请求失败会保留文本和草稿，供重试。</p>
    <h3>清空、宽度与外观继承</h3>
    <DemoBlock :code="ClearableCode" desc="数字 width 按 px 处理，也支持 100% 等 CSS 长度。摘要保持单行省略，悬停可查看全文。ConfigProvider 统一设置五档 size、light/dark 主题与 borderRadius，面板和嵌套选择器一并继承。"><Clearable /></DemoBlock>
    <p>clearable 显示清空按钮，实例 clear() 仅在 clearable=true 时生效，并执行相同操作：立即输出空值、change 和 clear，清空搜索并保留焦点。已打开的面板保持打开，草稿同步清空；后续取消不会恢复旧值。禁用或已为空时不重复清空。</p>
  </div>
</template>
