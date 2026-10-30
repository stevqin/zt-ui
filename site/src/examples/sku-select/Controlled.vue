<script setup lang="ts">
import { ref } from 'vue'
import { ZtSkuSelect, ZtButton, type ZtSkuProduct, type ZtSkuSelection } from '@ztechjs/zt-ui'
import { productImage as image } from './images'

const value = ref<string | null>('KNIT-OAT-M')
const lastChange = ref('等待操作')
const products = ref<ZtSkuProduct[]>([{ product_no: 'KNIT-01', product_name: '针织上衣', skcs: [
  { skc: 'KNIT-OAT', color_code: 'oat', color_name: '燕麦色', image_url: image('#cdbf9f'), skus: [{ sku: 'KNIT-OAT-M', size_code: 'M' }, { sku: 'KNIT-OAT-L', size_code: 'L' }] },
  { skc: 'KNIT-INK', color_code: 'ink', color_name: '墨色', image_url: image('#35404f'), skus: [{ sku: 'KNIT-INK-M', size_code: 'M' }, { sku: 'KNIT-INK-L', size_code: 'L' }] },
] }])
function handleChange(selection: ZtSkuSelection | null) {
  lastChange.value = selection ? `${selection.spu.product_name} · ${selection.skc.color_name} · ${selection.sku.size_code}` : '选择已清空'
}
function toggleAvailability() {
  products.value = products.value.map(spu => ({ ...spu, skcs: spu.skcs.map(skc => ({ ...skc, skus: skc.skus.map(sku => sku.sku === 'KNIT-OAT-M' ? { ...sku, disabled: !sku.disabled } : sku) })) }))
}
</script>

<template>
  <div class="demo">
    <div class="actions">
      <ZtButton @click="value = 'KNIT-INK-L'">外部设为墨色 L</ZtButton>
      <ZtButton @click="value = null">外部清空</ZtButton>
      <ZtButton @click="toggleAvailability">切换燕麦色 M 可用状态</ZtButton>
    </div>
    <ZtSkuSelect v-model="value" :products="products" clearable @change="handleChange">
      <template #summary="{ selection }">
        {{ selection ? `当前规格：${selection.skc.color_name} / ${selection.sku.size_code}` : '等待选择规格' }}
      </template>
    </ZtSkuSelect>
    <p>受控值：{{ value ?? 'null' }}；最近一次 change：{{ lastChange }}</p>
    <p>外部有效赋值只同步显示；选择、清空和已选规格失效时触发 change。</p>
  </div>
</template>

<style scoped>
.demo { display: grid; gap: 16px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
p { margin: 0; line-height: 1.7; overflow-wrap: anywhere; }
</style>
