<script setup lang="ts">
import { useFormControlAppearance } from '../form/useFormControlAppearance';
import { useZtConfig } from '../config-provider/context';
const { style: providerStyle, theme: providerTheme } = useZtConfig();
import { useZtSize } from '../config-provider/context';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  toRef,
  useAttrs,
  watch,
} from 'vue';
import { ztFormItemKey } from '../form/context';
import { overlayContextKey } from '../overlay/context';
import { resolvePopupZIndex } from '../overlay/resolvePopupZIndex';
import {
  filterSelectOptions,
  isOptionSelected,
  multipleValues,
  singleValue,
} from './options';
import { useAnchoredDropdown, useRemoteOptions } from '../selection';
import type {
  ZtSelectModelValue,
  ZtSelectOption,
  ZtSelectProps,
  ZtSelectValue,
} from './types';
import './select.scss';

defineOptions({ name: 'ZtSelect', inheritAttrs: false });
const { underline } = useFormControlAppearance();

const props = withDefaults(defineProps<ZtSelectProps>(), {
  modelValue: null,
  options: () => [],
  virtual: false,
  height: 280,
  multiple: false,
  collapseTags: false,
  maxCollapseTags: 1,
  filterable: false,
  remote: false,
  debounce: 300,
  clearable: false,
  placeholder: '请选择',
  disabled: false,
  noDataText: '暂无数据',
  remoteErrorText: '加载失败，请重试',
});

