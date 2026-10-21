<script setup lang="ts">
import { hierarchyStyle } from '../tree/appearance';
import { computed, ref, watch, nextTick, onBeforeUnmount, useId } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import ZtIcon from '../icon/ZtIcon.vue';
import {
  flattenTree,
  toggleChecked,
  partialChecked,
  normalizeChecked,
  checkedKeysForRows,
  type TreeRow,
} from './model';
import type { ZtTreeProps, ZtTreeKey, ZtTreeNode } from './types';
import './tree.scss';
defineOptions({ name: 'ZtTree' });
const props = withDefaults(defineProps<ZtTreeProps>(), {
  data: () => [],
  checkedKeys: () => [],
  selectedKeys: () => [],
  defaultExpandedKeys: () => [],
  height: 280,
  filter: '',
  autoItemHeight: false,
});
const emit = defineEmits<{
  'update:checkedKeys': [keys: ZtTreeKey[]];
  'update:selectedKeys': [keys: ZtTreeKey[]];
  'update:expandedKeys': [keys: ZtTreeKey[]];
  check: [keys: ZtTreeKey[], node: ZtTreeNode];
  select: [node: ZtTreeNode];
  'load-error': [error: unknown, node: ZtTreeNode];
}>();
const config = useZtConfig(),
  size = useZtSize(props),
  root = ref<HTMLElement>(),
  expanded = ref(props.defaultExpandedKeys.slice()),
  loaded = ref(new Map<ZtTreeKey, ZtTreeNode[]>()),
  loading = ref(new Set<ZtTreeKey>()),
  errors = ref(new Set<ZtTreeKey>()),
  active = ref<ZtTreeKey>(),
  scroll = ref(0);
let alive = true,
  epoch = 0;
watch(
  () => props.data,
  () => {
    epoch++;
    loaded.value = new Map();
    loading.value = new Set();
    errors.value = new Set();
  },
);
onBeforeUnmount(() => {
  alive = false;
  epoch++;
});
const rows = computed(() =>
    flattenTree(props.data, props.fields, loaded.value),
  ),
  open = computed(() => props.expandedKeys ?? expanded.value);
const visible = computed(() => {
  const q = props.filter.toLowerCase();
  const matches = q
    ? rows.value.filter((r) => r.label.toLowerCase().includes(q))
    : [];
  return rows.value.filter((r) =>
    q
      ? matches.some(
          (m) => m.path.includes(r.key) || r.path.slice(0, -1).includes(m.key),
        )
      : r.path.slice(0, -1).every((k) => open.value.includes(k)),
  );
});
const rowHeight = computed(() =>
    Math.max(
      20,
      props.itemHeight ??
        { mini: 24, small: 28, default: 32, medium: 36, large: 40 }[size.value],
    ),
  ),
  autoHeight = computed(() => props.autoItemHeight && !props.virtual),
  start = computed(() =>
    props.virtual
      ? Math.max(0, Math.floor(scroll.value / rowHeight.value) - 3)
      : 0,
  ),
  windowRows = computed(() =>
    props.virtual
      ? visible.value.slice(
          start.value,
          start.value + Math.ceil(props.height / rowHeight.value) + 6,
        )
      : visible.value,
  );
