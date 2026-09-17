<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtTransfer,
  type ZtTransferKey,
  type ZtTransferOption,
} from '@ztechjs/zt-ui';
const value = ref<ZtTransferKey[]>([2]),
  last = ref('尚未移动');
const data: ZtTransferOption[] = Array.from({ length: 12 }, (_, i) => ({
  key: i + 1,
  label: `门店 ${i + 1}`,
  disabled: i === 3,
}));
function change(
  keys: ZtTransferKey[],
  direction: 'left' | 'right',
  moved: ZtTransferKey[],
) {
  last.value = `向${direction === 'right' ? '右' : '左'}移动 ${moved.join('、')}，目标共 ${keys.length} 项`;
}
</script>
<template>
  <ZtTransfer
    v-model="value"
    :data="data"
    filterable
    :titles="['全部门店', '授权门店']"
    @change="change"
    ><template #default="{ option }"
      ><span
        >{{ option.label }} <small v-if="option.disabled">不可移动</small></span
      ></template
    ><template #left-footer>搜索后全选仅作用于当前可见项</template
    ><template #right-footer
      >已授权 {{ value.length }} 家门店</template
    ></ZtTransfer
  >
  <p aria-live="polite">{{ last }}</p>
  <p>受控目标 key：{{ value }}</p>
</template>
