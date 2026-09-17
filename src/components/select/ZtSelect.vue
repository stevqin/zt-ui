<script setup lang="ts">
import { useZtConfig } from '../config-provider/context';
const { style: providerStyle } = useZtConfig();
import { useZtSize } from '../config-provider/context';
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  ref,
  toRef,
  useAttrs,
  watch,
} from 'vue';
import { ztFormItemKey } from '../form/context';
import { overlayContextKey } from '../overlay/context';
import {
  filterSelectOptions,
  isOptionSelected,
  multipleValues,
  singleValue,
} from './options';
import { useRemoteSearch } from './useRemoteSearch';
import type {
  ZtSelectModelValue,
  ZtSelectOption,
  ZtSelectProps,
  ZtSelectValue,
} from './types';
import './select.scss';

defineOptions({ name: 'ZtSelect', inheritAttrs: false });

const props = withDefaults(defineProps<ZtSelectProps>(), {
  modelValue: null,
  options: () => [],
  virtual: false,
  height: 280,
  multiple: false,
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
const listboxElement = ref<HTMLElement>();
const optionsElement = ref<HTMLElement>();
const visible = ref(false);
const keyword = ref('');
const searching = ref(false);
const activeIndex = ref(-1);
const placement = ref<'up' | 'down'>('down');
const dropdownPosition = ref({ top: 0, left: 0, width: 0 });
const dropdownZIndex = ref(2000);
const dropdownMaxHeight = ref<number>();
const listMaxHeight = ref<number>();
const hasRemoteSearch = ref(false);
const retainedRemoteOptions = ref<ZtSelectOption[]>([]);
const remoteSearch = useRemoteSearch(
  toRef(props, 'remoteMethod'),
  toRef(props, 'debounce'),
);
let outsideClickListening = false;
let dropdownResizeObserver: ResizeObserver | undefined;
const selectId = `zt-select-${instance?.uid ?? Math.random().toString(36).slice(2)}`;
const listboxId = `${selectId}-listbox`;
const effectiveSize = useZtSize(props, () => formItem?.size.value);
const effectiveDisabled = computed(
  () => props.disabled || formItem?.disabled.value || false,
);
const valueOptions = computed(() =>
  props.remote
    ? [
        ...remoteSearch.options.value,
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
        ? remoteSearch.options.value
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
const dropdownStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  width: `${dropdownPosition.value.width}px`,
  zIndex: dropdownZIndex.value,
  maxHeight:
    dropdownMaxHeight.value === undefined
      ? undefined
      : `${dropdownMaxHeight.value}px`,
}));
const inputValue = computed(() =>
  searching.value ? keyword.value : (selectedOption.value?.label ?? ''),
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
  effectiveSize.value !== 'default' && `zt-select--${effectiveSize.value}`,
  effectiveDisabled.value && 'is-disabled',
  visible.value && 'is-open',
  (props.filterable || props.remote) && 'is-searchable',
  keyword.value && 'has-keyword',
  searching.value && 'is-searching',
  hasSelection.value && 'has-selection',
  props.multiple && 'is-multiple',
]);
const controlAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, ...rest } = attrs;
  return rest;
});

const unregisterOverlayBranch = overlay?.registerBranch({
  trigger: rootElement,
  popup: listboxElement,
  visible,
  close,
  focus,
});
watch(
  () => overlay?.interactive.value,
  (interactive) => {
    if (interactive === false) close();
  },
);

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
  visible.value = next;
  if (next) {
    startOutsideClickListening();
    void nextTick(() => {
      updateDropdownPosition();
      startDropdownResizeObserver();
    });
  } else {
    stopOutsideClickListening();
    stopDropdownResizeObserver();
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
  const next = selectedValues.value.filter((item) => item !== value);
  emit('remove-tag', value);
  emit('update:modelValue', next);
  emit('change', next);
  void formItem?.validate('change');
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
  searching.value = true;
  keyword.value = (event.target as HTMLInputElement).value;
  activeIndex.value = -1;
  emit('search', keyword.value);
  open();
  if (!props.remote) return;
  hasRemoteSearch.value = true;
  remoteSearch.search(keyword.value, (reason) => emit('remote-error', reason));
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
    close();
    return;
  }
  if (event.key !== 'Backspace' || !props.multiple || keyword.value) return;
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

function handleFocusout(event: FocusEvent) {
  const nextTarget = event.relatedTarget;
  if (
    nextTarget instanceof Node &&
    (rootElement.value?.contains(nextTarget) ||
      listboxElement.value?.contains(nextTarget))
  )
    return;
  emit('blur', event);
  close();
  void formItem?.validate('blur');
}

function focus(options?: FocusOptions) {
  comboboxElement.value?.focus(options);
}

function blur() {
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

function handleDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (
    rootElement.value?.contains(target) ||
    listboxElement.value?.contains(target)
  )
    return;
  close();
}

