<script setup lang="ts">
import { ref, computed, nextTick, watch, provide, shallowReactive, useSlots } from 'vue';
import ZtPopover from '../popover/ZtPopover.vue';
import DropdownTrigger from './trigger';
import { useZtSize } from '../config-provider/context';
import { dropdownKey } from './context';
import type { ZtDropdownProps, ZtDropdownItem, ZtDropdownItemProps } from './types';
import './dropdown.scss';
defineOptions({ name: 'ZtDropdown', inheritAttrs: false });
const props = withDefaults(defineProps<ZtDropdownProps>(), {
  items: () => [],
  trigger: 'click',
  disabled: false,
  placement: 'bottom-start',
  hideOnClick: true,
});
const emit = defineEmits<{
  command: [key: string | number, item: ZtDropdownItem];
  'visible-change': [visible: boolean];
}>();
const open = ref(false),
  menu = ref<HTMLElement>(),
  reference = ref<HTMLElement>(),
  triggerDisabled = ref(false),
  size = useZtSize(props);
const slots = useSlots();
const slotItems = shallowReactive(new Map<symbol, ZtDropdownItemProps>());
const hasIcons = computed(() => {
  const items = slots.dropdown ? [...slotItems.values()] : props.items;
  return items.some(item => item.type !== 'divider' && item.type !== 'group' && item.icon);
});
provide(dropdownKey, {
  disabled: computed(() => props.disabled),
  hasIcons,
  choose,
  register(item) {
    const id = Symbol();
    slotItems.set(id, item);
    return () => slotItems.delete(id);
  },
});
function changed(v: boolean, restoreFocus = true) {
  if ((v && (props.disabled || triggerDisabled.value)) || open.value === v) return;
  if (!v && restoreFocus && menu.value?.contains(document.activeElement)) reference.value?.focus();
  open.value = v;
  emit('visible-change', v);
}
async function focus(first = true) {
  await nextTick();
  const items = menu.value?.querySelectorAll<HTMLButtonElement>(
    '[role="menuitem"]:not(:disabled)',
  );
  if (items?.length) items[first ? 0 : items.length - 1].focus();
}
function referenceKey(e: KeyboardEvent) {
  if (props.disabled || triggerDisabled.value) return;
  if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    e.preventDefault();
    changed(true);
    void focus(e.key === 'ArrowDown');
  }
}
function key(e: KeyboardEvent) {
  const items = [
    ...(menu.value?.querySelectorAll<HTMLButtonElement>(
      '[role="menuitem"]:not(:disabled)',
    ) ?? []),
  ];
  if (!items.length) {
    if (e.key === 'Escape') {
      e.preventDefault();
      changed(false);
      reference.value?.focus();
    }
    return;
  }
  const index = items.indexOf(document.activeElement as HTMLButtonElement);
  let next = -1;
  if (e.key === 'ArrowDown') next = (index + 1) % items.length;
  if (e.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
  if (e.key === 'Home') next = 0;
  if (e.key === 'End') next = items.length - 1;
  if (next >= 0) {
    e.preventDefault();
    items[next]?.focus();
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    changed(false);
    reference.value?.focus();
  }
  if (e.key === 'Tab') changed(false, false);
}
watch(
  () => props.disabled,
  (value) => {
    if (value && open.value) changed(false);
  },
);
function choose(item: ZtDropdownItem) {
  if (props.disabled || item.disabled) return;
  emit('command', item.key, item);
  if (props.hideOnClick) {
    changed(false);
    reference.value?.focus();
  }
}
</script>
<template>
  <ZtPopover
    :visible="open"
    :width="width ?? 'max-content'"
    :trigger="trigger"
    :disabled="disabled || triggerDisabled"
    :placement="placement"
    :show-arrow="false"
    :restore-focus="false"
    @update:visible="changed"
    ><DropdownTrigger
      v-bind="$attrs"
      :disabled="disabled"
      :expanded="open"
      :size="size"
      :reference="element => reference = element"
      :on-reference-key="referenceKey"
      :on-disabled-change="value => triggerDisabled = value"
    ><slot /></DropdownTrigger
    ><template #content
      ><div
        ref="menu"
        role="menu"
        aria-label="操作菜单"
        class="zt-dropdown"
        :class="[`zt-dropdown--${size}`, { 'zt-dropdown--auto-width': width === undefined }]"
        @keydown="key"
      >
        <template v-if="$slots.dropdown">
          <slot name="dropdown" />
          <span v-if="!slotItems.size" class="zt-dropdown__empty">暂无操作</span>
        </template>
        <template v-else>
        <template v-for="item in items" :key="item.key"
          ><hr v-if="item.type === 'divider'" role="separator" />
          <div v-else-if="item.type === 'group'" class="zt-dropdown__group">
            {{ item.label }}
          </div>
          <button
            v-else
            type="button"
            role="menuitem"
            class="zt-dropdown__item"
            :disabled="item.disabled"
            @click="choose(item)"
          >
            <slot name="item" :item="item"
              ><span v-if="hasIcons" class="zt-dropdown__icon" aria-hidden="true">{{ item.icon }}</span
              ><span class="zt-dropdown__label">{{ item.label }}</span></slot
            >
          </button></template
        ><span v-if="!items.length" class="zt-dropdown__empty">暂无操作</span>
        </template>
      </div></template
    ></ZtPopover
  >
</template>
