<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ZtSkuSelect, ZtSelect, type ZtSkuSelection, type ZtSkuProduct } from '@ztechjs/zt-ui'
import { productImage as image } from './images'

const lastChange = ref('等待选择规格')
function handleChange(selection: ZtSkuSelection | null) {
  lastChange.value = selection ? `${selection.spu.product_no} / ${selection.skc.skc} / ${selection.sku.sku} · ${selection.skc.color_name} · ${selection.sku.size_code}` : '选择已清空'
}
const value = ref<string | null>(null)
const products: ZtSkuProduct[] = [
  { product_no: 'TEE-01', product_name: '日常短袖', skcs: [
    { skc: 'TEE-SKY', color_code: 'sky', color_name: '雾蓝', image_url: image('#8faebf'), skus: [{ sku: 'TEE-SKY-S', size_code: 'S' }, { sku: 'TEE-SKY-M', size_code: 'M' }, { sku: 'TEE-SKY-L', size_code: 'L' }] },
    { skc: 'TEE-SAND', color_code: 'sand', color_name: '浅沙', image_url: image('#cfbfa5'), skus: [{ sku: 'TEE-SAND-S', size_code: 'S' }, { sku: 'TEE-SAND-M', size_code: 'M' }] },
  ] },
  { product_no: 'TOP-02', product_name: '轻薄上衣', skcs: [
    { skc: 'TOP-SAGE', color_code: 'sage', color_name: '鼠尾草绿', image_url: image('#9cafa0'), skus: [{ sku: 'TOP-SAGE-M', size_code: 'M' }, { sku: 'TOP-SAGE-L', size_code: 'L' }] },
  ] },
]

const productNo = ref('TEE-01')
const productOptions = products.map(product => ({ value: product.product_no!, label: product.product_name! }))
const currentProducts = computed(() => products.filter(product => product.product_no === productNo.value))
watch(productNo, () => { value.value = null })
</script>

<template>
  <div class="demo" data-demo="sku-basic">
    <label class="product-choice"><span>演示商品</span><ZtSelect v-model="productNo" :options="productOptions" aria-label="演示商品" /></label>
    <ZtSkuSelect v-model="value" :products="currentProducts" clearable @change="handleChange" />
    <p>SKU：{{ value ?? '尚未选择' }}</p>
    <p>面板只选择当前商品的颜色与尺码；上方商品选择由业务页面控制。</p>
    <p>规格事件：{{ lastChange }}</p>
  </div>
</template>

<style scoped>
.demo { display: grid; gap: 12px; }
p { margin: 0; overflow-wrap: anywhere; }
.product-choice { display: grid; gap: 8px; min-width: 0; font-size: 13px; }
</style>
