<script setup lang="ts">
import { entryStatusStyle } from '../autocomplete/status';
import { computed, inject, ref, provide, useAttrs } from 'vue';
import { ZtInput } from '../input';
import { ztFormItemKey } from '../form/context';
import { useZtSize } from '../config-provider/context';
import type { ZtInputTagProps } from './types';
import './input-tag.scss';
defineOptions({ name: 'ZtInputTag', inheritAttrs: false });
const props = withDefaults(defineProps<ZtInputTagProps>(), {
  status: 'primary',
  modelValue: () => [],
  deduplicate: true,
  max: Infinity,
  separators: () => [',', ';', '，', '；', '\n'],
  disabled: false,
  readonly: false,
  clearable: false,
  placeholder: '输入后按回车',
});
const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  change: [value: string[]];
  remove: [value: string, index: number];
  /** 超出 max 的新增标签被丢弃时触发，每次提交最多一次。 */
  limit: [];
  clear: [];
}>();
const form = inject(ztFormItemKey, undefined),
  size = useZtSize(props, () => form?.size.value),
  disabled = computed(() => props.disabled || form?.disabled.value),
  attrs = useAttrs(),
  draft = ref(''),
  composing = ref(false);
if (form)
  provide(ztFormItemKey, {
    ...form,
    validate: (trigger) =>
      trigger === 'blur' ? form.validate(trigger) : Promise.resolve(true),
  });
const editable = computed(() => !disabled.value && !props.readonly);
function update(values: string[]) {
  emit('update:modelValue', values);
  emit('change', values);
  void form?.validate('change');
}
function split(text: string) {
  let parts = [text];
  for (const s of props.separators.filter(Boolean))
    parts = parts.flatMap((p) => p.split(s));
  return parts.map((s) => s.trim()).filter(Boolean);
}
function add(text: string) {
  if (!editable.value || composing.value) return;
  const values = [...props.modelValue];
  let limited = false;
  for (const tag of split(text)) {
    if (props.deduplicate && values.includes(tag)) continue;
    if (values.length >= Math.max(0, Math.floor(props.max))) {
      limited = true;
      continue;
    }
    values.push(tag);
  }
  if (values.length !== props.modelValue.length) update(values);
  if (limited) emit('limit');
  draft.value = '';
}
function remove(index: number) {
  if (!editable.value) return;
  const values = [...props.modelValue],
    removed = values.splice(index, 1)[0];
  update(values);
  emit('remove', removed!, index);
}
function key(e: KeyboardEvent) {
  if (!editable.value || composing.value || e.isComposing) return;
  if (e.key === 'Enter' || props.separators.includes(e.key)) {
    e.preventDefault();
    add(draft.value);
  } else if (e.key === 'Backspace' && !draft.value && props.modelValue.length)
    remove(props.modelValue.length - 1);
}
function paste(e: ClipboardEvent) {
  if (!editable.value || composing.value) return;
  const text = e.clipboardData?.getData('text');
  if (text) {
    e.preventDefault();
    add(draft.value + text);
  }
}
function clear() {
  if (editable.value) {
    update([]);
    draft.value = '';
    emit('clear');
  }
}
</script>
<template>
  <div
    class="zt-input-tag zt-entry-status"
    :style="
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      )
    "
    :class="[`zt-input-tag--${size}`, { 'is-disabled': disabled }]"
    :aria-disabled="disabled"
  >
    <span v-for="(tag, i) in modelValue" :key="i" class="zt-input-tag__tag"
      ><slot name="tag" :value="tag" :index="i">{{ tag }}</slot
      ><button
        v-if="editable"
        type="button"
        :aria-label="`删除 ${tag}`"
        @click="remove(i)"
      >
        ×
      </button></span
    ><ZtInput
      v-bind="attrs"
      v-model="draft"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      @keydown="key"
      @paste="paste"
      @compositionstart="composing = true"
      @compositionend="composing = false"
    /><button
      v-if="clearable && editable && modelValue.length"
      type="button"
      class="zt-input-tag__clear"
      @mousedown.prevent
      aria-label="清空标签"
      @click="clear"
    >
      ×
    </button>
  </div>
</template>