const emit = defineEmits<{
  'update:modelValue': [value: ZtSelectModelValue];
  change: [value: ZtSelectModelValue];
  'visible-change': [visible: boolean];
  search: [keyword: string];
  clear: [];
  'remove-tag': [value: ZtSelectValue];
  'remote-error': [reason: unknown];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const formItem = inject(ztFormItemKey, undefined);
const overlay = inject(overlayContextKey, undefined);
const instance = getCurrentInstance();
const rootElement = ref<HTMLElement>();
const controlElement = ref<HTMLElement>();
const comboboxElement = ref<HTMLInputElement>();
const searchElement = ref<HTMLInputElement>();
const listboxElement = ref<HTMLElement>();
const optionsElement = ref<HTMLElement>();
const visible = ref(false);
const keyword = ref('');
const searching = ref(false);
const activeIndex = ref(-1);
const dropdownZIndex = ref(2000);
const dropdownChromeHeight = ref(0);
const hasRemoteSearch = ref(false);
const retainedRemoteOptions = ref<ZtSelectOption[]>([]);
const remoteSearch = useRemoteOptions(
  toRef(props, 'remoteMethod'),
  toRef(props, 'debounce'),
  () => [] as ZtSelectOption[],
);
const selectId = `zt-select-${instance?.uid ?? Math.random().toString(36).slice(2)}`;
const listboxId = `${selectId}-listbox`;
const effectiveSize = useZtSize(props, () => formItem?.size.value);
const effectiveDisabled = computed(
  () => props.disabled || formItem?.disabled.value || false,
);
const valueOptions = computed(() =>
  props.remote
    ? [
        ...remoteSearch.result.value,
        ...retainedRemoteOptions.value,
        ...props.options,
      ]
    : props.options,
);
const selectedOption = computed(() => {
  if (props.multiple) return undefined;
  const value = singleValue(props.modelValue);
  return valueOptions.value.find((option) => option.value === value);
});
const selectedValues = computed(() => multipleValues(props.modelValue));
const selectedOptions = computed(() =>
  selectedValues.value.flatMap((value) => {
    const option = valueOptions.value.find(
      (candidate) => candidate.value === value,
    );
    return option ? [option] : [];
  }),
);
const visibleTagLimit = computed(() =>
  Number.isFinite(props.maxCollapseTags)
    ? Math.max(1, Math.floor(props.maxCollapseTags))
    : 1,
);
const visibleTagOptions = computed(() =>
  props.collapseTags
    ? selectedOptions.value.slice(0, visibleTagLimit.value)
    : selectedOptions.value,
);
const collapsedTagCount = computed(() =>
  selectedOptions.value.length - visibleTagOptions.value.length,
);
const hasSelection = computed(() =>
  props.multiple
    ? selectedValues.value.length > 0
    : selectedOption.value !== undefined ||
      (singleValue(props.modelValue) !== null &&
        singleValue(props.modelValue) !== ''),
);
const canClear = computed(
  () => props.clearable && hasSelection.value && !effectiveDisabled.value,
);
const displayedOptions = computed(() => {
  if (props.remote)
    return props.remoteMethod
      ? hasRemoteSearch.value
        ? remoteSearch.result.value
        : props.options
      : [];
  return props.filterable
    ? filterSelectOptions(props.options, keyword.value)
    : props.options;
});
const navigableOptions = computed(() =>
  visible.value &&
  !(props.remote && (remoteSearch.loading.value || remoteSearch.failed.value))
    ? displayedOptions.value
    : [],
);
const virtualScrollTop = ref(0);
const virtualRowHeight = computed(() =>
  Number.isFinite(props.itemHeight) && (props.itemHeight ?? 0) > 0
    ? props.itemHeight!
    : { mini: 28, small: 31, default: 34, medium: 36, large: 40 }[
        effectiveSize.value
      ],
);
const optionWindowStart = computed(() =>
  props.virtual
    ? Math.max(
        0,
        Math.min(
          Math.floor(virtualScrollTop.value / virtualRowHeight.value) - 3,
          Math.max(0, displayedOptions.value.length - 1),
        ),
      )
    : 0,
);
const optionWindowEnd = computed(() =>
  props.virtual
    ? Math.min(
        displayedOptions.value.length,
        optionWindowStart.value +
          Math.ceil(
            (listMaxHeight.value ?? props.height) / virtualRowHeight.value,
          ) +
          7,
      )
    : displayedOptions.value.length,
);
const renderedOptions = computed(() =>
  displayedOptions.value
    .slice(optionWindowStart.value, optionWindowEnd.value)
    .map((option, index) => ({
      option,
      index: index + optionWindowStart.value,
    })),
);
function handleOptionsScroll(event: Event) {
  virtualScrollTop.value = (event.target as HTMLElement).scrollTop;
}
watch(displayedOptions, () => {
  virtualScrollTop.value = 0;
  if (optionsElement.value) optionsElement.value.scrollTop = 0;
  activeIndex.value = -1;
});
async function revealOption(index: number) {
  if (props.virtual) {
    const list = optionsElement.value;
    const height = list?.clientHeight || listMaxHeight.value || props.height;
    const top = index * virtualRowHeight.value;
    const current = list?.scrollTop ?? virtualScrollTop.value;
    const next =
      top < current
        ? top
        : top + virtualRowHeight.value > current + height
          ? top + virtualRowHeight.value - height
          : current;
    if (list) list.scrollTop = next;
    virtualScrollTop.value = next;
  }
  await nextTick();
  if (!props.virtual)
    document
      .getElementById(optionId(index))
      ?.scrollIntoView({ block: 'nearest' });
}
const activeOptionId = computed(() => {
  const option = navigableOptions.value[activeIndex.value];
  return option &&
    !option.disabled &&
    (!props.virtual ||
      (activeIndex.value >= optionWindowStart.value &&
        activeIndex.value < optionWindowEnd.value))
    ? optionId(activeIndex.value)
    : undefined;
});
const panelSearch = computed(() => props.multiple && (props.filterable || props.remote));
const inputValue = computed(() =>
  panelSearch.value ? '' : searching.value ? keyword.value : (selectedOption.value?.label ?? ''),
);
const ariaInvalid = computed(() =>
  formItem?.validateState.value === 'error' ? 'true' : undefined,
);
const describedBy = computed(() => {
  const own = attrs['aria-describedby'];
  return typeof own === 'string'
    ? own
    : formItem?.validateMessage.value
      ? formItem.errorId
      : undefined;
});
const classes = computed(() => [
  'zt-select',
  underline.value && 'is-form-underline',
  effectiveSize.value !== 'default' && `zt-select--${effectiveSize.value}`,
  effectiveDisabled.value && 'is-disabled',
  visible.value && 'is-open',
  (props.filterable || props.remote) && 'is-searchable',
  keyword.value && 'has-keyword',
  searching.value && 'is-searching',
  hasSelection.value && 'has-selection',
  props.clearable && 'has-clear',
  props.multiple && 'is-multiple',
  props.multiple && props.collapseTags && 'is-collapsed',
]);
const controlAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, ...rest } = attrs;
  return rest;
});

