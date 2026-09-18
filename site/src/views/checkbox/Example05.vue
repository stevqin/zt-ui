<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtCheckboxStatus } from '@ztechjs/zt-ui';
import { computed, ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtCheckboxStatus>('primary');
const cities = ['上海', '杭州', '宁波', '南京'];
const selectedCities = ref(['上海', '杭州']);
const allChecked = computed(
  () => selectedCities.value.length === cities.length,
);
const indeterminate = computed(
  () => selectedCities.value.length > 0 && !allChecked.value,
);
function toggleAll(value: boolean) {
  selectedCities.value = value ? [...cities] : [];
}
</script>

<template>
  <div class="demo-row">
    <ZtCheckbox
      :status="demoStatus"
      :model-value="allChecked"
      :indeterminate="indeterminate"
      @change="toggleAll"
      >全选</ZtCheckbox
    >
  </div>
  <div class="demo-row">
    <ZtCheckboxGroup :status="demoStatus" v-model="selectedCities"
      ><ZtCheckbox
        :status="demoStatus"
        v-for="city in cities"
        :key="city"
        :value="city"
        >{{ city }}</ZtCheckbox
      ></ZtCheckboxGroup
    >
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
