<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui';
const brandOptions: ZtSelectOption[] = [
  { label: '玖姿 JUZUI', value: 'JZ' },
  { label: '尹默 IMM', value: 'IMM' },
  { label: '安正 ANZHENG', value: 'AZ' },
  { label: '摩萨克 MOISSAC', value: 'MSK', disabled: true },
];
const selectedBrand = ref('JZ');
const regionOptions: ZtSelectOption[] = [
  { label: '华东一区 · 18 家门店', value: 'east-1' },
  { label: '华东二区 · 13 家门店', value: 'east-2' },
  { label: '华北区 · 16 家门店', value: 'north' },
];
const selectedRegions = ref<Array<string | number | boolean>>(['east-1']);
function searchRegions(keyword: string): Promise<ZtSelectOption[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const normalized = keyword.trim().toLowerCase();
      resolve(regionOptions.filter((option) => option.label.toLowerCase().includes(normalized)));
    }, 700);
  });
}
</script>

<template>
  <div class="select-demo-grid">
    <ZtSelect v-model="selectedBrand" :options="brandOptions" clearable aria-label="主推品牌">
      <template #prefix><strong class="slot-label">主推品牌</strong></template>
      <template #option="{ option, selected, disabled }">
        <span class="slot-option">
          <span>{{ option.label }}</span>
          <small>{{
            disabled ? '本季暂停订货' : selected ? '当前主推' : `品牌代码 ${option.value}`
          }}</small>
        </span>
      </template>
      <template #selected="{ option }">主推：{{ option.label }}</template>
      <template #footer><span class="slot-footer">数据范围：2026 秋冬订货会</span></template>
    </ZtSelect>
    <ZtSelect
      v-model="selectedRegions"
      :options="regionOptions"
      multiple
      remote
      :remote-method="searchRegions"
      :debounce="0"
      clearable
      aria-label="经营区域"
      placeholder="搜索有权限的经营区域"
    >
      <template #tag="{ option, remove }">
        <span>{{ option.label }}</span>
        <button
          type="button"
          class="slot-tag-remove"
          :aria-label="'移除经营区域：' + option.label"
          @click.stop="remove"
        >
          移除
        </button>
      </template>
      <template #empty>没有匹配的经营区域，请检查关键词。</template>
      <template #loading>正在同步经营区域和门店数...</template>
    </ZtSelect>
  </div>
</template>

<style scoped>
.select-demo-stack {
  display: grid;
  gap: 10px;
  width: min(100%, 480px);
}
.select-demo-stack > span {
  color: #6b7280;
  font-size: 13px;
}
.select-demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.select-size-list {
  display: grid;
  align-items: start;
  gap: 12px;
  width: min(100%, 480px);
}
.slot-label {
  white-space: nowrap;
  color: #475569;
  font-size: 12px;
}
.slot-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
.slot-option small {
  color: #64748b;
}
.slot-footer {
  color: #64748b;
  font-size: 12px;
}
.slot-tag-remove {
  border: 0;
  padding: 0 2px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
@media (max-width: 720px) {
  .select-demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
