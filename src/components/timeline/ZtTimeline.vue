<script setup lang="ts">
import { h, type Slots, type VNode, type StyleValue } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import {
  resolveTimelineItems,
  hasTimelineContent,
  type TimelineEntry,
} from './items';
import type { ZtTimelineProps, ZtTimelineItemScope } from './types';
import './timeline.scss';
defineOptions({ name: 'ZtTimeline', inheritAttrs: false });
const props = withDefaults(defineProps<ZtTimelineProps>(), {
  placement: 'right',
});
const config = useZtConfig(),
  size = useZtSize(props);
defineSlots<{
  /** 通过 ZtTimelineItem 声明节点；items 模式下仍为内容作用域插槽。 */
  default?: (scope: ZtTimelineItemScope) => VNode[];
  /** 自定义节点图标；模板节点可通过自身 node 插槽覆盖。 */
  node?: (scope: ZtTimelineItemScope) => VNode[];
}>();
const RenderTimeline = (input: {
  timelineSlots: Slots;
  timelineAttrs: Record<string, unknown>;
}) => {
  const slots = input.timelineSlots;
  const entries: TimelineEntry[] =
    props.items !== undefined
      ? props.items.map((item) => ({
          item,
          content: slots.default,
          node: slots.node,
        }))
      : resolveTimelineItems(slots.default?.());
  const ordered = props.reverse ? [...entries].reverse() : entries;
  return h(
    'ol',
    {
      ...input.timelineAttrs,
      class: [
        'zt-timeline',
        `zt-timeline--${props.placement}`,
        `zt-timeline--${size.value}`,
        input.timelineAttrs.class,
      ],
      style: [config.style.value, input.timelineAttrs.style as StyleValue],
    },
    ordered.map((entry, index) => {
      const item = entry.item;
      const scope: ZtTimelineItemScope = { item, index };
      let nodeContent = (entry.node ?? slots.node)?.(scope);
      if (
        !hasTimelineContent(nodeContent) &&
        entry.node &&
        entry.node !== slots.node
      )
        nodeContent = slots.node?.(scope);
      const hasNode = hasTimelineContent(nodeContent);
      const content = entry.content?.(scope);
      const placement =
        item.placement ??
        (props.placement === 'alternate'
          ? index % 2
            ? 'left'
            : 'right'
          : props.placement);
      return h(
        'li',
        {
          ...entry.attrs,
          key: entry.renderKey ?? item.key,
          class: [
            'zt-timeline__item',
            `zt-timeline__item--${placement}`,
            `zt-timeline__item--${item.status ?? 'default'}`,
            { 'is-hollow': item.hollow },
            entry.attrs?.class,
          ],
        },
        [
          h('div', { class: 'zt-timeline__axis' }, [
            h(
              'span',
              { class: ['zt-timeline__node', { 'is-custom': hasNode }] },
              hasNode ? nodeContent : undefined,
            ),
          ]),
          h('div', { class: 'zt-timeline__body' }, [
            item.time
              ? h('time', { class: 'zt-timeline__time' }, item.time)
              : null,
            h(
              'div',
              { class: 'zt-timeline__content' },
              hasTimelineContent(content) ? content : item.content,
            ),
          ]),
        ],
      );
    }),
  );
};
RenderTimeline.props = ['timelineSlots', 'timelineAttrs'];
</script>
<template>
  <RenderTimeline
    :timeline-slots="{ ...$slots }"
    :timeline-attrs="{ ...$attrs }"
  />
</template>
