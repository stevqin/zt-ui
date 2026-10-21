<script setup lang="ts">
import { computed, ref, nextTick, useId, type CSSProperties } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import type {
  ZtTableProps,
  ZtTableKey,
  ZtTableRow,
  ZtTableSort,
  ZtTableColumn,
  ZtTableColumnResize,
} from './types';
import TableSelectionControl from './TableSelectionControl.vue';
import ZtIcon from '../icon/ZtIcon.vue';
import { useTableColumnResize } from './resize';
import { legacyTableLayout, type TableLayoutColumn } from './layout';
import './table.scss';
defineOptions({ name: 'ZtTableContent' });
const props = withDefaults(
  defineProps<ZtTableProps & { columnLayout?: TableLayoutColumn[] }>(),
  {
    data: () => [],
    columns: () => [],
    rowKey: 'id',
    selectedKeys: () => [],
    expandedKeys: () => [],
    emptyText: '暂无数据',
    resizable: false,
    selectionType: 'checkbox',
  },
);
const emit = defineEmits<{
  'update:selectedKeys': [keys: ZtTableKey[]];
  'selection-change': [rows: ZtTableRow[]];
  'update:expandedKeys': [keys: ZtTableKey[]];
  'expand-change': [row: ZtTableRow, expanded: boolean];
  'column-resize': [value: ZtTableColumnResize];
  'sort-change': [sort: ZtTableSort];
  'update:sort': [sort: ZtTableSort];
  'row-click': [row: ZtTableRow, event: MouseEvent];
}>();
const config = useZtConfig(),
  size = useZtSize(props),
  localSort = ref<ZtTableSort>({ prop: '', order: null }),
  sortState = computed(() => props.sort ?? localSort.value);
const sortIconSize = computed(
  () =>
    ({ mini: 10, small: 11, default: 12, medium: 13, large: 14 })[size.value],
);
const root = ref<HTMLElement>();
const selectionName = `zt-table-selection-${useId()}`;
const layout = computed(() => props.columnLayout ?? legacyTableLayout(props));
const resize = useTableColumnResize(
  props,
  root,
  (value) => emit('column-resize', value),
  () =>
    layout.value.flatMap((column, position) =>
      column.utility
        ? [
            {
              kind: column.utility,
              width: Math.max(1, column.width ?? 44, column.minWidth ?? 0),
              position,
              fixed: column.fixed,
            },
          ]
        : [],
    ),
);
const layoutWidth = (column: TableLayoutColumn) =>
  column.utility ? resize.utilityWidth(column.utility) : resize.width(column);
function key(row: ZtTableRow): ZtTableKey {
  const value =
    typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey];
  if (typeof value !== 'string' && typeof value !== 'number') {
    // Avoid tearing down the whole tree; fall back to a stable-ish index key.
    return `__zt-row-${props.data.indexOf(row)}`;
  }
  return value;
}
const rows = computed(() => {
  const state = sortState.value,
    column = props.columns.find((c) => c.prop === state.prop);
  if (props.remote || !state.order || !column) return props.data;
  const sign = state.order === 'ascending' ? 1 : -1;
  return props.data
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const av = a.row[column.prop],
        bv = b.row[column.prop];
      const result = column.sortMethod
        ? column.sortMethod(a.row, b.row)
        : typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av ?? '').localeCompare(String(bv ?? ''), 'zh-CN', {
              numeric: true,
            });
      return result * sign || a.index - b.index;
    })
    .map((item) => item.row);
});
const allowed = computed(() =>
    props.data
      .filter((row, index) => !props.selectable || props.selectable(row, index))
      .map(key),
  ),
  all = computed(
    () =>
      allowed.value.length > 0 &&
      allowed.value.every((k) => props.selectedKeys.includes(k)),
  ),
  partial = computed(
    () =>
      !all.value && allowed.value.some((k) => props.selectedKeys.includes(k)),
  );
