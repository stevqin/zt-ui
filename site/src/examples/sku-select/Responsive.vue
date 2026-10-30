<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ZtButton, ZtModal, ZtSkuSelect, ZtSelect, type ZtSkuProduct } from '@ztechjs/zt-ui'
import { productImage } from './images'

const open = ref(false)
const value = ref<string | null>(null)
const products: ZtSkuProduct[] = [
  { product_no: 'COAT-01', product_name: '轻暖绗缝外套', skcs: [
    { skc: 'COAT-ROSE', color_code: 'rose', color_name: '灰粉（暂不可选）', disabled: true, image_url: productImage('#c9acb2'), skus: [{ sku: 'COAT-ROSE-M', size_code: 'M' }] },
    { skc: 'COAT-SAGE', color_code: 'sage', color_name: '浅苔绿', image_url: productImage('#a3b5a1'), skus: [{ sku: 'COAT-SAGE-S', size_code: 'S' }, { sku: 'COAT-SAGE-M', size_code: 'M' }, { sku: 'COAT-SAGE-L', size_code: 'L' }] },
    { skc: 'COAT-INK', color_code: 'ink', color_name: '深海蓝', image_url: productImage('#445a73'), skus: [{ sku: 'COAT-INK-M', size_code: 'M' }, { sku: 'COAT-INK-L', size_code: 'L' }] },
  ] },
  { product_no: 'CARDIGAN-02', product_name: '柔软开衫', skcs: [
    { skc: 'CARDIGAN-OAT', color_code: 'oat', color_name: '暖燕麦', image_url: productImage('#cbbda4'), skus: [{ sku: 'CARDIGAN-OAT-S', size_code: 'S' }, { sku: 'CARDIGAN-OAT-M', size_code: 'M' }] },
  ] },
]

const productNo = ref('COAT-01')
const productOptions = products.map(product => ({ value: product.product_no!, label: product.product_name! }))
const currentProducts = computed(() => products.filter(product => product.product_no === productNo.value))
watch(productNo, () => { value.value = null })
</script>

<template>
  <div class="demo" data-demo="sku-responsive">
    <div class="intro">
      <div><span class="eyebrow">商品规格</span><p>在弹层中挑选颜色与尺码</p></div>
      <ZtButton status="primary" @click="open = true">打开商品选择</ZtButton>
    </div>
    <p class="hint">面板仅选择当前商品的颜色与尺码；宽屏展示商品大图，手机聚焦颜色卡片。</p>
    <p class="result">弹层 SKU：{{ value ?? '尚未选择' }}</p>
    <ZtModal v-model="open" title="选择商品规格" aria-label="选择商品规格" subtitle="先挑颜色，再选择适合的尺码" :width="860" :fullscreen-below="480" :body-padding="16">
      <div class="modal-content">
        <label class="product-choice"><span>演示商品</span><ZtSelect v-model="productNo" :options="productOptions" aria-label="演示商品" /></label>
        <ZtSkuSelect v-model="value" :products="currentProducts" clearable />
      </div>
    </ZtModal>
  </div>
</template>

<style scoped>
.demo { display: grid; gap: 12px; min-width: 0; }
.intro { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 20px; border: 1px solid var(--glass-line); border-radius: 16px; background: var(--glass-panel, rgba(255,255,255,.45)); }
.eyebrow { color: var(--glass-muted); font-size: 12px; letter-spacing: .12em; }
p { margin: 0; overflow-wrap: anywhere; line-height: 1.7; }
.intro p { margin-top: 5px; font-size: 16px; font-weight: 600; }
.hint { color: var(--glass-muted); font-size: 13px; }
.modal-content { display: grid; gap: 16px; min-width: 0; }
.result { font-size: 13px; }
.product-choice { display: grid; gap: 8px; min-width: 0; font-size: 13px; }
</style>
