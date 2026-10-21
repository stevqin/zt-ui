<script setup lang="ts">
import { ref } from "vue";
import {
  ZtTree,
  ZtIcon,
  ZtInput,
  ZtCheckbox,
  ZtButton,
  type ZtTreeNode,
  type ZtTreeKey,
} from "@ztechjs/zt-ui";
const name = ref("项目资料");
const subscribed = ref(false);
const count = ref(0);
const selected = ref<ZtTreeKey[]>([]);
const data: ZtTreeNode[] = [
  {
    key: "root",
    label: "节点内交互",
    children: [
      { key: "rename", label: "资料名称", checkable: false },
      { key: "subscribe", label: "订阅更新", checkable: false },
      { key: "action", label: "查看记录", checkable: false },
    ],
  },
];
</script>
<template>
  <div class="demo">
    <ZtTree
      v-model:selected-keys="selected"
      :data="data"
      :default-expanded-keys="['root']"
      auto-item-height
    >
      <template #expand-icon="{ expanded, loading, disabled }">
        <ZtIcon
          :name="loading ? 'refresh' : expanded ? 'minus' : 'add'"
          :spin="loading"
          :style="{ opacity: disabled ? 0.45 : 1 }"
        />
      </template>
      <template #default="{ node, disabled }">
        <label v-if="node.key === 'rename'" class="field">
          <span>{{ node.label }}</span
          ><ZtInput
            v-model="name"
            size="small"
            :disabled="disabled"
            aria-label="资料名称"
          />
        </label>
        <ZtCheckbox
          v-else-if="node.key === 'subscribe'"
          v-model="subscribed"
          :disabled="disabled"
          >订阅资料更新</ZtCheckbox
        >
        <ZtButton
          v-else-if="node.key === 'action'"
          size="small"
          :disabled="disabled"
          @click="count++"
          >查看记录</ZtButton
        >
        <span v-else>{{ node.label }}</span>
      </template>
    </ZtTree>
    <p role="status">
      名称：{{ name }} · 订阅：{{ subscribed ? "是" : "否" }} · 操作次数：{{
        count
      }}
      · 选中节点：{{ selected }}
    </p>
    <p>
      Tab 进入行内控件后可正常输入、移动光标和按空格或 Enter
      操作，无需手动阻止事件冒泡。聚焦树本身时仍使用方向键导航。
    </p>
  </div>
</template>
<style scoped>
.demo {
  max-width: 500px;
}
.field {
  display: flex;
  align-items: center;
}
.field > span {
  flex-shrink: 0;
  margin-right: 8px;
}
p {
  font-size: 12px;
  color: var(--zt-muted, #626262);
  line-height: 1.6;
}
</style>
