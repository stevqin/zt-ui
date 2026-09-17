<script setup lang="ts">
import { ZtStatistic } from '@ztechjs/zt-ui';
</script>
<template>
  <div class="stats">
    <ZtStatistic
      title="销售额"
      :value="1234567.8"
      :precision="2"
      prefix="¥"
    /><ZtStatistic
      title="同比增长"
      :value="18.25"
      :precision="1"
      suffix="%"
    /><ZtStatistic
      title="客单价"
      :value="345.6"
      :precision="2"
      group-separator=" "
      decimal-separator=","
    />
  </div>
</template>
<style scoped>
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}
</style>
