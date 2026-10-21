<script setup lang="ts">
import { ref } from "vue";
import { ZtTree, type ZtTreeKey, type ZtTreeNode } from "@ztechjs/zt-ui";
const checked = ref<ZtTreeKey[]>([]);
const data: ZtTreeNode[] = [
  {
    key: "workspace",
    label: "文档工作区",
    children: [
      {
        key: "group",
        label: "资料分组（仅展示，不参与勾选）",
        checkable: false,
        children: [
          { key: "guide", label: "使用说明" },
          { key: "report", label: "运营报告" },
        ],
      },
      {
        key: "hint",
        label: "提示：勾选工作区会联动下方可选文档",
        checkable: false,
      },
      { key: "locked", label: "受限文档（已禁用）", disabled: true },
    ],
  },
];
</script>
<template>
  <div class="demo">
    <ZtTree
      v-model:checked-keys="checked"
      :data="data"
      :default-expanded-keys="['workspace', 'group']"
      checkable
      auto-item-height
    />
    <p role="status">勾选结果：{{ checked }}</p>
    <p>
      展示节点没有勾选框，也不会因空格键或父子联动进入结果；其可勾选子节点仍参与联动。可通过
      fields.checkable 映射字段名。
    </p>
  </div>
</template>
<style scoped>
.demo {
  max-width: 480px;
}
p {
  font-size: 12px;
  color: var(--zt-muted, #626262);
  line-height: 1.6;
}
</style>
