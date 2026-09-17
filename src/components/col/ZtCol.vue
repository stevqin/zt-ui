<script setup lang="ts">
import { computed, inject } from 'vue';
import { rowGutterKey } from '../row/context';
import type { ZtColProps } from './types';
const props = withDefaults(defineProps<ZtColProps>(), { span: 24, offset: 0 });
const gutter = inject(
  rowGutterKey,
  computed(() => 0),
);
const bounded = (value: number) => Math.min(24, Math.max(0, Math.round(value)));
const classes = computed(() => {
  const result = [
    'zt-col',
    `zt-col-${bounded(props.span)}`,
    `zt-col-offset-${bounded(props.offset)}`,
  ];
  for (const key of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
    const entry = props[key];
    if (typeof entry === 'number')
      result.push(`zt-col-${key}-${bounded(entry)}`);
    else if (entry) {
      if (entry.span !== undefined)
        result.push(`zt-col-${key}-${bounded(entry.span)}`);
      if (entry.offset !== undefined)
        result.push(`zt-col-${key}-offset-${bounded(entry.offset)}`);
    }
  }
  return result;
});
</script>
<template>
  <div
    :class="classes"
    :style="{ paddingLeft: gutter / 2 + 'px', paddingRight: gutter / 2 + 'px' }"
  >
    <slot />
  </div>
</template>
<style scoped lang="scss">
.zt-col {
  box-sizing: border-box;
  min-width: 0;
  flex: 0 0 auto;
}
@mixin columns($prefix: '') {
  @for $i from 0 through 24 {
    .zt-col-#{$prefix}#{$i} {
      @if $i == 0 {
        display: none;
      } @else {
        display: block;
      }
      flex-basis: calc($i / 24 * 100%);
      max-width: calc($i / 24 * 100%);
    }
    .zt-col-#{$prefix}offset-#{$i} {
      margin-left: calc($i / 24 * 100%);
    }
  }
}
@include columns();
@each $name, $min in (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px) {
  @media (min-width: $min) {
    @include columns('#{$name}-');
  }
}
</style>