function select(keys: ZtTableKey[]) {
  if (props.loading) return;
  emit('update:selectedKeys', keys);
  // Native radios uncheck their siblings before Vue accepts a controlled update.
  void nextTick(() => {
    root.value
      ?.querySelectorAll<HTMLInputElement>(
        '.zt-table__selection-control .zt-radio input',
      )
      .forEach((input) => {
        input.checked = !!input
          .closest('.zt-radio')
          ?.classList.contains('is-checked');
      });
  });
  emit(
    'selection-change',
    props.data.filter((r) => keys.includes(key(r))),
  );
}
function selectAll() {
  select(
    all.value
      ? props.selectedKeys.filter((k) => !allowed.value.includes(k))
      : [...new Set([...props.selectedKeys, ...allowed.value])],
  );
}
function toggle(row: ZtTableRow) {
  const k = key(row);
  if (!allowed.value.includes(k)) return;
  select(
    props.selectionType === 'radio'
      ? [k]
      : props.selectedKeys.includes(k)
        ? props.selectedKeys.filter((v) => v !== k)
        : [...props.selectedKeys, k],
  );
}
function expand(row: ZtTableRow) {
  const k = key(row),
    on = !props.expandedKeys.includes(k);
  emit(
    'update:expandedKeys',
    on ? [...props.expandedKeys, k] : props.expandedKeys.filter((v) => v !== k),
  );
  emit('expand-change', row, on);
}
function sortBy(column: ZtTableColumn) {
  const old = sortState.value,
    next: ZtTableSort = {
      prop: column.prop,
      order:
        old.prop !== column.prop || !old.order
          ? 'ascending'
          : old.order === 'ascending'
            ? 'descending'
            : null,
    };
  localSort.value = next;
  emit('update:sort', next);
  emit('sort-change', next);
}
function columnStyle(
  column: TableLayoutColumn,
  index: number,
  header = false,
): CSSProperties {
  const style: CSSProperties = {
    width: `${layoutWidth(column)}px`,
    minWidth: column.utility
      ? `${layoutWidth(column)}px`
      : `${resize.widths.value.has(column.prop) ? Math.min(resize.width(column), resize.minimum(column)) : (column.minWidth ?? column.width ?? 100)}px`,
    textAlign: column.align ?? (column.utility ? 'center' : 'left'),
  };
  if (column.fixed) {
    style.position = 'sticky';
    style[column.fixed] =
      `${layout.value.reduce((sum, c, i) => sum + (c.fixed === column.fixed && (column.fixed === 'left' ? i < index : i > index) ? layoutWidth(c) : 0), 0)}px`;
    style.zIndex = header ? 4 : 2;
  }
  if (header && props.maxHeight) {
    style.position = 'sticky';
    style.top = 0;
    style.zIndex = column.fixed ? 4 : 3;
  }
  return style;
}
const span = computed(() => layout.value.length);
</script>
<template>
  <div
    ref="root"
    class="zt-table"
    :class="[
      `zt-table--${size}`,
      {
        'is-striped': stripe,
        'is-bordered': border,
        'is-resizing': resize.dragging.value,
      },
    ]"
    :style="config.style.value"
    :aria-busy="loading"
  >
    <div
      class="zt-table__scroll"
      :style="{
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      }"
      tabindex="0"
      aria-label="表格滚动区域"
    >
      <table
        :style="{
          minWidth: `${resize.totalWidth.value}px`,
          width: resize.widths.value.size
            ? `${resize.totalWidth.value}px`
            : undefined,
        }"
      >
        <colgroup>
          <col
            v-for="column in layout"
            :key="
              column.utility
                ? `utility-${column.utility}`
                : `data-${column.prop}`
            "
            :style="{ width: `${layoutWidth(column)}px` }"
          />
        </colgroup>
        <thead>
          <tr>
            <template
              v-for="(column, i) in layout"
              :key="
                column.utility
                  ? `utility-${column.utility}`
                  : `data-${column.prop}`
              "
            >
              <th
                v-if="column.utility"
                scope="col"
                class="zt-table__utility"
                :class="`zt-table__${column.utility}`"
                :data-table-utility="column.utility"
                :style="columnStyle(column, i, true)"
                :aria-label="column.label"
              >
                <slot :name="`header-${column.prop}`" :column="column">
                  <TableSelectionControl
                    v-if="
                      column.utility === 'selection' &&
                      selectionType === 'checkbox'
                    "
                    label="全选行"
                    :size="size"
                    :checked="all"
                    :indeterminate="partial"
                    :disabled="loading || !allowed.length"
                    @change="selectAll"
                  />
                </slot>
              </th>
              <th
                v-else
                scope="col"
                :data-column="column.prop"
                :class="{ 'is-resizable': resize.canResize(column) }"
                :style="columnStyle(column, i, true)"
                :aria-sort="
                  sortState.prop === column.prop && sortState.order
                    ? sortState.order
                    : 'none'
                "
              >
                <button
                  v-if="column.sortable"
                  type="button"
                  :data-sort="column.prop"
                  :disabled="loading"
                  @click="sortBy(column)"
                >
                  <slot :name="`header-${column.prop}`" :column="column">{{
                    column.label
                  }}</slot>
                  <span
                    class="zt-table__sort-icons"
                    :style="{ '--zt-table-sort-size': `${sortIconSize}px` }"
                    :class="{
                      'has-order':
                        sortState.prop === column.prop && !!sortState.order,
                    }"
                    aria-hidden="true"
                  >
                    <ZtIcon
                      :size="sortIconSize"
                      :class="{
                        'is-active':
                          sortState.prop === column.prop &&
                          sortState.order === 'ascending',
                      }"
                      ><svg viewBox="0 0 12 8" fill="currentColor">
                        <path d="M1 7 6 1l5 6Z" /></svg
                    ></ZtIcon>
                    <ZtIcon
                      :size="sortIconSize"
                      :class="{
                        'is-active':
                          sortState.prop === column.prop &&
                          sortState.order === 'descending',
                      }"
                      ><svg viewBox="0 0 12 8" fill="currentColor">
                        <path d="m1 1 5 6 5-6Z" /></svg
                    ></ZtIcon>
                  </span></button
                ><slot
                  v-else
                  :name="`header-${column.prop}`"
                  :column="column"
                  >{{ column.label }}</slot
                >
                <span
                  v-if="resize.canResize(column)"
                  class="zt-table__resize-handle"
                  :data-resize="column.prop"
                  role="separator"
                  aria-orientation="vertical"
                  :aria-label="`调整 ${column.label} 列宽`"
                  :aria-valuemin="resize.minimum(column)"
                  :aria-valuemax="
                    Math.max(resize.totalWidth.value, resize.width(column))
                  "
                  :aria-valuetext="`${Math.round(resize.width(column))} 像素`"
                  :aria-valuenow="Math.round(resize.width(column))"
                  :aria-disabled="loading || undefined"
                  :tabindex="loading ? -1 : 0"
                  @pointerdown.stop="resize.start(column, $event)"
                  @click.stop.prevent
                  @keydown.stop="resize.keydown(column, $event)"
                />
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in rows" :key="key(row)"
            ><tr
              :class="{ 'is-selected': selectedKeys.includes(key(row)) }"
              @click="emit('row-click', row, $event)"
            >
              <template
                v-for="(column, i) in layout"
                :key="
                  column.utility
                    ? `utility-${column.utility}`
                    : `data-${column.prop}`
                "
              >
                <td
                  v-if="column.utility"
                  class="zt-table__utility"
                  :class="`zt-table__${column.utility}`"
                  :style="columnStyle(column, i)"
                >
                  <TableSelectionControl
                    v-if="column.utility === 'selection'"
                    :radio="selectionType === 'radio'"
                    :name="selectionName"
                    :size="size"
                    :label="`选择行 ${key(row)}`"
                    :checked="selectedKeys.includes(key(row))"
                    :disabled="loading || !allowed.includes(key(row))"
                    @change="toggle(row)"
                  />
                  <button
                    v-else
                    data-expand
                    type="button"
                    :aria-label="`展开行 ${key(row)}`"
                    :aria-expanded="expandedKeys.includes(key(row))"
                    @click.stop="expand(row)"
                  >
                    {{ expandedKeys.includes(key(row)) ? '−' : '+' }}
                  </button>
                </td>
                <td v-else :style="columnStyle(column, i)">
                  <slot
                    :name="column.slot ?? column.prop"
                    :row="row"
                    :column="column"
                    :value="row[column.prop]"
                    :index="index"
                    >{{
                      column.formatter
                        ? column.formatter(row[column.prop], row, index)
                        : row[column.prop]
                    }}</slot
                  >
                </td>
              </template>
            </tr>
            <tr
              v-if="expandable && expandedKeys.includes(key(row))"
              class="zt-table__expanded"
            >
              <td :colspan="span">
                <slot name="expand" :row="row" :index="index" />
              </td></tr
          ></template>
          <tr v-if="!rows.length">
            <td :colspan="span" class="zt-table__empty">
              <slot name="empty">{{ loading ? '加载中…' : emptyText }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="loading" class="zt-table__loading" role="status">加载中…</div>
  </div>
</template>
