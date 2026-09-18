<script setup lang="ts">
import { useFormControlAppearance } from '../form/useFormControlAppearance';
import { entryStatusStyle } from '../autocomplete/status';
import { computed, inject, ref, useId, watch, nextTick, useAttrs } from 'vue';
import { ZtInput } from '../input';
import { ZtPopover } from '../popover';
import { ztFormItemKey } from '../form/context';
import { useSuggestions } from './suggestions';
import type { ZtAutocompleteOption, ZtAutocompleteProps } from './types';
import './entry.scss';
defineOptions({ name: 'ZtAutocomplete', inheritAttrs: false });
const { underline } = useFormControlAppearance();
const props = withDefaults(defineProps<ZtAutocompleteProps>(), {
  status: 'primary',
  modelValue: '',
  options: () => [],
  debounce: 200,
  clearable: false,
  disabled: false,
  readonly: false,
  placeholder: '请输入',
});
const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
  select: [option: ZtAutocompleteOption];
  clear: [];
}>();
const form = inject(ztFormItemKey, undefined),
  disabled = computed(() => props.disabled || form?.disabled.value),
  input = ref<InstanceType<typeof ZtInput>>(),
  composing = ref(false),
  id = useId(),
  attrs = useAttrs();
const { items, loading, error, open, active, query, close, move } =
  useSuggestions(
    () =>
      props.fetchSuggestions ??
      ((q) =>
        props.options.filter((o) =>
          (o.label ?? o.value)
            .toLocaleLowerCase()
            .includes(q.toLocaleLowerCase()),
        )),
    () => props.debounce,
  );
function search(value: string) {
  if (!disabled.value && !props.readonly && !composing.value) query(value);
}
function update(value: string) {
  emit('update:modelValue', value);
  emit('change', value);
  search(value);
}
function select(option: ZtAutocompleteOption) {
  if (option.disabled || disabled.value || props.readonly) return;
  emit('update:modelValue', option.value);
  emit('change', option.value);
  emit('select', option);
  void form?.validate('change');
  close();
  input.value?.focus();
}
function key(e: KeyboardEvent) {
  if (composing.value || e.isComposing || disabled.value || props.readonly)
    return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!open.value) search(props.modelValue);
    else move(e.key === 'ArrowDown' ? 1 : -1);
  } else if (open.value && (e.key === 'Home' || e.key === 'End')) {
    e.preventDefault();
    active.value = -1;
    move(e.key === 'Home' ? 1 : -1);
  } else if (e.key === 'Enter' && open.value && active.value >= 0) {
    e.preventDefault();
    select(items.value[active.value]!);
  } else if (e.key === 'Escape' || e.key === 'Tab') close();
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
  focus: () => input.value?.focus(),
  blur: () => input.value?.blur(),
  close,
});
</script>
<template>
  <div
    class="zt-entry zt-entry-status"
    :class="{ 'is-form-underline': underline, 'is-disabled': disabled }"
    :style="
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      )
    "
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
      ><ZtInput
        ref="input"
        v-bind="attrs"
        :model-value="modelValue"
        :size="size"
        :disabled="disabled"
        :readonly="readonly"
        :clearable="clearable"
        :placeholder="placeholder"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="id"
        :aria-activedescendant="active >= 0 ? `${id}-${active}` : undefined"
        @update:model-value="update"
        @focus="search(modelValue)"
        @blur="close"
        @clear="
          close();
          emit('clear');
        "
        @keydown="key"
        @compositionstart="
          composing = true;
          close();
        "
        @compositionend="
          composing = false;
          search(($event.target as HTMLInputElement).value);
        "
      /><template #content
        ><div
          :id="id"
          role="listbox"
          class="zt-entry__list zt-entry-status"
          :style="
            entryStatusStyle(
              form?.validateState.value === 'error' ? 'danger' : status,
            )
          "
          :aria-busy="loading"
        >
          <div v-if="loading" role="status">加载中…</div>
          <div v-else-if="error" role="alert">{{ error }}</div>
          <div v-else-if="!items.length" role="status">暂无建议</div>
          <div
            v-for="(option, i) in items"
            :id="`${id}-${i}`"
            :key="`${option.value}-${i}`"
            role="option"
            :aria-selected="active === i"
            :aria-disabled="option.disabled"
            class="zt-entry__option"
            @mousedown.prevent
            @click="select(option)"
            @pointermove="!option.disabled && (active = i)"
          >
            <slot name="option" :option="option">{{
              option.label ?? option.value
            }}</slot>
          </div>
        </div></template
      ></ZtPopover
    >
  </div>
</template>
