<script setup lang="ts">
import { computed } from 'vue'
import type { ZtFormGroupProps } from './types'

defineOptions({ name: 'ZtFormGroup' })

const props = withDefaults(defineProps<ZtFormGroupProps>(), {
  title: '',
  description: '',
  disabled: false,
  bordered: false,
})

const classes = computed(() => [
  'zt-form-group',
  props.bordered && 'zt-form-group--bordered',
  props.disabled && 'is-disabled',
])
</script>

<template>
  <fieldset :class="classes" :disabled="disabled">
    <legend v-if="title || $slots.title" class="zt-form-group__legend"><slot name="title">{{ title }}</slot></legend>
    <div v-if="description || $slots.description" class="zt-form-group__description"><slot name="description">{{ description }}</slot></div>
    <div class="zt-form-group__content"><slot /></div>
  </fieldset>
</template>
