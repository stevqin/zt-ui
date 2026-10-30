<script setup lang="ts">
import { ref } from 'vue'
import { ZtSkuSelect, ZtSwitch, ZtSlider, type ZtSkuProduct } from '@ztechjs/zt-ui'
import { productImage } from './images'
const showMainImage = ref(true)
const width = ref(840)
const value = ref<string | null>(null)
const products: ZtSkuProduct[] = [{ product_no: 'LOOK-01', product_name: '商品主图展示', skcs: [
  { skc: 'LOOK-BLUE', color_name: '雾蓝（竖图）', image_url: productImage('#8faebf', 240, 360), skus: [{ sku: 'LOOK-BLUE-M', size_code: 'M' }, { sku: 'LOOK-BLUE-L', size_code: 'L' }] },
  { skc: 'LOOK-SAND', color_name: '浅沙（横图）', image_url: productImage('#cfbfa5', 480, 240), skus: [{ sku: 'LOOK-SAND-M', size_code: 'M' }, { sku: 'LOOK-SAND-L', size_code: 'L' }] },
] }]
</script>
<template>
  <div class="demo" data-demo="sku-preview">
    <div class="controls"><label><ZtSwitch v-model="showMainImage" /> 显示主图（PC）</label><div class="width-control"><span>面板宽度</span><ZtSlider v-model="width" :min="600" :max="960" :step="20" :show-tooltip="false" aria-label="主图演示面板宽度" /><output>{{ width }}px</output></div></div>
    <div class="panel-host" :style="{ width: `${width}px` }"><ZtSkuSelect v-model="value" :products="products" :show-main-image="showMainImage" /></div>
    <p>切换颜色比较横图和竖图。主图保持原图比例，随面板宽度缩放并限制最大高度；关闭后规格区占满，颜色缩略图和已选 SKU 不受影响。窄容器自动隐藏主图。</p>
    <p>SKU：{{ value ?? '尚未选择' }}</p>
  </div>
</template>
<style scoped>
.demo { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; min-width: 0; }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 24px; font-size: 13px; }
label { display: flex; align-items: center; gap: 8px; }
.width-control { display: flex; align-items: center; gap: 12px; flex: 1 1 250px; min-width: 0; max-width: 360px; }
.width-control .zt-slider { flex: 1; width: auto; min-width: 60px; max-width: 140px; }
output { min-width: 46px; color: var(--doc-muted); }
.panel-host { max-width: 100%; }
p { margin: 0; font-size: 13px; color: var(--doc-muted); }
</style>