function updateDropdownPosition() {
  dropdownZIndex.value = resolveDropdownZIndex();
  const control = controlElement.value;
  const dropdown = listboxElement.value;
  if (!control || !dropdown) return;
  const controlRect = control.getBoundingClientRect();
  const dropdownRect = dropdown.getBoundingClientRect();
  const list = optionsElement.value;
  const footerHeight =
    dropdown
      .querySelector<HTMLElement>('.zt-select__footer')
      ?.getBoundingClientRect().height ?? 0;
  const style = getComputedStyle(dropdown);
  const borderHeight =
    (Number.parseFloat(style.borderTopWidth) || 0) +
    (Number.parseFloat(style.borderBottomWidth) || 0);
  const chromeHeight = footerHeight + borderHeight;
  const menuHeight = list?.scrollHeight
    ? Math.min(props.height, list.scrollHeight) + chromeHeight
    : Math.max(dropdown.scrollHeight + borderHeight, dropdownRect.height);
  // Leave the CSS six-pixel trigger gap and an eight-pixel viewport gutter.
  const lowerSpace = Math.max(0, window.innerHeight - controlRect.bottom - 14);
  const upperSpace = Math.max(0, controlRect.top - 14);
  const opensUpward = lowerSpace < menuHeight && upperSpace > lowerSpace;
  const availableHeight = opensUpward ? upperSpace : lowerSpace;
  const menuVisibleHeight = Math.min(menuHeight, availableHeight);

  placement.value = opensUpward ? 'up' : 'down';
  dropdownMaxHeight.value = availableHeight;
  listMaxHeight.value = Math.max(
    0,
    Math.min(props.height, availableHeight - chromeHeight),
  );
  dropdownPosition.value = {
    top: opensUpward ? controlRect.top - menuVisibleHeight : controlRect.bottom,
    left: controlRect.left,
    width: controlRect.width,
  };
}

function resolveDropdownZIndex() {
  const overlay = rootElement.value?.closest<HTMLElement>(
    '.zt-modal, .zt-drawer',
  );
  if (!overlay) return 2000;
  const layer = Number.parseFloat(
    overlay.style.zIndex || getComputedStyle(overlay).zIndex,
  );
  return Number.isFinite(layer) ? Math.max(2000, Math.floor(layer) + 1) : 2000;
}

function startDropdownResizeObserver() {
  stopDropdownResizeObserver();
  if (typeof ResizeObserver === 'undefined' || !listboxElement.value) return;
  dropdownResizeObserver = new ResizeObserver(updateDropdownPosition);
  dropdownResizeObserver.observe(listboxElement.value);
}

function stopDropdownResizeObserver() {
  dropdownResizeObserver?.disconnect();
  dropdownResizeObserver = undefined;
}

function startOutsideClickListening() {
  if (outsideClickListening) return;
  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('scroll', updateDropdownPosition, true);
  window.addEventListener('resize', updateDropdownPosition);
  outsideClickListening = true;
}

function stopOutsideClickListening() {
  if (!outsideClickListening) return;
  document.removeEventListener('click', handleDocumentClick);
  window.removeEventListener('scroll', updateDropdownPosition, true);
  window.removeEventListener('resize', updateDropdownPosition);
  outsideClickListening = false;
}

function optionId(index: number) {
  return `zt-select-option-${instance?.uid ?? selectId}-${index}`;
}

onBeforeUnmount(() => {
  unregisterOverlayBranch?.();
  stopOutsideClickListening();
  stopDropdownResizeObserver();
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
          v-for="option in selectedOptions"
          :key="`${typeof option.value}:${String(option.value)}`"
          class="zt-select__tag"
          :class="{ 'is-custom': Boolean($slots.tag) }"
        >
          <slot
            name="tag"
            :option="option"
            :remove="() => removeValue(option.value)"
          >
            <span>{{ option.label }}</span>
            <button
              type="button"
              class="zt-select__tag-remove"
              :aria-label="`移除${option.label}`"
              tabindex="-1"
              @mousedown.prevent
              @click.stop="removeValue(option.value)"
            >
              ×
            </button>
          </slot>
        </span>
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
        :readonly="!filterable && !remote"
        :value="inputValue"
        :placeholder="
          !selectedOption && !selectedValues.length ? placeholder : undefined
        "
        :aria-expanded="visible"
        aria-haspopup="listbox"
        :aria-controls="listboxId"
        :aria-activedescendant="activeOptionId"
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
        tabindex="-1"
        @mousedown.prevent
        @click.stop="clear"
      >
        ×
      </button>
      <span class="zt-select__caret" aria-hidden="true" />
    </div>

    <Teleport to="body">
      <div
        v-if="visible"
        ref="listboxElement"
        :id="listboxId"
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
        :style="[providerStyle, dropdownStyle]"
        role="listbox"
        :aria-multiselectable="multiple ? 'true' : undefined"
        @focusout="handleFocusout"
        @keydown="handleDropdownKeydown"
      >
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
        <div v-if="$slots.footer" class="zt-select__footer">
          <slot name="footer" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