const dropdown = useAnchoredDropdown({
  visible,
  trigger: controlElement,
  popup: listboxElement,
  layer: dropdownZIndex,
  // The stylesheet supplies a six-pixel trigger gap in addition to the viewport gutter.
  viewportGutter: 14,
  constrainWidth: false,
  getPopupHeight: measureDropdownHeight,
  restoreFocus: false,
  onFocusOut: handleFocusout,
  close,
  focus,
});
const dropdownStyle = dropdown.popupStyle;
const placement = computed(() => dropdown.placement.value === 'top' ? 'up' : 'down');
const listMaxHeight = computed(() => {
  const availableHeight = Number.parseFloat(String(dropdownStyle.value.maxHeight));
  return Number.isFinite(availableHeight)
    ? Math.max(0, Math.min(props.height, availableHeight - dropdownChromeHeight.value))
    : props.height;
});
provide(overlayContextKey, {
  ...dropdown.triggerOverlayContext,
  interactive: computed(() => !effectiveDisabled.value && dropdown.triggerOverlayContext.interactive.value),
});
const PopupScope = defineComponent({
  name: 'ZtSelectPopupScope',
  setup(_, { slots }) {
    provide(overlayContextKey, {
      ...dropdown.overlayContext,
      interactive: computed(() => !effectiveDisabled.value && dropdown.overlayContext.interactive.value),
    });
    return () => slots.default?.();
  },
});

function resetSearch() {
  keyword.value = '';
  searching.value = false;
  activeIndex.value = -1;
}

function setVisible(next: boolean) {
  if (!next) activeIndex.value = -1;
  if (
    (next &&
      (effectiveDisabled.value || overlay?.interactive.value === false)) ||
    visible.value === next
  )
    return;
  if (next) dropdownZIndex.value = resolvePopupZIndex(rootElement.value, overlay?.layer?.value);
  visible.value = next;
  if (next && panelSearch.value) {
    void nextTick(() => {
      if (visible.value) searchElement.value?.focus();
    });
  }
  emit('visible-change', next);
}

function open() {
  setVisible(true);
}

function close() {
  setVisible(false);
}

function toggle() {
  if (visible.value) close();
  else open();
}

function handleClick() {
  if (panelSearch.value) {
    open();
    void nextTick(() => searchElement.value?.focus());
    return;
  }
  if (!searching.value && (props.filterable || props.remote))
    comboboxElement.value?.select();
  if (props.filterable || props.remote) open();
  else toggle();
}

function selectOption(option: ZtSelectOption) {
  if (effectiveDisabled.value || option.disabled) return;
  if (
    props.remote &&
    !retainedRemoteOptions.value.some(
      (candidate) => candidate.value === option.value,
    )
  ) {
    retainedRemoteOptions.value = [...retainedRemoteOptions.value, option];
  }
  if (props.multiple) {
    if (isOptionSelected(option, selectedValues.value)) {
      removeValue(option.value);
      return;
    }
    const next = [...selectedValues.value, option.value];
    emit('update:modelValue', next);
    emit('change', next);
    void formItem?.validate('change');
    return;
  }
  if (singleValue(props.modelValue) !== option.value) {
    emit('update:modelValue', option.value);
    emit('change', option.value);
    void formItem?.validate('change');
  }
  close();
}

function removeValue(value: ZtSelectValue) {
  if (effectiveDisabled.value || !selectedValues.value.includes(value)) return;
  const focused = document.activeElement;
  const focusedTag = focused instanceof HTMLElement && rootElement.value?.contains(focused) && focused.closest('.zt-select__tag');
  const next = selectedValues.value.filter((item) => item !== value);
  emit('remove-tag', value);
  emit('update:modelValue', next);
  emit('change', next);
  void formItem?.validate('change');
  if (focusedTag) void nextTick(() => {
    // Keyboard activation removes its own focused chip; keep navigation in the control.
    if (!focused?.isConnected && document.activeElement === document.body) comboboxElement.value?.focus();
  });
}

