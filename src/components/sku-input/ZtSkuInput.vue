<script setup lang="ts" generic="T extends ZtSkuInputValueType = 'object'">
import { computed, inject, nextTick, ref, useId, watch } from 'vue'
import ZtInput from '../input/ZtInput.vue'
import ZtImage from '../image/ZtImage.vue'
import ZtIcon from '../icon/ZtIcon.vue'
import { ztFormItemKey, ztFormGroupKey } from '../form/context'
import { useZtSize } from '../config-provider/context'
import { buildSkuMatrix, currentQuantities, parseQuantity, quantityLimit, quantityResult } from './model'
import type { ZtSkuInputProps, ZtSkuInputEmits, ZtSkuInputSlots, ZtSkuInputInstance, ZtSkuQuantities, ZtSkuInputValueType } from './types'
import './sku-input.scss'

defineOptions({ name: 'ZtSkuInput' })
const props = withDefaults(defineProps<ZtSkuInputProps<T>>(), { max: 999999, disabled: false, readonly: false, showImage: true, showSummary: true, showProductInfo: true })
const emit = defineEmits<ZtSkuInputEmits<T>>()
defineSlots<ZtSkuInputSlots<T>>()
const root = ref<HTMLElement>()
const inputId = useId()
const internal = ref<ZtSkuQuantities>({})
const formItem = inject(ztFormItemKey, undefined)
const formGroup = inject(ztFormGroupKey, undefined)
const effectiveDisabled = computed(() => props.disabled || formItem?.disabled.value || formGroup?.disabled.value || false)
const size = useZtSize(props, () => formItem?.size.value)
const composing = new WeakSet<HTMLInputElement>()
const matrix = computed(() => buildSkuMatrix(props.product, props.sizeOrder))
const limit = computed(() => quantityLimit(props.max))
const values = computed(() => currentQuantities(matrix.value, props.modelValue ?? internal.value, limit.value))
const result = computed(() => quantityResult<T>(props.product, matrix.value, values.value, props.valueType))
const productNo = computed(() => props.product.product_no ?? props.product.spu)
watch(productNo, () => { internal.value = {} })
const editable = (row: number, col: number) => Boolean(!effectiveDisabled.value && !props.readonly && matrix.value.rows[row]?.cells[col] && !matrix.value.rows[row]?.cells[col]?.disabled)
const valueAt = (row: number, col: number) => values.value[matrix.value.rows[row]?.cells[col]?.source.sku ?? ''] ?? 0
const rowTotal = (row: number) => matrix.value.rows[row]?.cells.reduce((total, _, col) => total + valueAt(row, col), 0) ?? 0
const columnTotal = (col: number) => matrix.value.rows.reduce((total, _, row) => total + valueAt(row, col), 0)
function publish(next: ZtSkuQuantities) {
  const previous = values.value
  const keys = Object.keys(next)
  if (keys.length === Object.keys(previous).length && keys.every(key => previous[key] === next[key])) return
  if (props.modelValue === undefined) internal.value = next
  const output = quantityResult<T>(props.product, matrix.value, next, props.valueType)
  emit('update:modelValue', output.values)
  emit('change', output)
  void nextTick(() => formItem?.validate('change'))
}
function write(next: ZtSkuQuantities, row: number, col: number, text: string) {
  if (!editable(row, col)) return
  const quantity = parseQuantity(text, limit.value)
  if (quantity === null) return
  const sku = matrix.value.rows[row]!.cells[col]!.source.sku
  if (quantity > 0) next[sku] = quantity
  else delete next[sku]
}
function onInput(event: Event, row: number, col: number) {
  const input = event.target as HTMLInputElement
  if (composing.has(input) || (event as InputEvent).isComposing) return
  const next = { ...values.value }
  write(next, row, col, input.value)
  publish(next)
  void nextTick(() => { input.value = valueAt(row, col) ? String(valueAt(row, col)) : '' })
}
function onCompositionEnd(event: CompositionEvent, row: number, col: number) {
  composing.delete(event.target as HTMLInputElement)
  onInput(event, row, col)
}
function onPaste(event: ClipboardEvent, row: number, col: number) {
  if (!editable(row, col) || !event.clipboardData) return
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n').replace(/\n$/, '')
  const next = { ...values.value }
  text.split('\n').forEach((line, r) => line.split('\t').forEach((quantity, c) => write(next, row + r, col + c, quantity)))
  publish(next)
}
function focusCell(row: number, col: number) {
  if (!editable(row, col)) return false
  const input = root.value?.querySelector<HTMLInputElement>(`[data-row="${row}"][data-col="${col}"] input`)
  if (!input) return false
  input.focus(); input.select()
  return true
}
function onKeydown(event: KeyboardEvent, row: number, col: number) {
  if (!editable(row, col) || event.isComposing || event.ctrlKey || event.altKey || event.metaKey) return
  if (event.key === 'Enter') {
    event.preventDefault()
    const width = matrix.value.columns.length
    const direction = event.shiftKey ? -1 : 1
    for (let index = row * width + col + direction; index >= 0 && index < matrix.value.rows.length * width; index += direction) if (focusCell(Math.floor(index / width), index % width)) break
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    const direction = event.key === 'ArrowUp' ? -1 : 1
    for (let r = row + direction; r >= 0 && r < matrix.value.rows.length; r += direction) if (focusCell(r, col)) break
  }
}
const focus: ZtSkuInputInstance['focus'] = sku => {
  for (let row = 0; row < matrix.value.rows.length; row++) for (let col = 0; col < matrix.value.columns.length; col++) {
    if (sku ? matrix.value.rows[row]!.cells[col]?.source.sku === sku : editable(row, col)) return focusCell(row, col)
  }
  return false
}
defineExpose<ZtSkuInputInstance>({ focus })
</script>
<template>
  <section ref="root" class="zt-sku-input" :class="[`zt-sku-input--${size}`, { 'is-disabled': effectiveDisabled, 'is-readonly': readonly, 'zt-sku-input--without-product-info': !showProductInfo }]" aria-label="SKU 数量快速录入">
    <header v-if="showProductInfo" class="zt-sku-input__header"><div class="zt-sku-input__identity"><h3 v-if="product.product_name">{{ product.product_name }}</h3><span class="zt-sku-input__product-no">{{ productNo }}</span></div><span class="zt-sku-input__hint">按颜色与尺码录入数量</span></header>
    <div v-if="matrix.columns.length && matrix.rows.length" class="zt-sku-input__scroll" tabindex="0" aria-label="颜色尺码数量矩阵">
      <table class="zt-sku-input__table" :style="{ '--sku-column-count': matrix.columns.length, '--sku-summary-count': showSummary ? 1 : 0 }">
        <caption class="zt-sku-input__sr-only">{{ product.product_name || productNo }} SKU 数量，行为颜色，列为尺码</caption>
        <colgroup><col class="zt-sku-input__color-column" /><col v-for="column in matrix.columns" :key="column.code" /><col v-if="showSummary" class="zt-sku-input__summary-column" /></colgroup>
        <thead><tr><th class="zt-sku-input__corner" scope="col">颜色 / 尺码</th><th v-for="column in matrix.columns" :key="column.code" :data-size="column.code" scope="col">{{ column.name }}</th><th v-if="showSummary" scope="col" class="zt-sku-input__sum">合计</th></tr></thead>
        <tbody><tr v-for="(row, r) in matrix.rows" :key="row.source.skc" :class="{ 'is-disabled': row.source.disabled }">
          <th scope="row" class="zt-sku-input__color"><div class="zt-sku-input__color-content"><span v-if="showImage" class="zt-sku-input__image"><ZtImage v-if="row.source.image_url" :src="row.source.image_url" :alt="row.source.color_name || row.source.skc" fit="contain" :show-preview="false" /><ZtIcon v-else name="image" /></span><span class="zt-sku-input__color-info"><strong>{{ row.source.color_name || row.source.color_code || row.source.skc }}</strong><code>{{ row.source.color_code || row.source.skc }}</code></span></div></th>
          <td v-for="(cell, c) in row.cells" :key="matrix.columns[c]!.code" :data-row="r" :data-col="c" :data-sku="cell?.source.sku" :class="{ 'is-unavailable': !cell, 'is-disabled': cell?.disabled, 'has-value': valueAt(r, c) > 0 }" @compositionstart="composing.add($event.target as HTMLInputElement)" @compositionend="onCompositionEnd($event, r, c)" @input="onInput($event, r, c)" @paste="onPaste($event, r, c)" @keydown="onKeydown($event, r, c)">
            <ZtInput v-if="cell" :id="`${inputId}-${r}-${c}`" :model-value="valueAt(r, c) || ''" :size="size" :underline="false" :disabled="effectiveDisabled || cell.disabled" :readonly="readonly" inputmode="numeric" pattern="[0-9]*" autocomplete="off" :aria-label="`${row.source.color_name || row.source.color_code || row.source.skc} ${matrix.columns[c]!.name} 数量`" :aria-description="cell.disabled ? '此规格不可编辑' : undefined" />
            <span v-else title="此颜色无该尺码" aria-label="无此规格">—</span>
          </td>
          <td v-if="showSummary" class="zt-sku-input__sum">{{ rowTotal(r) || '—' }}</td>
        </tr></tbody>
        <tfoot v-if="showSummary"><tr><th scope="row">尺码合计</th><td v-for="(_, c) in matrix.columns" :key="c">{{ columnTotal(c) || '—' }}</td><td class="zt-sku-input__grand-total">{{ result.totalQuantity }}</td></tr></tfoot>
      </table>
    </div>
    <div v-else class="zt-sku-input__empty">暂无可录入规格</div>
    <footer v-if="showSummary" class="zt-sku-input__footer"><slot name="summary" v-bind="result"><span>已录入 <strong>{{ result.skuCount }}</strong> 个 SKU</span><span data-total>总数量 <strong>{{ result.totalQuantity }}</strong></span></slot></footer>
  </section>
</template>
