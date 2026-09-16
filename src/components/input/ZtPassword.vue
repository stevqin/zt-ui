<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, inject, ref } from 'vue'
import { ztFormItemKey } from '../form/context'
import ZtInput from './ZtInput.vue'
import type { ZtPasswordProps } from './types'

defineOptions({ name: 'ZtPassword', inheritAttrs: false })

const props = withDefaults(defineProps<ZtPasswordProps>(), {
  modelValue: '',
  status: 'default',
  disabled: false,
  readonly: false,
  autocomplete: 'current-password',
  clearable: false,
  showWordLimit: false,
  showToggle: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  'visibility-change': [visible: boolean]
}>()

const inputRef = ref<InstanceType<typeof ZtInput>>()
const formItem = inject(ztFormItemKey, undefined)
const visible = ref(false)
const effectiveSize = useZtSize(props, () => formItem?.size.value)
const effectiveDisabled = computed(() => props.disabled || formItem?.disabled.value || false)
const classes = computed(() => [
  'zt-password',
  effectiveSize.value !== 'default' && `zt-password--${effectiveSize.value}`,
])

function toggleVisibility() {
  if (effectiveDisabled.value) return
  visible.value = !visible.value
  emit('visibility-change', visible.value)
  inputRef.value?.focus()
}

defineExpose({
  focus: (options?: FocusOptions) => inputRef.value?.focus(options),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
  clear: () => inputRef.value?.clear(),
})
</script>

<template>
  <ZtInput
    ref="inputRef"
    :class="classes"
    :model-value="modelValue"
    :type="visible ? 'text' : 'password'"
    :size="effectiveSize"
    :status="status"
    :disabled="effectiveDisabled"
    :readonly="readonly"
    :autocomplete="props.autocomplete"
    :clearable="clearable"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    v-bind="$attrs"
    @update:model-value="emit('update:modelValue', $event)"
    @input="emit('input', $event)"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @clear="emit('clear')"
  >
    <template v-if="$slots.prepend" #prepend><slot name="prepend" /></template>
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template v-if="showToggle || $slots.suffix" #suffix>
      <slot name="suffix" />
      <button
        v-if="showToggle"
        type="button"
        class="zt-password__toggle"
        :aria-label="visible ? '隐藏密码' : '显示密码'"
        :disabled="effectiveDisabled"
        tabindex="-1"
        @mousedown.prevent
        @click="toggleVisibility"
      >
        <svg v-if="visible" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4.5 8.5 4.5a15 15 0 0 1-2.2 2.6M6.6 6.6A14.4 14.4 0 0 0 3.5 9s3.5 4.5 8.5 4.5c.7 0 1.4-.1 2-.3" /></svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12S7 7.5 12 7.5s8.5 4.5 8.5 4.5-3.5 4.5-8.5 4.5S3.5 12 3.5 12Z" /><circle cx="12" cy="12" r="2.4" /></svg>
      </button>
    </template>
    <template v-if="$slots.append" #append><slot name="append" /></template>
  </ZtInput>
</template>
