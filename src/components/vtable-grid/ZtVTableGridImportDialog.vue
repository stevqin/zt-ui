<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ZtModal from '../modal/ZtModal.vue'
import ZtButton from '../button/ZtButton.vue'
import ZtIcon from '../icon/ZtIcon.vue'

import type { ZtVTableGridImportDialogProps, ZtVTableGridImportDialogSlotScope, ZtVTableGridImportDialogSlots } from './import-dialog-types'

const props = withDefaults(defineProps<ZtVTableGridImportDialogProps>(), {
  title: '导入数据', description: '', modelValue: false, file: null, loading: false,
  templateUrl: '', templateDownload: false, formatHint: '仅支持 .xlsx 文件',
  instructions: () => [], accept: '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  allowedExtensions: () => ['.xlsx'], fileSpec: '仅支持 .xlsx', fileTypeLabel: 'XLSX',
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:file': [value: File | null]
  'update:loading': [value: boolean]
  confirm: [file: File]
  template: []
  'invalid-file': [file: File]
}>()
defineSlots<ZtVTableGridImportDialogSlots>()
const input = ref<HTMLInputElement>()
const confirming = ref(false)
const busy = computed(() => props.loading || confirming.value)
const dragging = ref(false)
const error = ref('')
const extensions = computed(() => props.allowedExtensions.map(extension => `.${extension.replace(/^\./, '').trim().toLowerCase()}`).filter(extension => extension !== '.'))
const fileFormat = computed(() => {
  const format = props.file ? props.file.name.match(/\.([^.]+)$/)?.[1] ?? 'FILE' : extensions.value[0]?.slice(1) ?? props.fileTypeLabel
  return /^[a-z0-9]{1,5}$/i.test(format) ? format.toUpperCase() : 'FILE'
})
const isAllowed = (file: File) => !extensions.value.length || extensions.value.some(extension => file.name.toLowerCase().endsWith(extension))
const formatError = () => `请选择 ${extensions.value.join(' / ')} 格式的文件`
const validationError = computed(() => error.value || (props.file && !isAllowed(props.file) ? formatError() : ''))
const canConfirm = computed(() => !!props.file && isAllowed(props.file) && !busy.value)
const canDownloadTemplate = computed(() => !!(props.templateUrl || props.templateDownload))
const visible = (value: boolean) => { if (!busy.value) emit('update:modelValue', value) }
function select(file?: File): boolean {
  if (!file || busy.value) return false
  if (!isAllowed(file)) {
    error.value = formatError()
    emit('invalid-file', file)
    return false
  }
  error.value = ''
  emit('update:file', file)
  return true
}
function openFileDialog() { if (!busy.value) input.value?.click() }
function change(event: Event) {
  const element = event.target as HTMLInputElement
  select(element.files?.[0])
  element.value = ''
}
function drop(event: DragEvent) { dragging.value = false; select(event.dataTransfer?.files?.[0]) }
function remove() { if (!busy.value) { error.value = ''; emit('update:file', null) } }
async function confirm() {
  if (!props.file || busy.value) return
  if (!isAllowed(props.file)) { select(props.file); return }
  confirming.value = true
  try {
    emit('confirm', props.file)
    // Keep rapid calls locked until the parent's controlled loading update applies.
    await nextTick()
  } finally { confirming.value = false }
}
const cancel = () => visible(false)
function downloadTemplate() {
  if (busy.value || !canDownloadTemplate.value) return
  if (props.templateUrl) {
    const link = document.createElement('a')
    link.href = props.templateUrl
    link.download = ''
    link.click()
  } else emit('template')
}
watch(() => props.file, () => { error.value = '' })
watch(() => props.modelValue, () => { error.value = ''; dragging.value = false })
const slotScope = computed<ZtVTableGridImportDialogSlotScope>(() => ({
  title: props.title, description: props.description, instructions: [...props.instructions],
  formatHint: props.formatHint, fileSpec: props.fileSpec, fileTypeLabel: props.fileTypeLabel, templateUrl: props.templateUrl,
  file: props.file, format: fileFormat.value, loading: busy.value,
  dragging: dragging.value && !busy.value, error: validationError.value,
  canConfirm: canConfirm.value, accept: props.accept, allowedExtensions: [...extensions.value],
  canDownloadTemplate: canDownloadTemplate.value,
  openFileDialog, selectFile: select, removeFile: remove, confirm, cancel, close: cancel, downloadTemplate,
}))
</script>

<template>
  <ZtModal :model-value="modelValue" :title="title" :width="620" show-footer
    :loading="busy" :confirm-loading="busy" :show-close="!busy"
    :mask-closable="!busy" :esc-closable="!busy" :before-close="() => !busy"
    @update:model-value="visible">
    <template #title>
      <h2 class="zt-vtable-grid-import__title">
        <slot name="title-icon" v-bind="slotScope">
          <span class="zt-vtable-grid-import__file-mark" :data-format="fileFormat.toLowerCase()" aria-hidden="true">
            <ZtIcon name="file" size="1.7em" />
            <span>{{ fileFormat }}</span>
          </span>
        </slot>
        <slot name="title" v-bind="slotScope"><span>{{ title }}</span></slot>
      </h2>
    </template>
    <div class="zt-vtable-grid-import">
      <slot name="description" v-bind="slotScope"><p v-if="description">{{ description }}</p></slot>
      <slot name="instructions" v-bind="slotScope"><ul v-if="instructions.length"><li v-for="instruction in instructions" :key="instruction">{{ instruction }}</li></ul></slot>
      <slot name="options" v-bind="slotScope" />
      <div class="zt-vtable-grid-import__heading">
        <span>{{ formatHint }}</span>
        <slot name="template" v-bind="slotScope">
          <a v-if="templateUrl" :href="busy ? undefined : templateUrl" :aria-disabled="busy" download @click="busy && $event.preventDefault()">下载标准模板</a>
          <ZtButton v-else-if="templateDownload" text :disabled="busy" @click="downloadTemplate">下载标准模板</ZtButton>
        </slot>
      </div>
      <div data-dropzone class="zt-vtable-grid-import__dropzone" :class="{ 'is-dragging': dragging && !busy }"
        @dragenter.prevent="dragging = !busy" @dragover.prevent="dragging = !busy"
        @dragleave.prevent="dragging = false" @drop.prevent="drop">
        <input ref="input" type="file" :accept="accept" :disabled="busy" hidden @change="change">
        <slot name="upload" v-bind="slotScope">
          <ZtIcon name="upload" />
          <slot v-if="file" name="file" v-bind="slotScope" :file="file">
            <strong>{{ file.name }}</strong>
            <small>{{ (file.size / 1024).toFixed(1) }} KB · {{ fileTypeLabel }}</small>
            <div><ZtButton :disabled="busy" @click="openFileDialog">更换文件</ZtButton>
              <ZtButton :disabled="busy" aria-label="移除文件" @click="remove">移除</ZtButton></div>
          </slot>
          <template v-else>
            <ZtButton :disabled="busy" @click="openFileDialog">点击选择文件</ZtButton>
            <small>或将 {{ fileTypeLabel }} 文件拖到这里 · {{ fileSpec }}</small>
          </template>
        </slot>
      </div>
      <slot v-if="validationError" name="error" v-bind="slotScope"><p role="alert" class="zt-vtable-grid-import__error">{{ validationError }}</p></slot>
    </div>
    <template #footer>
      <slot name="footer" v-bind="slotScope">
        <span v-if="busy" role="status">正在处理导入，请勿重复提交</span>
        <ZtButton :disabled="busy" @click="cancel">取消</ZtButton>
        <ZtButton data-confirm status="primary" :disabled="!canConfirm" :loading="busy" @click="confirm">开始导入</ZtButton>
      </slot>
    </template>
  </ZtModal>
</template>

<style scoped lang="scss">
.zt-vtable-grid-import {
  &__title { display: flex; align-items: center; gap: 12px; }
  &__title > span:last-child { min-width: 0; overflow-wrap: anywhere; }
  &__file-mark {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 2em;
    height: 2.2em;
    border: 1px solid var(--glass-success-line);
    border-radius: .4em;
    background: var(--glass-success-soft);
    color: var(--glass-success-ink);
  }
  &__file-mark > span {
    position: absolute;
    bottom: 2px;
    left: 2px;
    right: 2px;
    padding: 1px 0;
    border-radius: 2px;
    background: var(--glass-success-ink);
    color: var(--zt-surface, #fff);
    font-size: .47em;
    font-weight: 750;
    line-height: 1.35;
    letter-spacing: .03em;
    text-align: center;
  }
  color: var(--glass-ink);
  p, ul { margin: 0 0 16px; line-height: 1.6; }
  small { color: var(--glass-muted); }
  &__heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin: 12px 0; }
  &__heading > .zt-button, &__heading > a { flex-shrink: 0; margin-left: auto; white-space: nowrap; }
  a { color: var(--glass-accent); }
  &__dropzone { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 28px 16px; border: 1px dashed var(--glass-line); border-radius: var(--zt-radius-lg, 8px); }
  &__dropzone.is-dragging { border-color: var(--glass-accent); background: var(--zt-surface-soft); }
  strong { max-width: 100%; overflow-wrap: anywhere; }
  &__error { color: var(--glass-danger-ink); margin-top: 12px !important; }
}
</style>
