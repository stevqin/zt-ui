<script setup lang="ts">
import { ref } from 'vue'
import { ZtSkuInput, ZtSwitch, type ZtSkuProduct, type ZtSkuQuantities } from '@ztechjs/zt-ui'
const productImage = (fill: string, width = 240, height = 240) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 240 240"><rect width="${width}" height="${height}" fill="#f4f5f7"/><path d="M82 52 54 72 32 110 61 127 76 105 76 192 164 192 164 105 179 127 208 110 186 72 158 52Q120 76 82 52Z" fill="${fill}"/><path d="M102 57Q120 91 138 57" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="4"/></svg>`)}`
const constrained: ZtSkuProduct = {
  product_no: 'TEE-2601',
  product_name: '基础棉质短袖',
  skcs: [
    {
      skc: 'TEE-2601-023', color_code: '023', color_name: '绯红',
      image_url: productImage('#c66664'),
      skus: [
        { sku: 'TEE-023-XS', size_code: 'XS' },
        { sku: 'TEE-023-S', size_code: 'S' },
        { sku: 'TEE-023-M', size_code: 'M', disabled: true },
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
        { sku: 'TEE-000-S', size_code: 'S' },
        { sku: 'TEE-000-M', size_code: 'M' },
        { sku: 'TEE-000-L', size_code: 'L' },
        { sku: 'TEE-000-XL', size_code: 'XL' },
        { sku: 'TEE-000-XXL', size_code: 'XXL' },
        { sku: 'TEE-000-XXXL', size_code: 'XXXL' },
      ],
    },
    {
      skc: 'TEE-2601-050', color_code: '050', color_name: '雾灰（停订）',
      image_url: productImage('#b2b6bc'), disabled: true,
      skus: [
        { sku: 'TEE-050-S', size_code: 'S' },
        { sku: 'TEE-050-M', size_code: 'M' },
        { sku: 'TEE-050-L', size_code: 'L' },
      ],
    },
  ],
}
const readonly = ref(false), disabled = ref(false)
const quantities = ref<ZtSkuQuantities>({ 'TEE-023-S': 6, 'TEE-023-M': 3 })
</script>
<template>
  <div class="demo" data-demo="sku-input-constraints">
    <div class="controls"><label>只读 <ZtSwitch v-model="readonly" /></label><label>全部禁用 <ZtSwitch v-model="disabled" /></label><span>单 SKU 上限 20 件；绯红 M 禁用，曜黑无 XS。</span></div>
    <ZtSkuInput v-model="quantities" :product="constrained" :max="20" :readonly="readonly" :disabled="disabled" :show-image="false" />
    <p>禁用规格已有数量仍展示并计入合计，无法修改。缺失规格显示“—”，粘贴时也保留其矩阵位置。</p>
  </div>
</template>
<style scoped>
.demo { display: grid; gap: 16px; min-width: 0; } .controls, label { display: flex; gap: 12px; align-items: center; } .controls { flex-wrap: wrap; font-size: 13px; } label { gap: 8px; } p, .controls > span { color: var(--doc-muted); font-size: 13px; margin: 0; }
</style>