function clear() {
  if (!canClear.value) return;
  resetSearch();
  const next = props.multiple ? [] : null;
  emit('update:modelValue', next);
  emit('change', next);
  emit('clear');
  void formItem?.validate('change');
  comboboxElement.value?.focus();
}

function handleInput(event: Event) {
  if (panelSearch.value && event.target === comboboxElement.value) return;
  updateKeyword((event.target as HTMLInputElement).value);
}

function updateKeyword(value: string) {
  searching.value = true;
  keyword.value = value;
  activeIndex.value = -1;
  emit('search', keyword.value);
  open();
  if (!props.remote) return;
  hasRemoteSearch.value = true;
  remoteSearch.schedule(keyword.value, {
    onError: (reason) => emit('remote-error', reason),
    clearOnError: true,
  });
}

function clearSearch() {
  updateKeyword('');
  searchElement.value?.focus();
}

async function moveActive(direction: 1 | -1) {
  open();
  const options = navigableOptions.value;
  if (!options.length) {
    activeIndex.value = -1;
    return;
  }

  let index = activeIndex.value;
  if (index < 0 || index >= options.length) index = direction === 1 ? -1 : 0;
  for (let count = 0; count < options.length; count += 1) {
    index = (index + direction + options.length) % options.length;
    if (!options[index].disabled) {
      activeIndex.value = index;
      await nextTick();
      await revealOption(index);
      return;
    }
  }
  activeIndex.value = -1;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.isComposing || event.keyCode === 229) return;
  if (panelSearch.value && !visible.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    open();
    return;
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    void moveActive(event.key === 'ArrowDown' ? 1 : -1);
    return;
  }
  if (event.key === 'Enter' && visible.value && activeIndex.value >= 0) {
    event.preventDefault();
    const option = navigableOptions.value[activeIndex.value];
    if (option) selectOption(option);
    return;
  }
  if (event.key === 'Escape') {
    if (visible.value) {
      event.preventDefault();
      event.stopPropagation();
    }
    comboboxElement.value?.focus();
    close();
    return;
  }
  if (event.key === 'Tab') {
    if (event.target === searchElement.value) comboboxElement.value?.focus();
    close();
    return;
  }
  if (event.key !== 'Backspace' || !props.multiple || keyword.value || event.target === searchElement.value) return;
  const value = selectedValues.value.at(-1);
  if (value !== undefined) removeValue(value);
}

function handleDropdownKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' || event.key === 'Tab') handleKeydown(event);
}

function isSelected(option: ZtSelectOption) {
  return props.multiple
    ? isOptionSelected(option, selectedValues.value)
    : selectedOption.value?.value === option.value;
}

let disposed = false;
let pendingFocusout: FocusEvent | undefined;
function handleFocusout(event: FocusEvent) {
  const nextTarget = event.relatedTarget;
  if (
    nextTarget instanceof Node &&
    dropdown.containsTarget(nextTarget)
  )
    return;
  if (disposed || pendingFocusout) return;
  pendingFocusout = event;
  // Document capture and local bubbling can observe the same move. Wait for
  // nested controls to finish any focus restoration before treating it as blur.
  void nextTick(() => {
    pendingFocusout = undefined;
    if (disposed || (document.activeElement && dropdown.containsTarget(document.activeElement))) return;
    emit('blur', event);
    close();
    void formItem?.validate('blur');
  });
}

function focus(options?: FocusOptions) {
  comboboxElement.value?.focus(options);
}

function blur() {
  searchElement.value?.blur();
  comboboxElement.value?.blur();
  close();
}

function isTagAction(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(
      '.zt-select__tag.is-custom, button, a, input, select, textarea, [role="button"], [contenteditable]',
    )
  );
}

function handleTagsMousedown(event: MouseEvent) {
  if (!isTagAction(event.target)) event.preventDefault();
}

function handleTagsClick(event: MouseEvent) {
  if (effectiveDisabled.value || isTagAction(event.target)) return;
  focus();
  handleClick();
}

