<script setup lang="ts">
import { ref } from 'vue'
import { ZtSkuSelect, type ZtSkuProduct } from '@ztechjs/zt-ui'
import { productImage } from './images'

const value = ref<string | null>(null)
const products: ZtSkuProduct[] = [{
  spu: 'VEST-01', product_name: '轻盈针织背心', skcs: [{
    skc: 'VEST-CREAM', color_code: 'cream', color_name: '奶油白', image_url: productImage('#e6dac4'),
    skus: [{ sku: 'VEST-CREAM-S', size_code: 'S', size_name: 'S' }, { sku: 'VEST-CREAM-M', size_code: 'M', size_name: 'M' }],
  }],
}]
</script>

<template>
  <div class="demo" data-demo="sku-single">
    <ZtSkuSelect v-model="value" :products="products" clearable />
    <p>单色 SKU：{{ value ?? '尚未选择' }}</p>
    <p class="hint">单个颜色也会默认选中，选择尺码后才确定 SKU。</p>
  </div>
</template>

<style scoped>
.demo { display: grid; gap: 12px; min-width: 0; }
p { margin: 0; overflow-wrap: anywhere; }
.hint { color: var(--glass-muted); font-size: 13px; line-height: 1.7; }
</style>
