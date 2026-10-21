import { Comment, Fragment, isVNode, type Slots } from 'vue';
import ZtTimelineItem from './ZtTimelineItem.vue';
import type {
  ZtTimelineItem as ItemDefinition,
  ZtTimelineItemProps,
} from './types';

export interface TimelineEntry {
  item: ItemDefinition;
  renderKey?: string | number;
  content?: Slots[string];
  node?: Slots[string];
  attrs?: Record<string, unknown>;
}
/** Resolve declarations during render, preserving fragment keys and scoped slots. */
export function resolveTimelineItems(children: unknown): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  function visit(children: unknown, path: (string | number)[] = [], index = 0) {
    if (Array.isArray(children)) {
      children.forEach((child, i) => visit(child, path, i));
      return;
    }
    if (!isVNode(children)) return;
    if (children.type === Fragment) {
      const key =
        typeof children.key === 'string' || typeof children.key === 'number'
          ? children.key
          : index;
      visit(children.children, [...path, 'fragment', typeof key, key]);
      return;
    }
    if (children.type !== ZtTimelineItem) return;
    const raw = children.props ?? {};
    const props = raw as ZtTimelineItemProps;
    const slots = children.children as Slots | null;
    const key =
      typeof children.key === 'string' || typeof children.key === 'number'
        ? children.key
        : index;
    const renderKey = JSON.stringify([...path, 'item', typeof key, key]);
    entries.push({
      renderKey,
      item: {
        key:
          typeof children.key === 'string' || typeof children.key === 'number'
            ? children.key
            : renderKey,
        time: props.time,
        content: props.content,
        status: props.status,
        placement: props.placement,
        hollow:
          props.hollow === true ||
          (raw.hollow as unknown) === '' ||
          raw.hollow === 'hollow',
      },
      content: slots?.default,
      node: slots?.node,
      attrs: Object.fromEntries(
        Object.entries(raw).filter(
          ([name]) =>
            ![
              'key',
              'ref',
              'ref_for',
              'ref_key',
              'time',
              'content',
              'status',
              'placement',
              'hollow',
            ].includes(name),
        ),
      ),
    });
  }
  visit(children);
  return entries;
}

/** Match Vue slot fallback semantics for empty and comment-only branches. */
export function hasTimelineContent(children: unknown): boolean {
  if (Array.isArray(children)) return children.some(hasTimelineContent);
  if (isVNode(children))
    return (
      children.type !== Comment &&
      (children.type !== Fragment || hasTimelineContent(children.children))
    );
  return (
    children !== undefined && children !== null && typeof children !== 'boolean'
  );
}
