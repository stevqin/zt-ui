<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import type {
  ZtTableProps,
  ZtTableKey,
  ZtTableRow,
  ZtTableSort,
  ZtTableColumn,
} from './types';
import './table.scss';
defineOptions({ name: 'ZtTable' });
const props = withDefaults(defineProps<ZtTableProps>(), {
  data: () => [],
  columns: () => [],
  rowKey: 'id',
  selectedKeys: () => [],
  expandedKeys: () => [],
  emptyText: '暂无数据',
});
const emit = defineEmits<{
  'update:selectedKeys': [keys: ZtTableKey[]];
  'selection-change': [rows: ZtTableRow[]];
  'update:expandedKeys': [keys: ZtTableKey[]];
  'expand-change': [row: ZtTableRow, expanded: boolean];
  'sort-change': [sort: ZtTableSort];
  'update:sort': [sort: ZtTableSort];
  'row-click': [row: ZtTableRow, event: MouseEvent];
}>();
const config = useZtConfig(),
  size = useZtSize(props),
  localSort = ref<ZtTableSort>({ prop: '', order: null }),
  sortState = computed(() => props.sort ?? localSort.value);
function key(row: ZtTableRow): ZtTableKey {
  const value =
    typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey];
  if (typeof value !== 'string' && typeof value !== 'number')
    throw new Error('ZtTable rowKey must resolve to a stable string or number');
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
  emit(
    'selection-change',
    props.data.filter((r) => keys.includes(key(r))),
  );
}
function selectAll(event: Event) {
  select(
    all.value
      ? props.selectedKeys.filter((k) => !allowed.value.includes(k))
      : [...new Set([...props.selectedKeys, ...allowed.value])],
  );
  (event.target as HTMLInputElement).checked = all.value;
}
function toggle(row: ZtTableRow, event: Event) {
  const k = key(row);
  if (!allowed.value.includes(k)) return;
  select(
    props.selectedKeys.includes(k)
      ? props.selectedKeys.filter((v) => v !== k)
      : [...props.selectedKeys, k],
  );
  (event.target as HTMLInputElement).checked = props.selectedKeys.includes(k);
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
  column: ZtTableColumn,
  index: number,
  header = false,
): CSSProperties {
  const style: CSSProperties = {
    width: `${column.width ?? 160}px`,
    minWidth: `${column.minWidth ?? column.width ?? 100}px`,
    textAlign: column.align ?? 'left',
  };
  if (column.fixed) {
    style.position = 'sticky';
    style[column.fixed] =
      `${props.columns.reduce((sum, c, i) => sum + (c.fixed === column.fixed && (column.fixed === 'left' ? i < index : i > index) ? (c.width ?? 160) : 0), column.fixed === 'left' ? (props.selection ? 44 : 0) + (props.expandable ? 44 : 0) : 0)}px`;
    style.zIndex = header ? 4 : 2;
  }
  if (header && props.maxHeight) {
    style.position = 'sticky';
    style.top = 0;
    style.zIndex = column.fixed ? 4 : 3;
  }
  return style;
}
const span = computed(
  () =>
    props.columns.length + Number(props.selection) + Number(props.expandable),
);
</script>
<template>
  <div
    class="zt-table"
    :class="[
      `zt-table--${size}`,
      { 'is-striped': stripe, 'is-bordered': border },
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
          minWidth: `${columns.reduce((sum, c) => sum + (c.width ?? 160), Number(selection) * 44 + Number(expandable) * 44)}px`,
        }"
      >
        <thead>
          <tr>
            <th
              v-if="selection"
              class="zt-table__utility zt-table__selection"
              :style="
                maxHeight ? { position: 'sticky', top: 0, zIndex: 4 } : {}
              "
            >
              <input
                type="checkbox"
                aria-label="全选行"
                :checked="all"
                :indeterminate="partial"
                :disabled="loading || !allowed.length"
                @change="selectAll"
              />
            </th>
            <th
              v-if="expandable"
              class="zt-table__utility zt-table__expansion"
              :style="{
                left: selection ? '44px' : '0px',
                top: maxHeight ? 0 : undefined,
              }"
              aria-label="展开行"
            />
            <th
              v-for="(column, i) in columns"
              :key="column.prop"
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
                }}</slot
                ><span aria-hidden="true">{{
                  sortState.prop === column.prop
                    ? sortState.order === 'ascending'
                      ? '↑'
                      : sortState.order === 'descending'
                        ? '↓'
                        : '↕'
                    : '↕'
                }}</span></button
              ><slot v-else :name="`header-${column.prop}`" :column="column">{{
                column.label
              }}</slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in rows" :key="key(row)"
            ><tr
              :class="{ 'is-selected': selectedKeys.includes(key(row)) }"
              @click="emit('row-click', row, $event)"
            >
              <td
                v-if="selection"
                class="zt-table__utility zt-table__selection"
              >
                <input
                  type="checkbox"
                  :aria-label="`选择行 ${key(row)}`"
                  :checked="selectedKeys.includes(key(row))"
                  :disabled="loading || !allowed.includes(key(row))"
                  @click.stop
                  @change="toggle(row, $event)"
                />
              </td>
              <td
                v-if="expandable"
                class="zt-table__utility zt-table__expansion"
                :style="{ left: selection ? '44px' : '0px' }"
              >
                <button
                  data-expand
                  type="button"
                  :aria-label="`展开行 ${key(row)}`"
                  :aria-expanded="expandedKeys.includes(key(row))"
                  @click.stop="expand(row)"
                >
                  {{ expandedKeys.includes(key(row)) ? '−' : '+' }}
                </button>
              </td>
              <td
                v-for="(column, i) in columns"
                :key="column.prop"
                :style="columnStyle(column, i)"
              >
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
