<script setup lang="ts">
import { computed, ref } from 'vue'
import { ZtSkuInput, ZtSkuSelect, type ZtSkuProduct, type ZtSkuQuantities, type ZtSkuInputChange } from '@ztechjs/zt-ui'
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
const sku = ref<string | null>(null)
const quantities = ref<ZtSkuQuantities>({})
const result = ref<ZtSkuInputChange>()
const selectedQuantity = computed(() => sku.value ? quantities.value[sku.value] ?? 0 : 0)
</script>
<template>
  <div class="demo" data-demo="sku-input-shared">
    <ZtSkuInput v-model="quantities" :product="product" :size-order="['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']" @change="result = $event">
      <template #summary="{ totalQuantity, skuCount }"><span>订货明细：{{ skuCount }} 个 SKU</span><strong>{{ totalQuantity }} 件</strong></template>
    </ZtSkuInput>
    <details><summary>使用同一份商品数据预览单个 SKU</summary><ZtSkuSelect v-model="sku" :products="[product]" /><p>当前 SKU：{{ sku ?? '未选择' }}；录入数量：{{ selectedQuantity }} 件。</p></details>
    <p>两种面板共享 product_no / skc / sku 数据。选择面板绑定单个 SKU，数量面板绑定数量映射；商品切换由业务层处理。</p>
    <pre v-if="result">{{ JSON.stringify(result.entries.map(item => ({ product_no: item.spu.product_no, skc: item.skc.skc, sku: item.sku.sku, quantity: item.quantity })), null, 2) }}</pre>
  </div>
</template>
<style scoped>
.demo { display: grid; gap: 16px; min-width: 0; } details { border-top: 1px solid var(--doc-line); padding-top: 12px; } summary { cursor: pointer; margin-bottom: 12px; } p { margin: 0; font-size: 13px; color: var(--doc-muted); } pre { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 12px; }
</style>