function handleTagsWheel(event: WheelEvent) {
  const tags = event.currentTarget as HTMLElement;
  const maxScroll = Math.max(0, tags.scrollWidth - tags.clientWidth);
  const unit =
    event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? tags.clientWidth : 1;
  const nextScroll = Math.max(
    0,
    Math.min(
      maxScroll,
      tags.scrollLeft + (event.deltaX || event.deltaY) * unit,
    ),
  );
  if (nextScroll === tags.scrollLeft) return;
  event.preventDefault();
  tags.scrollLeft = nextScroll;
}

function measureDropdownHeight(dropdown: HTMLElement) {
  dropdownZIndex.value = resolvePopupZIndex(rootElement.value, overlay?.layer?.value);
  const list = optionsElement.value;
  const footerHeight =
    dropdown
      .querySelector<HTMLElement>('.zt-select__footer')
      ?.getBoundingClientRect().height ?? 0;
  const style = getComputedStyle(dropdown);
  const borderHeight =
    (Number.parseFloat(style.borderTopWidth) || 0) +
    (Number.parseFloat(style.borderBottomWidth) || 0);
  const headerHeight = dropdown.querySelector<HTMLElement>('.zt-select__header')?.getBoundingClientRect().height ?? 0;
  dropdownChromeHeight.value = headerHeight + footerHeight + borderHeight;
  return list?.scrollHeight
    ? Math.min(props.height, list.scrollHeight) + dropdownChromeHeight.value
    : Math.max(dropdown.scrollHeight + borderHeight, dropdown.getBoundingClientRect().height);
}

function optionId(index: number) {
  return `zt-select-option-${instance?.uid ?? selectId}-${index}`;
}

onBeforeUnmount(() => {
  disposed = true;
  pendingFocusout = undefined;
  remoteSearch.dispose();
});

defineExpose({ focus, blur, open, close });
</script>

