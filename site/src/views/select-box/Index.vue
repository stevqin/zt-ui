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
    <p>默认向下展开，下方不足且上方空间更多时向上翻转；窗口缩放、页面滚动、分页和远程结果变化都会重新测量。搜索、摘要、分页和确认区域固定，选项列表是唯一纵向滚动区域，面板本身不滚动，也不增加页面溢出。加载、空列表、请求失败、批量粘贴和仅看已选遵循同一约束。</p>
    <p>若视口高度小于固定区域所需高度，则约束并裁剪面板，不启用整面板滚动，也不覆盖触发器；极小高度下部分操作暂不可见。underline 显式 true / false 优先，省略时继承最近 Form。</p>
    <h3>本地搜索与分页</h3>
    <DemoBlock :code="Example01Code" desc="列表全选仅影响当前页可用项，跨页保留选择；查看可切换至已选列表。本地搜索先过滤完整 options，再分页。"><Example01 /></DemoBlock>
    <h3>远程分页与自定义选项</h3>
    <DemoBlock :code="RemoteCode" desc="remoteMethod 接收可判别请求：search 包含 keyword、从 1 开始的 page 和 pageSize，返回当前页 options 与总数 total；batch 接收去重后的 keywords 并返回全部精确 matches。option 插槽只替换左侧复选框之后的内容。"><Remote /></DemoBlock>
    <p>使用 v-model:page-size 保存用户选择的每页条数。搜索或修改每页条数会回到第 1 页，翻页立即请求；请求失败会保留草稿与上次成功结果，重新搜索即可恢复。</p>
    <h3>远程批量粘贴与部分匹配</h3>
    <DemoBlock :code="BatchCode" desc="进入批量粘贴，选择换行、逗号、分号或制表符。点击确定请求接口精确匹配完整数据集，跨页结果也能选中；匹配项并入草稿后进入已选列表供检查，再次确定才提交，通过 Message 反馈匹配与勾选统计。"><Batch /></DemoBlock>
    <p>批量页点击确定会请求接口完成校验，匹配项自动勾选后进入「已选择」列表供检查，再次点击确定才正式提交。全部匹配提示成功，部分或零匹配提示警告；统计通过 Message 非阻断反馈。禁用项按未匹配处理；批量请求失败会保留文本和草稿，供重试。</p>
    <h3>清空、宽度与外观继承</h3>
    <DemoBlock :code="ClearableCode" desc="clearable 清空与 clear()；readonly / disabled 时隐藏清空图标。数字 width 按 px 处理，也支持 100% 等 CSS 长度。摘要保持单行省略，悬停可查看全文。ConfigProvider 统一设置五档 size、light/dark 主题与 borderRadius。"><Clearable /></DemoBlock>
    <p>clearable 显示清空按钮，实例 clear() 仅在 clearable=true 时生效，并执行相同操作：立即输出空值、change 和 clear，清空搜索并保留焦点。已打开的面板保持打开，草稿同步清空；后续取消不会恢复旧值。禁用或已为空时不重复清空。</p>
  </div>
</template>
