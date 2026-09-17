<script setup lang="ts">
import { ref, watch } from 'vue';
import { useZtSize } from '../config-provider/context';
import { useScrollTarget, scrollTop, motion } from '../anchor/scroll';
import type { ZtBacktopProps, ZtBacktopEmits } from './types';
const props = withDefaults(defineProps<ZtBacktopProps>(), {
  visibilityHeight: 200,
  right: 24,
  bottom: 24,
  label: '返回顶部',
});
const emit = defineEmits<ZtBacktopEmits>(),
  visible = ref(false),
  size = useZtSize(props);
const binding = useScrollTarget(
  () => props.container,
  (target) => (visible.value = scrollTop(target) > props.visibilityHeight),
);
watch(() => props.visibilityHeight, binding.update);
function back(event: MouseEvent) {
  binding.getTarget().scrollTo({ top: 0, behavior: motion() });
  emit('click', event);
}
</script>
<template>
  <button
    v-if="visible"
    type="button"
    :class="['zt-backtop', `zt-backtop--${size}`]"
    :style="{ right: right + 'px', bottom: bottom + 'px' }"
    :aria-label="label"
    @click="back"
  >
    <slot>↑</slot>
  </button>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-backtop {
  @include glass.tokens;
  position: fixed;
  z-index: 99;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--glass-line);
  border-radius: glass.radius(11px);
  background: var(--glass-default-soft);
  color: var(--glass-accent);
  box-shadow: var(--glass-shadow);
  font: 20px var(--glass-font);
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid var(--glass-accent);
    outline-offset: 3px;
  }
  &--mini {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  &--small {
    width: 34px;
    height: 34px;
    font-size: 17px;
  }
  &--medium {
    width: 46px;
    height: 46px;
    font-size: 23px;
  }
  &--large {
    width: 52px;
    height: 52px;
    font-size: 26px;
  }
}
</style>