<template>
  <div
    ref="rootElement"
    :class="[classes, attrs.class]"
    :style="attrs.style"
    @focusout="handleFocusout"
  >
    <div ref="controlElement" class="zt-select__control">
      <span v-if="$slots.prefix" class="zt-select__prefix"
        ><slot name="prefix"
      /></span>
      <span
        v-if="multiple && selectedOptions.length"
        class="zt-select__tags"
        @mousedown="handleTagsMousedown"
        @click="handleTagsClick"
        @wheel="handleTagsWheel"
      >
        <span
          v-for="option in visibleTagOptions"
          :key="`${typeof option.value}:${String(option.value)}`"
          class="zt-select__tag"
          :class="{ 'is-custom': Boolean($slots.tag) }"
        >
          <slot
            name="tag"
            :option="option"
            :remove="() => removeValue(option.value)"
          >
            <span class="zt-select__tag-label" :title="option.label">{{ option.label }}</span>
            <button
              type="button"
              class="zt-select__tag-remove"
              :aria-label="`移除${option.label}`"
              :disabled="effectiveDisabled"
              @mousedown.prevent
              @click.stop="removeValue(option.value)"
            >
              ×
            </button>
          </slot>
        </span>
        <span
          v-if="collapsedTagCount > 0"
          class="zt-select__tag zt-select__tag-count"
          :aria-label="`另有 ${collapsedTagCount} 项已选`"
        >+{{ collapsedTagCount }}</span>
      </span>
      <span v-else class="zt-select__value">
        <slot v-if="selectedOption" name="selected" :option="selectedOption">{{
          selectedOption.label
        }}</slot>
      </span>
      <input
        ref="comboboxElement"
        class="zt-select__input"
        v-bind="controlAttrs"
        :id="String(attrs.id ?? formItem?.inputId ?? selectId)"
        role="combobox"
        :disabled="effectiveDisabled"
        :readonly="panelSearch || (!filterable && !remote)"
        :value="inputValue"
        :placeholder="
          !selectedOption && !selectedValues.length
            ? placeholder
            : undefined
        "
        :aria-expanded="visible"
        aria-haspopup="listbox"
        :aria-controls="listboxId"
        :aria-activedescendant="panelSearch ? undefined : activeOptionId"
        :aria-disabled="effectiveDisabled"
        :aria-invalid="ariaInvalid"
        :aria-describedby="describedBy"
        @click="handleClick"
        @focus="emit('focus', $event)"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <button
        v-if="canClear"
        type="button"
        class="zt-select__clear"
        aria-label="清空选择"
        @mousedown.prevent
        @click.stop="clear"
      >
        ×
      </button>
      <span class="zt-select__caret" aria-hidden="true" />
    </div>

    <Teleport :to="dropdown.teleportTarget.value">
      <PopupScope v-if="visible">
      <div
        ref="listboxElement"
        :id="panelSearch ? `${selectId}-popup` : listboxId"
        class="zt-select__dropdown"
        :class="[
          {
            'is-upward': placement === 'up',
            'is-downward': placement === 'down',
          },
          effectiveSize !== 'default' &&
            `zt-select__dropdown--${effectiveSize}`,
        ]"
        :data-placement="placement"
        :data-zt-theme="providerTheme"
        :style="[providerStyle, dropdownStyle]"
        :role="panelSearch ? undefined : 'listbox'"
        :aria-multiselectable="!panelSearch && multiple ? 'true' : undefined"
        @focusout="handleFocusout"
        @keydown="handleDropdownKeydown"
      >
        <div v-if="panelSearch" class="zt-select__header">
          <span class="zt-select__search-icon" aria-hidden="true" />
          <input
            ref="searchElement"
            class="zt-select__search-input"
            role="combobox"
            aria-label="搜索选项"
            aria-autocomplete="list"
            :aria-expanded="visible"
            :aria-controls="listboxId"
            :aria-activedescendant="activeOptionId"
            :disabled="effectiveDisabled"
            :value="keyword"
            placeholder="搜索选项"
            @input="handleInput"
            @keydown.stop="handleKeydown"
          />
          <button v-if="keyword" type="button" class="zt-select__search-clear" aria-label="清空搜索" @mousedown.prevent @click.stop="clearSearch">×</button>
        </div>
        <div :id="panelSearch ? listboxId : undefined" class="zt-select__content" :role="panelSearch ? 'listbox' : undefined" :aria-multiselectable="panelSearch ? 'true' : undefined">
        <div
          v-if="remote && remoteSearch.loading.value"
          class="zt-select__loading"
        >
          <slot name="loading">加载中...</slot>
        </div>
        <div
          v-else-if="remote && remoteSearch.failed.value"
          class="zt-select__error"
        >
          {{ remoteErrorText }}
        </div>
        <div
          v-else-if="displayedOptions.length"
          ref="optionsElement"
          class="zt-select__list"
          :style="{ maxHeight: `${listMaxHeight ?? height}px` }"
          @scroll="handleOptionsScroll"
        >
          <div
            v-if="virtual"
            role="presentation"
            :style="{ height: `${optionWindowStart * virtualRowHeight}px` }"
          />
          <div
            v-for="{ option, index } in renderedOptions"
            :id="optionId(index)"
            :key="`${typeof option.value}:${String(option.value)}`"
            class="zt-select__option"
            :class="{
              'is-selected': isSelected(option),
              'is-disabled': option.disabled,
              'is-active': activeIndex === index,
            }"
            role="option"
            :aria-posinset="virtual ? index + 1 : undefined"
            :aria-setsize="virtual ? displayedOptions.length : undefined"
            :style="
              virtual
                ? {
                    height: `${virtualRowHeight}px`,
                    minHeight: `${virtualRowHeight}px`,
                    maxHeight: `${virtualRowHeight}px`,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }
                : undefined
            "
            :aria-selected="isSelected(option)"
            :aria-disabled="Boolean(option.disabled)"
            @mousedown.prevent
            @click="selectOption(option)"
          >
            <slot
              name="option"
              :option="option"
              :selected="isSelected(option)"
              :disabled="Boolean(option.disabled)"
              >{{ option.label }}</slot
            >
          </div>
          <div
            v-if="virtual"
            role="presentation"
            :style="{
              height: `${(displayedOptions.length - optionWindowEnd) * virtualRowHeight}px`,
            }"
          />
        </div>
        <div v-else class="zt-select__empty">
          <slot name="empty">{{ noDataText }}</slot>
        </div>
        </div>
        <div v-if="$slots.footer" class="zt-select__footer">
          <slot name="footer" />
        </div>
      </div>
      </PopupScope>
    </Teleport>
  </div>
</template>
