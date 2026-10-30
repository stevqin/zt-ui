<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ZtButton from '../button/ZtButton.vue'
import ZtImage from '../image/ZtImage.vue'
import ZtIcon from '../icon/ZtIcon.vue'
import { useZtSize } from '../config-provider/context'
import { skuCatalog, type SkuColorView, type SkuOptionView } from './model'
import type { ZtSkuSelectProps, ZtSkuSelectEmits, ZtSkuSelectSlots, ZtSkuSelection } from './types'
import './sku-select.scss'

defineOptions({ name: 'ZtSkuSelect' })
const props = withDefaults(defineProps<ZtSkuSelectProps>(), { disabled: false, clearable: false, showMainImage: true })
const emit = defineEmits<ZtSkuSelectEmits>()
defineSlots<ZtSkuSelectSlots>()
const size = useZtSize(props)
const catalog = computed(() => skuCatalog(props.products))
const draftProduct = ref<string>()
const draftColor = ref<string>()
const internalCode = ref<string | null>(null)
const selectedCode = computed(() => props.modelValue === undefined ? internalCode.value : props.modelValue)
function findSelection(code: string | null) {
  if (code == null) return null
  for (const spu of catalog.value) for (const skc of spu.skcs) {
    if (skc.disabled) continue
    const sku = skc.skus.find(item => item.id === code && !item.disabled)
    if (sku) return { spu, skc, sku }
  }
  return null
}
const resolved = computed(() => findSelection(selectedCode.value))
const product = computed(() => resolved.value?.spu ?? catalog.value.find(item => item.id === draftProduct.value) ?? catalog.value[0])
const firstColor = (item = product.value) => item?.skcs.find(color => !color.disabled)
const color = computed(() => resolved.value?.skc ?? product.value?.skcs.find(item => item.id === draftColor.value && !item.disabled) ?? firstColor())
const selection = computed<ZtSkuSelection | null>(() => resolved.value ? { spu: resolved.value.spu.source, skc: resolved.value.skc.source, sku: resolved.value.sku.source } : null)
const canClear = computed(() => Boolean(selection.value || color.value && color.value.id !== firstColor()?.id))
function publish(value: ZtSkuSelection | null, code: string | null = null) {
  if (props.modelValue === undefined) internalCode.value = code
  emit('update:modelValue', code)
  emit('change', value)
}
watch(() => props.modelValue, value => {
  const match = findSelection(value ?? null)
  if (match) { draftProduct.value = match.spu.id; draftColor.value = match.skc.id }
  else if (value != null) publish(null)
}, { immediate: true })
watch(() => props.products, () => {
  const match = findSelection(selectedCode.value)
  if (selectedCode.value !== null && !match) publish(null)
  if (match) { draftProduct.value = match.spu.id; draftColor.value = match.skc.id }
  if (!catalog.value.some(item => item.id === draftProduct.value)) { draftProduct.value = catalog.value[0]?.id; draftColor.value = undefined }
  if (!product.value?.skcs.some(item => item.id === draftColor.value && !item.disabled)) draftColor.value = undefined
}, { deep: true })
function selectColor(item: SkuColorView) {
  if (props.disabled || item.disabled || item.id === color.value?.id) return
  draftProduct.value = product.value?.id; draftColor.value = item.id
  if (selectedCode.value !== null) publish(null)
}
function selectSku(item: SkuOptionView) {
  if (props.disabled || item.disabled || !product.value || !color.value || color.value.disabled || item.id === selectedCode.value) return
  publish({ spu: product.value.source, skc: color.value.source, sku: item.source }, item.id)
}
function clear() {
  if (props.disabled || !canClear.value) return
  draftProduct.value = product.value?.id; draftColor.value = undefined
  publish(null)
}
</script>
<template>
  <section class="zt-sku-select" :class="[`zt-sku-select--${size}`, { 'is-disabled': disabled, 'zt-sku-select--without-main-image': !showMainImage }]" aria-label="商品规格选择">
    <template v-if="product">
      <header class="zt-sku-select__header">
        <div class="zt-sku-select__identity"><span class="zt-sku-select__product-no">{{ product.id }}</span><h3 class="zt-sku-select__title">{{ product.name }}</h3></div>
      </header>
        <div class="zt-sku-select__body">
          <div v-if="showMainImage" class="zt-sku-select__preview"><ZtImage v-if="color?.image" :src="color.image" :alt="`${product.name} ${color.name}`" fit="contain" :show-preview="false" /><span v-else class="zt-sku-select__placeholder"><ZtIcon name="image" /><span>暂无商品图片</span></span></div>
          <div class="zt-sku-select__details">
            <section class="zt-sku-select__group"><div class="zt-sku-select__label"><strong>颜色</strong><span>{{ color?.name ?? '暂无可选颜色' }}</span></div>
              <div class="zt-sku-select__colors" role="group" aria-label="颜色">
                <button v-for="item in product.skcs" :key="item.id" type="button" class="zt-sku-select__color" :class="{ 'is-selected': color?.id === item.id }" :data-color="item.colorCode" :data-skc="item.id" :disabled="disabled || item.disabled" :aria-label="item.name" :aria-pressed="color?.id === item.id" @click="selectColor(item)">
                  <span class="zt-sku-select__color-image"><ZtImage v-if="item.image" :src="item.image" :alt="item.name" fit="contain" :show-preview="false" /><ZtIcon v-else name="image" /><span v-if="color?.id === item.id" class="zt-sku-select__check" aria-hidden="true"><ZtIcon name="check" /></span></span>
                  <span class="zt-sku-select__color-name">{{ item.name }}</span>
                </button>
              </div>
            </section>
            <section class="zt-sku-select__group"><div class="zt-sku-select__label"><strong>尺码</strong><span>{{ resolved?.sku.name ?? (color ? '请选择尺码' : '暂无可选尺码') }}</span></div>
              <div class="zt-sku-select__sizes" role="group" aria-label="尺码"><button v-for="item in color?.skus ?? []" :key="item.id" type="button" class="zt-sku-select__size" :class="{ 'is-selected': resolved?.sku.id === item.id }" :data-sku="item.id" :disabled="disabled || item.disabled" :aria-pressed="resolved?.sku.id === item.id" @click="selectSku(item)">{{ item.name }}</button></div>
            </section>
          </div>
        </div>
        <footer class="zt-sku-select__footer"><div class="zt-sku-select__summary" aria-live="polite"><slot name="summary" :selection="selection"><span>{{ resolved ? `已选：${resolved.skc.name} / ${resolved.sku.name}` : color ? '请选择尺码' : '暂无可选规格' }}</span><code v-if="resolved">{{ resolved.sku.id }}</code></slot></div><ZtButton v-if="clearable" text :size="size" :disabled="disabled || !canClear" aria-label="清空选择" @click="clear">清空</ZtButton></footer>
    </template>
    <div v-else class="zt-sku-select__empty"><ZtIcon name="image" /><span>暂无商品</span></div>
  </section>
</template>
