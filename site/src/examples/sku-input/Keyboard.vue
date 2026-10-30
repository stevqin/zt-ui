<script setup lang="ts">
import { ref } from 'vue'
import { ZtSkuInput, ZtButton, type ZtSkuProduct, type ZtSkuQuantities, type ZtSkuInputInstance } from '@ztechjs/zt-ui'
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
const quantities = ref<ZtSkuQuantities>({})
const panel = ref<ZtSkuInputInstance>()
const sample = '2\t4\t6\t8\t6\t4\t2\n1\t3\t5\t7\t5\t3\t1'
const message = ref('')
async function copy() {
  try { await navigator.clipboard.writeText(sample); message.value = '已复制，请在第一格粘贴。' }
  catch { message.value = '请选中下方数据并手动复制。' }
}
</script>
<template>
  <div class="demo" data-demo="sku-input-keyboard">
    <div class="actions"><ZtButton size="small" @click="panel?.focus()">聚焦第一格</ZtButton><ZtButton size="small" @click="copy">复制示例数据</ZtButton><span>{{ message }}</span></div>
    <ZtSkuInput ref="panel" v-model="quantities" :product="product" :show-image="false" />
    <p>Tab / Shift+Tab：前后切换；Enter / Shift+Enter：连续录入；↑ / ↓：同尺码上下移动。聚焦时自动选中已有数量，左右方向键保留光标移动。支持 Excel 制表符与换行粘贴，超出面板的部分忽略。</p>
    <pre>{{ sample }}</pre>
  </div>
</template>
<style scoped>
.demo { display: grid; gap: 16px; min-width: 0; } .actions { display: flex; align-items: center; gap: 10px; } p, .actions span { color: var(--doc-muted); font-size: 13px; margin: 0; } pre { margin: 0; padding: 14px; overflow: auto; color: var(--doc-text); background: var(--doc-soft); border-radius: 6px; font-size: 12px; }
</style>
