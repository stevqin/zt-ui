<script setup lang="ts">
import { ref } from 'vue'
import { ZtSkuInput, ZtButton, ZtSwitch, type ZtSkuProduct, type ZtSkuQuantities, type ZtSkuInputChange } from '@ztechjs/zt-ui'
const productImage = (fill: string, width = 240, height = 240) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 240 240"><rect width="${width}" height="${height}" fill="#f4f5f7"/><path d="M82 52 54 72 32 110 61 127 76 105 76 192 164 192 164 105 179 127 208 110 186 72 158 52Q120 76 82 52Z" fill="${fill}"/><path d="M102 57Q120 91 138 57" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="4"/></svg>`)}`
const product: ZtSkuProduct = {
  product_no: 'TEE-2601',
  product_name: '基础棉质短袖',
  skcs: [
    {
      skc: 'TEE-2601-023', color_code: '023', color_name: '绯红',
      image_url: productImage('#c66664'),
      skus: [
        { sku: 'TEE-023-XS', size_code: 'XS' },
        { sku: 'TEE-023-S', size_code: 'S' },
        { sku: 'TEE-023-M', size_code: 'M' },
        { sku: 'TEE-023-L', size_code: 'L' },
        { sku: 'TEE-023-XL', size_code: 'XL' },
        { sku: 'TEE-023-XXL', size_code: 'XXL' },
        { sku: 'TEE-023-XXXL', size_code: 'XXXL' },
      ],
    },
    {
      skc: 'TEE-2601-000', color_code: '000', color_name: '曜黑',
      image_url: productImage('#404957'),
      skus: [
        { sku: 'TEE-000-XS', size_code: 'XS' },
        { sku: 'TEE-000-S', size_code: 'S' },
        { sku: 'TEE-000-M', size_code: 'M' },
        { sku: 'TEE-000-L', size_code: 'L' },
        { sku: 'TEE-000-XL', size_code: 'XL' },
        { sku: 'TEE-000-XXL', size_code: 'XXL' },
        { sku: 'TEE-000-XXXL', size_code: 'XXXL' },
      ],
    },
  ],
}
const showProductInfo = ref(true)
const quantities = ref<ZtSkuQuantities>({})
const result = ref<ZtSkuInputChange>()
</script>
<template>
  <div class="demo" data-demo="sku-input-basic">
    <label class="info-toggle"><ZtSwitch v-model="showProductInfo" /> 显示商品信息</label>
    <ZtSkuInput :show-product-info="showProductInfo" v-model="quantities" :product="product" @change="result = $event" />
    <div class="actions"><span>空白或 0 表示不订购，输入正整数数量。</span><ZtButton size="small" :disabled="!Object.keys(quantities).length" @click="quantities = {}">清空数量</ZtButton></div>
    <pre>{{ JSON.stringify(quantities, null, 2) }}</pre>
    <p v-if="result">最近更新：{{ result.skuCount }} 个 SKU，共 {{ result.totalQuantity }} 件；change.entries 提供原始 SPU、SKC、SKU 和 quantity。</p>
  </div>
</template>
<style scoped>
.info-toggle { display: flex; gap: 8px; align-items: center; font-size: 13px; } .demo { display: grid; gap: 16px; min-width: 0; } .actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 13px; color: var(--doc-muted); } pre { margin: 0; padding: 14px; background: var(--doc-soft); border-radius: 6px; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 12px; } p { margin: 0; font-size: 13px; color: var(--doc-muted); }
</style>
