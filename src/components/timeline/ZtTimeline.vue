<script setup lang="ts">
import { computed } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import type { ZtTimelineProps } from './types';
import './timeline.scss';
defineOptions({ name: 'ZtTimeline' });
const props = withDefaults(defineProps<ZtTimelineProps>(), {
  items: () => [],
  placement: 'right',
});
const config = useZtConfig(),
  size = useZtSize(props),
  ordered = computed(() =>
    props.reverse ? [...props.items].reverse() : props.items,
  );
</script>
<template>
  <ol
    class="zt-timeline"
    :class="[`zt-timeline--${placement}`, `zt-timeline--${size}`]"
    :style="config.style.value"
  >
    <li
      v-for="(item, index) in ordered"
      :key="item.key"
      class="zt-timeline__item"
      :class="[
        `zt-timeline__item--${item.placement ?? (placement === 'alternate' ? (index % 2 ? 'left' : 'right') : placement)}`,
        `zt-timeline__item--${item.status ?? 'default'}`,
        { 'is-hollow': item.hollow },
      ]"
    >
      <div class="zt-timeline__axis">
        <span class="zt-timeline__node"
          ><slot name="node" :item="item" :index="index"
        /></span>
      </div>
      <div class="zt-timeline__body">
        <time v-if="item.time" class="zt-timeline__time">{{ item.time }}</time>
        <div class="zt-timeline__content">
          <slot :item="item" :index="index">{{ item.content }}</slot>
        </div>
      </div>
    </li>
  </ol>
</template>
