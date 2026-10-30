<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const values = ['杭州', '上海', '北京'];
const selected = ref<unknown[]>(['杭州']);
const all = computed({
  get: () => selected.value.length === values.length,
  set: (value) => {
    selected.value = value ? [...values] : [];
  },
});
</script>

<template>
  <div class="demo">
    <ZtCheckbox v-model="all" :indeterminate="selected.length > 0 && !all">
      全部城市
    </ZtCheckbox>
    <ZtCheckboxGroup v-model="selected" segmented>
      <ZtCheckbox v-for="value in values" :key="value" :value="value">
        {{ value }}
      </ZtCheckbox>
    </ZtCheckboxGroup>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
