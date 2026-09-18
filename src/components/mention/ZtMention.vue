<script setup lang="ts">
import { useFormControlAppearance } from '../form/useFormControlAppearance';
import { entryStatusStyle } from '../autocomplete/status';
import {
  toRef,
  computed,
  inject,
  nextTick,
  ref,
  useAttrs,
  useId,
  watch,
  type CSSProperties,
} from 'vue';
import { ZtPopover } from '../popover';
import { useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import { useSuggestions } from '../autocomplete/suggestions';
import type { ZtMentionOption, ZtMentionProps } from './types';
import '../autocomplete/entry.scss';
import './mention.scss';
defineOptions({ name: 'ZtMention', inheritAttrs: false });

const props = withDefaults(defineProps<ZtMentionProps>(), {
  underline: undefined,
  status: 'primary',
  modelValue: '',
  prefixes: () => ['@'],
  options: () => [],
  debounce: 200,
  disabled: false,
  readonly: false,
  clearable: false,
  rows: 3,
  placeholder: '输入 @ 提及',
});
const { underline } = useFormControlAppearance(toRef(props, 'underline'));
const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
  select: [option: ZtMentionOption, prefix: string];
  clear: [];
}>();
const form = inject(ztFormItemKey, undefined),
  disabled = computed(() => props.disabled || form?.disabled.value),
  size = useZtSize(props, () => form?.size.value),
  textarea = ref<HTMLTextAreaElement>(),
  composing = ref(false),
  id = useId(),
  attrs = useAttrs();
const context = ref<{ start: number; end: number; prefix: string } | null>(
  null,
);
const { items, loading, error, open, active, query, close, move } =
  useSuggestions(
    () => (q, s) =>
      props.fetchSuggestions
        ? props.fetchSuggestions(q, context.value?.prefix ?? '@', s)
        : props.options.filter((o) =>
            (o.label ?? o.value)
              .toLocaleLowerCase()
              .includes(q.toLocaleLowerCase()),
          ),
    () => props.debounce,
  );
function inspect() {
  if (disabled.value || props.readonly || composing.value || !textarea.value)
    return;
  const el = textarea.value,
    head = el.value.slice(0, el.selectionStart);
  let found: typeof context.value = null;
  for (const prefix of props.prefixes.filter(Boolean)) {
    const pos = head.lastIndexOf(prefix);
    if (
      pos >= 0 &&
      (pos === 0 || /\s/.test(head[pos - 1]!)) &&
      !/\s/.test(head.slice(pos + prefix.length)) &&
      (!found || pos > found.start)
    )
      found = { start: pos, end: el.selectionStart, prefix };
  }
  context.value = found;
  if (found) query(head.slice(found.start + found.prefix.length));
  else close();
}
function update(value: string) {
  emit('update:modelValue', value);
  emit('change', value);
  void form?.validate('change');
}
function input() {
  update(textarea.value!.value);
  inspect();
}
async function select(option: ZtMentionOption) {
  const c = context.value,
    el = textarea.value;
  if (!c || !el || option.disabled || disabled.value || props.readonly) return;
  const tail = el.value.slice(c.end),
    insert = c.prefix + option.value + (tail.startsWith(' ') ? '' : ' '),
    value = el.value.slice(0, c.start) + insert + tail;
  update(value);
  emit('select', option, c.prefix);
  close();
  context.value = null;
  await nextTick();
  el.focus();
  el.setSelectionRange(c.start + insert.length, c.start + insert.length);
}
function key(e: KeyboardEvent) {
  if (composing.value || e.isComposing || disabled.value || props.readonly)
    return;
  if (open.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    e.preventDefault();
    move(e.key === 'ArrowDown' ? 1 : -1);
  } else if (open.value && (e.key === 'Home' || e.key === 'End')) {
    e.preventDefault();
    active.value = -1;
    move(e.key === 'Home' ? 1 : -1);
  } else if (e.key === 'Enter' && open.value && active.value >= 0) {
    e.preventDefault();
    void select(items.value[active.value]!);
  } else if (e.key === 'Escape' || e.key === 'Tab') close();
}
function blur() {
  close();
  void form?.validate('blur');
}
function clear() {
  if (disabled.value || props.readonly) return;
  update('');
  close();
  emit('clear');
  textarea.value?.focus();
}
watch(active, async () => {
  await nextTick();
  document
    .getElementById(`${id}-${active.value}`)
    ?.scrollIntoView?.({ block: 'nearest' });
});
watch(disabled, (v) => {
  if (v) close();
});
watch(
  () => props.readonly,
  (v) => {
    if (v) close();
  },
);
defineExpose({
  focus: () => textarea.value?.focus(),
  blur: () => textarea.value?.blur(),
});
</script>
<template>
  <div
    class="zt-entry zt-mention zt-entry-status"
    :class="[`zt-mention--${size}`, { 'is-form-underline': underline }, attrs.class]"
    :style="[
      attrs.style as CSSProperties,
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      ),
    ]"
  >
    <ZtPopover
      :visible="open"
      trigger="manual"
      placement="bottom-start"
      :show-arrow="false"
      :restore-focus="false"
      width="min(320px, calc(100vw - 32px))"
      @update:visible="
        (v) => {
          if (!v) close();
        }
      "
    >
      <textarea
        v-bind="attrs"
        :id="String(attrs.id ?? form?.inputId ?? '') || undefined"
        ref="textarea"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :rows="rows"
        role="combobox"
        aria-autocomplete="list"
        aria-multiline="true"
        :aria-expanded="open"
        :aria-controls="id"
        :aria-activedescendant="active >= 0 ? `${id}-${active}` : undefined"
        :aria-invalid="form?.validateState.value === 'error' || undefined"
        :aria-describedby="
          form?.validateMessage.value ? form.errorId : undefined
        "
        @input="input"
        @click="inspect"
        @keyup="
          (e) => {
            if (
              ['ArrowLeft', 'ArrowRight'].includes(e.key) ||
              (!open && ['Home', 'End'].includes(e.key))
            )
              inspect();
          }
        "
        @keydown="key"
        @blur="blur"
        @compositionstart="
          composing = true;
          close();
        "
        @compositionend="
          composing = false;
          inspect();
        "
      /><template #content
        ><div
          :id="id"
          class="zt-entry__list zt-entry-status"
          :style="
            entryStatusStyle(
              form?.validateState.value === 'error' ? 'danger' : status,
            )
          "
          role="listbox"
          :aria-busy="loading"
        >
          <div v-if="loading" role="status">加载中…</div>
          <div v-else-if="error" role="alert">{{ error }}</div>
          <div v-else-if="!items.length">暂无建议</div>
          <div
            v-for="(option, i) in items"
            :id="`${id}-${i}`"
            :key="`${option.value}-${i}`"
            class="zt-entry__option"
            role="option"
            :aria-disabled="option.disabled"
            :aria-selected="active === i"
            @mousedown.prevent
            @click="select(option)"
          >
            <slot name="option" :option="option">{{
              option.label ?? option.value
            }}</slot>
          </div>
        </div></template
      ></ZtPopover
    ><button
      v-if="clearable && modelValue && !disabled && !readonly"
      aria-label="清空内容"
      type="button"
      class="zt-mention__clear"
      @mousedown.prevent
      @click="clear"
    >
      ×
    </button>
  </div>
</template>
