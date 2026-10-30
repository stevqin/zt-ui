<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputOtp } from '@ztechjs/zt-ui';
const code = ref('');
</script>

<template>
  <div class="demo">
    <ZtInputOtp
      v-model="code"
      :length="8"
      :integer-only="false"
      mask
      separator="-"
      :separator-after="4"
    />
    <p>绑定值：{{ code }}</p>
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
