<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtIcon, ZtInput } from '@ztechjs/zt-ui';
import { ztIconNames } from '@ztechjs/zt-ui';
const query = ref(''),
  selected = ref('search');
const filtered = computed(() =>
  ztIconNames.filter((name) => name.includes(query.value.trim().toLowerCase())),
);
</script>
<template>
  <div>
    <ZtInput
      v-model="query"
      placeholder="搜索图标，如 arrow、user"
      aria-label="搜索图标"
    />
    <p>共 {{ filtered.length }} 个图标；当前选择：{{ selected }}</p>
    <div class="icons">
      <button v-for="name in filtered" :key="name" type="button" @click="selected = name">
        <ZtIcon :name="name" />
        <span>{{ name }}</span>
      </button>
    </div>
    <pre>&lt;ZtIcon name="{{ selected }}" /&gt;</pre>
  </div>
</template>
<style scoped>
.icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
  gap: 8px;
}
.icons button {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 12px 4px;
  border: 1px solid #8884;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.icons .zt-icon {
  font-size: 24px;
}
.icons span {
  font-size: 12px;
}
</style>
