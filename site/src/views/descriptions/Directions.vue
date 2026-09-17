<script setup lang="ts">
import { ref } from 'vue';
import { ZtDescriptions, ZtDescriptionsItem, ZtSwitch } from '@ztechjs/zt-ui';
const vertical = ref(false),
  border = ref(false);
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtSwitch v-model="vertical" active-text="标签在上" /><ZtSwitch
        v-model="border"
        active-text="显示边框"
      />
    </div>
    <ZtDescriptions
      :direction="vertical ? 'vertical' : 'horizontal'"
      :border="border"
      :column="3"
      :label-width="100"
    >
      <template #title>会员资料</template><template #extra>更新于今天</template>
      <ZtDescriptionsItem label="姓名">林青</ZtDescriptionsItem>
      <ZtDescriptionsItem label="等级"
        ><template #label>★ 会员等级</template>金卡</ZtDescriptionsItem
      >
      <ZtDescriptionsItem label="门店" :label-width="80">杭州门店</ZtDescriptionsItem>
      <ZtDescriptionsItem label="地址" :span="3" class-name="address"
        >浙江省杭州市上城区</ZtDescriptionsItem
      >
    </ZtDescriptions>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
