<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue';
import { dropdownKey } from './context';
import type { ZtDropdownItemProps } from './types';

defineOptions({ name: 'ZtDropdownItem' });
const props = withDefaults(defineProps<ZtDropdownItemProps>(), {
  command: '',
  disabled: false,
  type: 'item',
});
const context = inject(dropdownKey, undefined);
const disabled = computed(() => props.disabled || context?.disabled.value === true);
const unregister = context?.register(props);
onBeforeUnmount(() => unregister?.());

function choose() {
  if (disabled.value) return;
  context?.choose({
    key: props.command,
    label: props.label,
    icon: props.icon,
    disabled: props.disabled,
    type: props.type,
  });
}
</script>

<template>
  <hr v-if="type === 'divider'" role="separator" />
  <div v-else-if="type === 'group'" class="zt-dropdown__group">
    <slot>{{ label }}</slot>
  </div>
  <button
    v-else
    type="button"
    role="menuitem"
    class="zt-dropdown__item"
    :disabled="disabled"
    @click="choose"
  >
    <span v-if="context?.hasIcons.value" class="zt-dropdown__icon" aria-hidden="true">{{ icon }}</span>
    <span class="zt-dropdown__label"><slot>{{ label }}</slot></span>
  </button>
</template>
