<script setup lang="ts">
import { ref } from 'vue'
import { ZtSkuSelect, ZtSwitch, type ZtSkuProduct } from '@ztechjs/zt-ui'
import { productImage as image } from './images'

const value = ref<string | null>('SHIRT-BLUE-M')
const disabled = ref(false)
const products: ZtSkuProduct[] = [{ product_no: 'SHIRT-01', product_name: '舒适衬衫', skcs: [
  { skc: 'SHIRT-BLUE', color_code: 'blue', color_name: '浅蓝', image_url: image('#91adce'), skus: [{ sku: 'SHIRT-BLUE-S', size_code: 'S', disabled: true }, { sku: 'SHIRT-BLUE-M', size_code: 'M' }, { sku: 'SHIRT-BLUE-L', size_code: 'L' }] },
  { skc: 'SHIRT-GREY', color_code: 'grey', color_name: '浅灰（暂不可选）', image_url: image('#b9bbbe'), disabled: true, skus: [{ sku: 'SHIRT-GREY-M', size_code: 'M' }] },
  { skc: 'SHIRT-WHITE', color_code: 'white', color_name: '白色（尺码售罄）', image_url: image('#eeeae2'), skus: [{ sku: 'SHIRT-WHITE-S', size_code: 'S', disabled: true }, { sku: 'SHIRT-WHITE-M', size_code: 'M', disabled: true }] },
] }]
</script>

<template>
  <div class="demo">
    <label class="toggle"><ZtSwitch v-model="disabled" aria-label="禁用整个选择面板" />禁用整个面板</label>
    <ZtSkuSelect v-model="value" :products="products" :disabled="disabled" clearable />
    <p>浅蓝 S 码不可用；浅灰颜色已禁用；白色的全部尺码不可用，因此颜色也不可选。</p>
  </div>
</template>

<style scoped>
.demo { display: grid; gap: 16px; }
.toggle { display: flex; align-items: center; gap: 10px; }
p { margin: 0; line-height: 1.7; }
</style>
