<script setup lang="ts">
import { ref } from 'vue'
import { ZtTabs, ZtTabPane } from '@ztechjs/zt-ui'
import type { ZtComponentSize, ZtTabsStatus } from '@ztechjs/zt-ui'
const sizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large']
const statuses: ZtTabsStatus[] = ['default', 'primary', 'success', 'warning', 'danger', 'info']
const active = ref('orders')
const productVisible = ref(true)
function closeProduct() { productVisible.value = false; active.value = 'orders' }
</script>
<template>
  <div class="island-examples">
    <section v-for="size in sizes" :key="size">
      <h3>{{ size }}</h3>
      <ZtTabs v-model="active" type="island" :size="size" @tab-remove="closeProduct">
        <ZtTabPane name="orders" label="订单管理" />
        <ZtTabPane v-if="productVisible" name="products" label="商品档案" closable />
        <ZtTabPane name="disabled" label="停用页签" disabled />
      </ZtTabs>
    </section>
    <section v-for="status in statuses" :key="status">
      <h3>{{ status }}</h3>
      <ZtTabs v-model="active" type="island" :status="status" size="small">
        <ZtTabPane name="orders" label="订单管理" />
        <ZtTabPane name="products" label="商品档案" />
      </ZtTabs>
    </section>
  </div>
</template>
<style scoped>
.island-examples { display: grid; gap: 16px; padding: 16px; background: linear-gradient(135deg, #eaf1f8, #f7f9fb 50%, #eef4f1); }
h3 { margin: 0 0 8px; font-size: 12px; color: #626262; }
</style>
