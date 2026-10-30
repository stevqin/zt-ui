<script setup lang="ts">
import { computed, ref } from 'vue'
import ZtModal from '../modal/ZtModal.vue'
import ZtButton from '../button/ZtButton.vue'
import ZtIcon from '../icon/ZtIcon.vue'

import type { ZtVTableGridImportDialogProps } from './import-dialog-types'

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
const input = ref<HTMLInputElement>()
const dragging = ref(false)
const error = ref('')
const extensions = computed(() => props.allowedExtensions.map(extension => `.${extension.replace(/^\./, '').trim().toLowerCase()}`).filter(extension => extension !== '.'))
const visible = (value: boolean) => { if (!props.loading) emit('update:modelValue', value) }
function select(file?: File) {
  if (!file || props.loading) return
  if (extensions.value.length && !extensions.value.some(extension => file.name.toLowerCase().endsWith(extension))) {
    error.value = `请选择 ${extensions.value.join(' / ')} 格式的文件`
    emit('invalid-file', file)
    return
  }
  error.value = ''
  emit('update:file', file)
}
function change(event: Event) {
  const element = event.target as HTMLInputElement
  select(element.files?.[0])
  element.value = ''
}
function drop(event: DragEvent) { dragging.value = false; select(event.dataTransfer?.files?.[0]) }
function remove() { if (!props.loading) { error.value = ''; emit('update:file', null) } }
function confirm() {
  if (!props.file || props.loading) return
  if (extensions.value.length && !extensions.value.some(extension => props.file!.name.toLowerCase().endsWith(extension))) { select(props.file); return }
  emit('confirm', props.file)
}
</script>

<template>
  <ZtModal :model-value="modelValue" :title="title" :width="620" show-footer
    :loading="loading" :confirm-loading="loading" :show-close="!loading"
    :mask-closable="!loading" :esc-closable="!loading" :before-close="() => !loading"
    @update:model-value="visible">
    <div class="zt-vtable-grid-import">
      <p v-if="description">{{ description }}</p>
      <ul v-if="instructions.length"><li v-for="instruction in instructions" :key="instruction">{{ instruction }}</li></ul>
      <slot name="options" />
      <div class="zt-vtable-grid-import__heading">
        <span>{{ formatHint }}</span>
        <a v-if="templateUrl" :href="loading ? undefined : templateUrl" :aria-disabled="loading" download @click="loading && $event.preventDefault()">下载标准模板</a>
        <ZtButton v-else-if="templateDownload" text :disabled="loading" @click="emit('template')">下载标准模板</ZtButton>
      </div>
      <div data-dropzone class="zt-vtable-grid-import__dropzone" :class="{ 'is-dragging': dragging && !loading }"
        @dragenter.prevent="dragging = !loading" @dragover.prevent="dragging = !loading"
        @dragleave.prevent="dragging = false" @drop.prevent="drop">
        <input ref="input" type="file" :accept="accept" :disabled="loading" hidden @change="change">
        <ZtIcon name="upload" />
        <template v-if="file">
          <strong>{{ file.name }}</strong>
          <small>{{ (file.size / 1024).toFixed(1) }} KB · {{ fileTypeLabel }}</small>
          <div><ZtButton :disabled="loading" @click="input?.click()">更换文件</ZtButton>
            <ZtButton :disabled="loading" aria-label="移除文件" @click="remove">移除</ZtButton></div>
        </template>
        <template v-else>
          <ZtButton :disabled="loading" @click="input?.click()">点击选择文件</ZtButton>
          <small>或将 {{ fileTypeLabel }} 文件拖到这里 · {{ fileSpec }}</small>
        </template>
      </div>
      <p v-if="error" role="alert" class="zt-vtable-grid-import__error">{{ error }}</p>
    </div>
    <template #footer>
      <span v-if="loading" role="status">正在处理导入，请勿重复提交</span>
      <ZtButton :disabled="loading" @click="visible(false)">取消</ZtButton>
      <ZtButton data-confirm status="primary" :disabled="!file || loading" :loading="loading" @click="confirm">开始导入</ZtButton>
    </template>
  </ZtModal>
</template>

<style scoped lang="scss">
.zt-vtable-grid-import {
  color: var(--glass-ink);
  p, ul { margin: 0 0 16px; line-height: 1.6; }
  small { color: var(--glass-muted); }
  &__heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 12px 0; }
  a { color: var(--glass-accent); }
  &__dropzone { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 28px 16px; border: 1px dashed var(--glass-line); border-radius: var(--zt-radius-lg, 8px); }
  &__dropzone.is-dragging { border-color: var(--glass-accent); background: var(--zt-surface-soft); }
  strong { max-width: 100%; overflow-wrap: anywhere; }
  &__error { color: var(--glass-danger-ink); margin-top: 12px !important; }
}
</style>
