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
  ZtTableFilters,
  ZtTableFilterValue,
  ZtTableRowContext,
  ZtTableCellContext,
} from './types';
import TableSelectionControl from './TableSelectionControl.vue';
import ZtPopover from '../popover/ZtPopover.vue';
import TableOverflow from './TableOverflow.vue';
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
  /** 筛选变更的完整值；remote 时交由业务请求数据。 */
  'filter-change': [filters: ZtTableFilters];
  /** 更新受控筛选值。 */
  'update:filters': [filters: ZtTableFilters];
  /** 更新当前行 key。 */
  'update:currentRowKey': [key: ZtTableKey | null];
  /** 当前行切换，提供当前行及上一行（不存在时为 null）。 */
  'current-change': [row: ZtTableRow | null, previous: ZtTableRow | null];
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
    return `__zt-row-${originalIndex(row)}`;
  }
  return value;
}
const localFilters = ref<ZtTableFilters>({});
const filterState = computed(() => props.filters ?? localFilters.value);
function changeFilter(
  column: ZtTableColumn,
  value: ZtTableFilterValue,
  checked: boolean,
  input?: HTMLInputElement,
) {
  if (props.loading) return;
  const old = filterState.value[column.prop] ?? [];
  const values = checked
    ? column.filterMultiple === false
      ? [value]
      : [...new Set([...old, value])]
    : old.filter((item) => item !== value);
  const next = Object.fromEntries(
    Object.entries({ ...filterState.value, [column.prop]: values }).map(
      ([prop, values]) => [prop, [...values]],
    ),
  );
  localFilters.value = next;
  emit('update:filters', next);
  emit('filter-change', next);
  // Native inputs must reflect the accepted controlled value after the parent update.
  if (input)
    void nextTick(() => {
      input.checked = filterState.value[column.prop]?.includes(value) ?? false;
    });
}
const originalIndices = computed(() => {
  const indices = new Map<ZtTableRow, number>();
  props.data.forEach((row, index) => {
    if (!indices.has(row)) indices.set(row, index);
  });
  return indices;
});
const originalIndex = (row: ZtTableRow) => originalIndices.value.get(row) ?? -1;
const filteredRows = computed(() =>
  props.remote
    ? props.data
    : props.data.filter((row, rowIndex) =>
        Object.entries(filterState.value).every(([prop, values]) => {
          if (!values.length) return true;
          const column = props.columns.find((item) => item.prop === prop);
          return values.some((value) =>
            column?.filterMethod
              ? column.filterMethod(value, row, rowIndex)
              : row[prop] === value,
          );
        }),
      ),
);
const rows = computed(() => {
  const state = sortState.value,
    column = props.columns.find((c) => c.prop === state.prop);
  if (props.remote || !state.order || !column) return filteredRows.value;
  const sign = state.order === 'ascending' ? 1 : -1;
  return filteredRows.value
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
    rows.value
      .filter(
        (row) => !props.selectable || props.selectable(row, originalIndex(row)),
      )
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
const localCurrent = ref<ZtTableKey | null>(null);
const currentKey = computed(() =>
  props.currentRowKey === undefined ? localCurrent.value : props.currentRowKey,
);
function clickRow(row: ZtTableRow, event: MouseEvent | KeyboardEvent) {
  if (event instanceof MouseEvent) emit('row-click', row, event);
  if (
    !props.highlightCurrentRow ||
    props.loading ||
    currentKey.value === key(row)
  )
    return;
  const previous =
    props.data.find((item) => key(item) === currentKey.value) ?? null;
  localCurrent.value = key(row);
  emit('update:currentRowKey', key(row));
  emit('current-change', row, previous);
}
function rowContext(row: ZtTableRow): ZtTableRowContext {
  return { row, rowIndex: originalIndex(row) };
}
function cellContext(
  row: ZtTableRow,
  column: ZtTableColumn,
  columnIndex: number,
): ZtTableCellContext {
  return { ...rowContext(row), column, columnIndex };
}
function rowClass(row: ZtTableRow) {
  return typeof props.rowClassName === 'function'
    ? props.rowClassName(rowContext(row))
    : props.rowClassName;
}
function rowStyleValue(row: ZtTableRow) {
  const custom =
    typeof props.rowStyle === 'function'
      ? props.rowStyle(rowContext(row))
      : props.rowStyle;
  return {
    ...custom,
    '--zt-table-row-background': custom?.background ?? custom?.backgroundColor,
  };
}
function cellClass(row: ZtTableRow, column: ZtTableColumn, i: number) {
  return typeof props.cellClassName === 'function'
    ? props.cellClassName(cellContext(row, column, i))
    : props.cellClassName;
}
function cellStyleValue(row: ZtTableRow, column: TableLayoutColumn, i: number) {
  const custom =
    typeof props.cellStyle === 'function'
      ? props.cellStyle(cellContext(row, column, i))
      : props.cellStyle;
  const base = columnStyle(column, i);
  const protectedLayout = column.fixed
    ? Object.fromEntries(
        (['position', 'left', 'right', 'top', 'bottom', 'zIndex', 'width', 'minWidth'] as const)
          .map((property) => [property, base[property]]),
      )
    : {};
  return { ...base, ...custom, ...protectedLayout };
}
const spans = computed(() => {
  if (!props.spanMethod)
    return rows.value.map(() => layout.value.map(() => ({ rowspan: 1, colspan: 1 })));

  const availableRows = new Array<number>(rows.value.length);
  const expandedKeys = new Set(props.expandedKeys);
  let nextExpanded = rows.value.length;
  for (let index = rows.value.length - 1; index >= 0; index--) {
    if (props.expandable && expandedKeys.size && expandedKeys.has(key(rows.value[index])))
      nextExpanded = index;
    availableRows[index] = nextExpanded === rows.value.length
      ? rows.value.length - index
      : nextExpanded - index + 1;
  }
  const columnEnds = new Array<number>(layout.value.length);
  for (let index = layout.value.length - 1; index >= 0; index--) {
    const next = layout.value[index + 1];
    columnEnds[index] = next && !next.utility && next.type !== 'index' && next.fixed === layout.value[index].fixed
      ? columnEnds[index + 1]
      : index + 1;
  }
  const requested = rows.value.map((row) =>
    layout.value.map((column, i) => {
      if (!props.spanMethod || column.utility || column.type === 'index')
        return { rowspan: 1, colspan: 1 };
      const result = props.spanMethod(cellContext(row, column, i));
      const [r, c] = Array.isArray(result)
        ? result
        : [result?.rowspan ?? 1, result?.colspan ?? 1];
      if (r === 0 || c === 0) return { rowspan: 0, colspan: 0 };
      return {
        rowspan: Number.isFinite(r) ? Math.max(1, Math.floor(r)) : 1,
        colspan: Number.isFinite(c) ? Math.max(1, Math.floor(c)) : 1,
      };
    }),
  );
  const normalized = requested.map((rowSpans, visibleIndex) =>
    rowSpans.map((span, i) => {
      if (!span.rowspan || !span.colspan) return { ...span };
      return {
        rowspan: Math.min(span.rowspan, availableRows[visibleIndex]),
        colspan: Math.min(span.colspan, columnEnds[i] - i),
      };
    }),
  );
  const requestedCoverage = new Set<number>();
  const actualCoverage = new Set<number>();
  function cover(
    spans: { rowspan: number; colspan: number }[][],
    coverage: Set<number>,
  ) {
    spans.forEach((rowSpans, rowIndex) => {
      rowSpans.forEach((span, columnIndex) => {
        const rowEnd = Math.min(rowIndex + span.rowspan, rows.value.length);
        const columnEnd = Math.min(columnIndex + span.colspan, layout.value.length);
        for (let r = rowIndex; r < rowEnd; r++) {
          for (let c = columnIndex; c < columnEnd; c++) {
            if (r !== rowIndex || c !== columnIndex)
              coverage.add(r * layout.value.length + c);
          }
        }
      });
    });
  }
  cover(requested, requestedCoverage);
  cover(normalized, actualCoverage);
  // A clipped merge no longer covers its former zero-span followers. Restore
  // those cells while retaining explicit standalone hides and valid merges.
  normalized.forEach((rowSpans, rowIndex) => {
    rowSpans.forEach((span, columnIndex) => {
      const position = rowIndex * layout.value.length + columnIndex;
      if (
        (!span.rowspan || !span.colspan) &&
        requestedCoverage.has(position) &&
        !actualCoverage.has(position)
      ) {
        span.rowspan = 1;
        span.colspan = 1;
      }
    });
  });
  return normalized;
});
const summary = computed(() => {
  if (!props.showSummary) return [];
  if (props.summaryMethod)
    return props.summaryMethod({ columns: layout.value, data: rows.value });
  const first = layout.value.findIndex((c) => !c.utility);
  return layout.value.map((column, index) => {
    if (column.utility) return '';
    if (index === first) return props.sumText ?? '合计';
    if (column.type === 'index') return '';
    const values = rows.value.map((row) => row[column.prop]);
    return values.some(
      (value) => typeof value === 'number' && Number.isFinite(value),
    )
      ? values.reduce<number>(
          (sum, value) =>
            sum +
            (typeof value === 'number' && Number.isFinite(value) ? value : 0),
          0,
        )
      : '';
  });
});
function cellText(row: ZtTableRow, column: ZtTableColumn, index: number) {
  if (column.type === 'index')
    return typeof column.index === 'function'
      ? column.index(index, row)
      : (column.index ?? 1) + index;
  return column.formatter
    ? column.formatter(row[column.prop], row, index)
    : row[column.prop];
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
                <ZtPopover
                  v-if="column.filters?.length"
                  placement="bottom-end"
                  :disabled="loading"
                  :width="200"
                >
                  <button
                    type="button"
                    class="zt-table__filter-trigger"
                    :data-filter="column.prop"
                    :disabled="loading"
                    :aria-label="`筛选${column.label}`"
                    :class="{ 'is-active': filterState[column.prop]?.length }"
                  >
                    筛选
                  </button>
                  <template #content>
                    <div
                      class="zt-table__filter-options"
                      :aria-label="`${column.label}筛选选项`"
                    >
                      <label
                        v-for="(option, optionIndex) in column.filters"
                        :key="optionIndex"
                      >
                        <input
                          type="checkbox"
                          :checked="
                            filterState[column.prop]?.includes(option.value) ??
                            false
                          "
                          :disabled="loading"
                          @change="
                            changeFilter(
                              column,
                              option.value,
                              ($event.target as HTMLInputElement).checked,
                              $event.target as HTMLInputElement,
                            )
                          "
                        />{{ option.text }}
                      </label>
                    </div>
                  </template>
                </ZtPopover>
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
              :class="[
                rowClass(row),
                {
                  'is-selected': selectedKeys.includes(key(row)),
                  'is-current': highlightCurrentRow && currentKey === key(row),
                },
              ]"
              :style="rowStyleValue(row)"
              :tabindex="highlightCurrentRow && !loading ? 0 : undefined"
              :aria-current="
                highlightCurrentRow && currentKey === key(row)
                  ? 'true'
                  : undefined
              "
              @click="clickRow(row, $event)"
              @keydown="
                $event.target === $event.currentTarget &&
                ['Enter', ' '].includes($event.key) &&
                highlightCurrentRow &&
                ($event.preventDefault(), clickRow(row, $event))
              "
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
                  :class="[
                    `zt-table__${column.utility}`,
                    cellClass(row, column, i),
                  ]"
                  :style="cellStyleValue(row, column, i)"
                  @click.stop
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
                <td
                  v-else-if="spans[index][i].rowspan && spans[index][i].colspan"
                  :rowspan="spans[index][i].rowspan"
                  :colspan="spans[index][i].colspan"
                  :class="[
                    cellClass(row, column, i),
                    {
                      'has-overflow-tooltip':
                        column.showOverflowTooltip ?? showOverflowTooltip,
                    },
                  ]"
                  :style="cellStyleValue(row, column, i)"
                >
                  <component
                    :is="
                      (column.showOverflowTooltip ?? showOverflowTooltip)
                        ? TableOverflow
                        : 'span'
                    "
                  >
                    <slot
                      :name="column.slot ?? column.prop"
                      :row="row"
                      :column="column"
                      :value="row[column.prop]"
                      :index="index"
                      :row-index="originalIndex(row)"
                      >{{ cellText(row, column, index) }}</slot
                    >
                  </component>
                </td>
              </template>
            </tr>
            <tr
              v-if="expandable && expandedKeys.includes(key(row))"
              class="zt-table__expanded"
            >
              <td :colspan="span">
                <slot
                  name="expand"
                  :row="row"
                  :index="index"
                  :row-index="originalIndex(row)"
                />
              </td></tr
          ></template>
          <tr v-if="!rows.length">
            <td :colspan="span" class="zt-table__empty">
              <slot name="empty">{{ loading ? '加载中…' : emptyText }}</slot>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="showSummary">
          <tr class="zt-table__summary">
            <td
              v-for="(column, i) in layout"
              :key="column.prop"
              :style="columnStyle(column, i)"
            >
              {{ summary[i] }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div v-if="loading" class="zt-table__loading" role="status">加载中…</div>
  </div>
</template>