watch(
  [visible, rowHeight, autoHeight, () => props.height, () => props.virtual],
  async () => {
    if (!visible.value.some((r) => r.key === active.value))
      active.value = visible.value.find((r) => !r.disabled)?.key;
    if (props.virtual) {
      scroll.value = Math.min(
        scroll.value,
        Math.max(0, visible.value.length * rowHeight.value - props.height),
      );
      if (root.value) root.value.scrollTop = scroll.value;
    } else {
      await nextTick();
      const element = root.value;
      if (element?.clientHeight) {
        scroll.value = Math.min(
          scroll.value,
          Math.max(0, element.scrollHeight - element.clientHeight),
        );
        element.scrollTop = scroll.value;
      }
    }
  },
  { immediate: true },
);
async function expand(row: TreeRow, retry = false) {
  if (props.disabled || row.disabled) return;
  let keys = open.value.slice();
  if (keys.includes(row.key) && !retry)
    keys = keys.filter((k) => k !== row.key);
  else if (!keys.includes(row.key)) keys.push(row.key);
  expanded.value = keys;
  emit('update:expandedKeys', keys);
  if (
    keys.includes(row.key) &&
    props.load &&
    !loaded.value.has(row.key) &&
    !rows.value.some((r) => r.parent === row.key) &&
    !loading.value.has(row.key)
  ) {
    const token = epoch;
    loading.value.add(row.key);
    errors.value.delete(row.key);
    try {
      const children = await props.load(row.node);
      if (alive && token === epoch) loaded.value.set(row.key, children);
    } catch (e) {
      if (alive && token === epoch) {
        errors.value.add(row.key);
        emit('load-error', e, row.node);
      }
    } finally {
      if (token === epoch) loading.value.delete(row.key);
    }
  }
}
const displayChecked = computed(() =>
  props.checkStrictly
    ? checkedKeysForRows(rows.value, props.checkedKeys)
    : normalizeChecked(rows.value, props.checkedKeys),
);
function check(row: TreeRow, event?: Event) {
  if (props.disabled || row.disabled || !row.checkable) return;
  const keys = toggleChecked(
    rows.value,
    displayChecked.value,
    row.key,
    Boolean(props.checkStrictly),
  );
  emit('update:checkedKeys', keys);
  emit('check', keys, row.node);
  if (event)
    (event.target as HTMLInputElement).checked = displayChecked.value.includes(
      row.key,
    );
}
function select(row: TreeRow, event?: MouseEvent) {
  if (
    props.disabled ||
    row.disabled ||
    event?.defaultPrevented ||
    (event && isInnerControl(event.target))
  )
    return;
  active.value = row.key;
  emit('update:selectedKeys', [row.key]);
  emit('select', row.node);
}
async function focusRow(index: number) {
  const row = visible.value[index];
  if (!row || row.disabled) return;
  active.value = row.key;
  if (props.virtual && root.value) {
    const top = index * rowHeight.value;
    if (top < root.value.scrollTop) root.value.scrollTop = top;
    else if (top + rowHeight.value > root.value.scrollTop + props.height)
      root.value.scrollTop = top + rowHeight.value - props.height;
    scroll.value = root.value.scrollTop;
  }
  await nextTick();
  if (!props.virtual && root.value?.clientHeight) {
    const element = root.value.firstElementChild?.children.item(index) as
      HTMLElement | undefined;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const top = root.value.getBoundingClientRect().top + root.value.clientTop;
    if (bounds.top < top || bounds.height > root.value.clientHeight)
      root.value.scrollTop += bounds.top - top;
    else if (bounds.bottom > top + root.value.clientHeight)
      root.value.scrollTop += bounds.bottom - top - root.value.clientHeight;
    scroll.value = root.value.scrollTop;
  }
}
function isInnerControl(eventTarget: EventTarget | null) {
  const target = eventTarget instanceof Element ? eventTarget : undefined;
  if (target && target !== root.value) {
    if (target.closest('[role="tree"]') !== root.value) return true;
    const label = target.closest('label');
    if (label?.control) return true;
    const control = target.closest(
      'input,textarea,select,button,a[href],summary,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"],[role="button"],[role="checkbox"],[role="switch"],[tabindex]:not([tabindex="-1"])',
    );
    return !!control && control !== root.value;
  }
  return false;
}
function keydown(e: KeyboardEvent) {
  if (
    props.disabled ||
    e.defaultPrevented ||
    e.isComposing ||
    isInnerControl(e.target)
  )
    return;
  const enabled = visible.value.filter((r) => !r.disabled),
    i = enabled.findIndex((r) => r.key === active.value),
    row = enabled[Math.max(0, i)];
  if (!row) return;
  if (
    [
      'ArrowDown',
      'ArrowUp',
      'Home',
      'End',
      'ArrowRight',
      'ArrowLeft',
      'Enter',
      ' ',
    ].includes(e.key)
  )
    e.preventDefault();
  if (
    e.key === 'ArrowDown' ||
    e.key === 'ArrowUp' ||
    e.key === 'Home' ||
    e.key === 'End'
  ) {
    const n =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? enabled.length - 1
          : Math.min(
              enabled.length - 1,
              Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)),
            );
    void focusRow(visible.value.indexOf(enabled[n]!));
  } else if (e.key === 'ArrowRight') {
    if (row.branch && !open.value.includes(row.key)) void expand(row);
    else if (row.branch) {
      const child = visible.value.find(
        (candidate) => candidate.parent === row.key && !candidate.disabled,
      );
      if (child) void focusRow(visible.value.indexOf(child));
    }
  } else if (e.key === 'ArrowLeft') {
    if (open.value.includes(row.key)) void expand(row);
    else void focusRow(visible.value.findIndex((r) => r.key === row.parent));
  } else if (e.key === 'Enter') select(row);
  else if (e.key === ' ' && props.checkable) check(row);
}
const uid = useId();
</script>
<template>
  <div
    ref="root"
    class="zt-tree"
    :class="[`zt-tree--${size}`, { 'zt-tree--auto-height': autoHeight }]"
    :style="[
      config.style.value,
      hierarchyStyle(status),
      { maxHeight: `${height}px`, overflow: 'auto' },
    ]"
    role="tree"
    :aria-disabled="disabled"
    :aria-multiselectable="checkable"
    :aria-activedescendant="
      !windowRows.some((row) => row.key === active)
        ? undefined
        : `${uid}-${String(active)}`
    "
    :tabindex="disabled ? -1 : 0"
    @keydown="keydown"
    @scroll="scroll = ($event.target as HTMLElement).scrollTop"
  >
    <div
      :style="
        virtual
          ? { height: `${visible.length * rowHeight}px`, position: 'relative' }
          : {}
      "
    >
      <div
        v-for="(row, index) in windowRows"
        :id="`${uid}-${String(row.key)}`"
        :key="row.key"
        role="treeitem"
        :aria-level="row.depth + 1"
        :aria-expanded="row.branch ? open.includes(row.key) : undefined"
        :aria-selected="selectedKeys.includes(row.key)"
        :aria-checked="
          checkable && row.checkable
            ? partialChecked(rows, displayChecked, row.key) && !checkStrictly
              ? 'mixed'
              : displayChecked.includes(row.key)
            : undefined
        "
        :aria-disabled="disabled || row.disabled"
        class="zt-tree__row"
        :class="{
          'is-active': active === row.key,
          'is-selected': selectedKeys.includes(row.key),
        }"
        :style="{
          paddingLeft: `${row.depth * 20 + 8}px`,
          height: autoHeight ? 'auto' : `${rowHeight}px`,
          minHeight: autoHeight ? `${rowHeight}px` : undefined,
          ...(virtual
            ? {
                position: 'absolute',
                top: `${(start + index) * rowHeight}px`,
                left: 0,
                right: 0,
              }
            : {}),
        }"
        @click="select(row, $event)"
      >
        <button
          v-if="row.branch"
          data-expand
          class="zt-tree__expand"
          type="button"
          tabindex="-1"
          :disabled="disabled || row.disabled"
          :aria-label="open.includes(row.key) ? '收起' : '展开'"
          :aria-busy="loading.has(row.key) || undefined"
          @click.stop="expand(row)"
        >
          <slot
            name="expand-icon"
            :node="row.node"
            :expanded="open.includes(row.key)"
            :loading="loading.has(row.key)"
            :disabled="disabled || row.disabled"
          >
            <ZtIcon
              :name="loading.has(row.key) ? 'refresh' : 'chevron-right'"
              :spin="loading.has(row.key)"
              class="zt-tree__expand-icon"
              :class="{
                'is-expanded': open.includes(row.key) && !loading.has(row.key),
              }"
            />
          </slot></button
        ><span v-else class="zt-tree__indent" /><input
          v-if="checkable && row.checkable"
          type="checkbox"
          tabindex="-1"
          :aria-label="row.label"
          :disabled="disabled || row.disabled"
          :checked="displayChecked.includes(row.key)"
          :indeterminate="
            !checkStrictly && partialChecked(rows, displayChecked, row.key)
          "
          @click.stop
          @change="check(row, $event)"
        />
        <div class="zt-tree__content">
          <slot
            :node="row.node"
            :checked="displayChecked.includes(row.key)"
            :expanded="open.includes(row.key)"
            :disabled="disabled || row.disabled"
            :checkable="checkable && row.checkable"
            >{{ row.label }}</slot
          >
        </div>
        <button
          v-if="errors.has(row.key)"
          data-retry
          type="button"
          @click.stop="expand(row, true)"
        >
          加载失败，重试
        </button>
      </div>
    </div>
    <div v-if="!visible.length" class="zt-tree__empty">暂无数据</div>
  </div>
</template>
