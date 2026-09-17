<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtPopover, ZtText } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const manual=ref(false)
const basicCode=sfc("import { ZtButton, ZtPopover } from '@ztechjs/zt-ui'",'<ZtPopover placement="top" width="240">\n  <ZtButton>查看详情</ZtButton>\n  <template #content>这里可以放置富文本或操作。</template>\n</ZtPopover>')
const triggersCode=sfc("import { ZtButton, ZtPopover } from '@ztechjs/zt-ui'",'<ZtPopover trigger="hover"><ZtButton>Hover</ZtButton><template #content>悬停内容</template></ZtPopover>\n<ZtPopover trigger="focus"><ZtButton>Focus</ZtButton><template #content>聚焦内容</template></ZtPopover>')
const manualCode=sfc("import { ref } from 'vue'\nimport { ZtButton, ZtPopover } from '@ztechjs/zt-ui'\nconst visible = ref(false)",'<ZtButton @click="visible = !visible">切换</ZtButton>\n<ZtPopover v-model:visible="visible" trigger="manual"><ZtButton>锚点</ZtButton><template #content>受控内容</template></ZtPopover>')
</script>
<template><div class="doc-section"><h1>Popover 弹出框</h1><p>在触发元素附近展示补充信息或轻量操作，自动翻转并限制在可视区域内。</p><h2>基础用法</h2><DemoBlock :code="basicCode"><ZtPopover placement="top" width="240"><ZtButton>查看详情</ZtButton><template #content><ZtText weight="semibold">订单摘要</ZtText><p>待发货 3 件，总金额 ¥1,280。</p></template></ZtPopover></DemoBlock><h2>触发方式</h2><DemoBlock :code="triggersCode"><div class="popover-row"><ZtPopover trigger="hover"><ZtButton>Hover</ZtButton><template #content>悬停内容</template></ZtPopover><ZtPopover trigger="focus"><ZtButton>Focus</ZtButton><template #content>聚焦内容</template></ZtPopover><ZtPopover trigger="click" placement="right"><ZtButton>Click</ZtButton><template #content>点击外部或按 Escape 关闭。</template></ZtPopover></div></DemoBlock><h2>手动控制</h2><DemoBlock :code="manualCode"><div class="popover-row"><ZtButton @click="manual=!manual">切换</ZtButton><ZtPopover v-model:visible="manual" trigger="manual"><ZtButton>锚点</ZtButton><template #content>受控内容</template></ZtPopover></div></DemoBlock></div></template>
<style scoped>.popover-row{display:flex;gap:14px;align-items:center;flex-wrap:wrap}</style>
