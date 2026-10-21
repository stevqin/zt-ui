<script setup lang="ts">
import { ZtTree, type ZtTreeNode } from "@ztechjs/zt-ui";
const data: ZtTreeNode[] = [
  {
    key: "workspace",
    label: "共享工作区",
    children: [
      {
        key: "guide",
        label:
          "跨部门协作与资料归档使用说明：长标题可以自然换行，不会与下一行内容重叠。",
        description: "支持自定义说明、多行文字和其他高度不固定的节点内容。",
      },
      {
        key: "report",
        label: "月度运营报告",
        description: "包含销售、库存与渠道三个分析维度。",
      },
      { key: "archive", label: "历史归档" },
    ],
  },
];
</script>
<template>
  <div class="demo">
    <ZtTree
      :data="data"
      :default-expanded-keys="['workspace']"
      auto-item-height
      :item-height="32"
      :height="260"
    >
      <template #default="{ node }">
        <div>{{ node.label }}</div>
        <p v-if="node.description" class="description">
          {{ node.description }}
        </p>
      </template>
    </ZtTree>
    <p class="hint">
      auto-item-height 仅对非虚拟树生效；item-height
      为最小行高，虚拟树继续使用固定行高。
    </p>
  </div>
</template>
<style scoped>
.demo {
  max-width: 360px;
}
.description {
  margin: 4px 0 0;
  color: var(--zt-muted, #626262);
  font-size: 12px;
}
.hint {
  color: var(--zt-muted, #626262);
  font-size: 12px;
  line-height: 1.6;
}
</style>
