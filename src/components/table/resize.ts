import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import type { ZtTableColumn, ZtTableColumnResize, ZtTableProps } from './types';

export type Utility = 'selection' | 'expansion';
interface UtilityGeometry { kind: Utility; width: number; position: number; fixed?: 'left' | 'right' }
export function useTableColumnResize(
  props: ZtTableProps,
  root: Ref<HTMLElement | undefined>,
  emit: (value: ZtTableColumnResize) => void,
  utilityLayout?: () => UtilityGeometry[],
) {
  const widths = ref(new Map<string, number>());
  const utilities = ref<Partial<Record<Utility, number>>>({});
  const dragging = ref(false);
  const minimum = (column: ZtTableColumn) => Math.max(1, column.minWidth ?? 60);
  const width = (column: ZtTableColumn) => Math.max(
    widths.value.get(column.prop) ?? column.width ?? 160,
    column.minWidth ?? 0,
  );
  const utilityWidth = (kind: Utility) => utilities.value[kind] ?? utilityLayout?.().find(c => c.kind === kind)?.width ?? 44;
  const totalWidth = computed(() => (props.columns ?? []).reduce((sum, column) => sum + width(column),
    (props.selection ? utilityWidth('selection') : 0) + (props.expandable ? utilityWidth('expansion') : 0)));
  const canResize = (column: ZtTableColumn) => !!props.resizable && column.resizable !== false;
  let drag: {
    column: ZtTableColumn;
    pointerId: number;
    startX: number;
    startWidth: number;
    widths: Map<string, number>;
    utilities: Partial<Record<Utility, number>>;
    handle: HTMLElement;
  } | undefined;

  function freezeWidths() {
    const measured = new Map(widths.value);
    for (const column of props.columns ?? []) {
      const th = Array.from(root.value?.querySelectorAll<HTMLElement>('thead th[data-column]') ?? [])
        .find(el => el.dataset.column === column.prop);
      measured.set(column.prop, th?.getBoundingClientRect().width || width(column));
    }
    const nextUtilities = { ...utilities.value };
    for (const th of root.value?.querySelectorAll<HTMLElement>('thead [data-table-utility]') ?? []) {
      const kind = th.dataset.tableUtility as Utility;
      nextUtilities[kind] = th.getBoundingClientRect().width || utilityWidth(kind);
    }
    widths.value = measured;
    utilities.value = nextUtilities;
  }
  function cleanup() {
    const current = drag;
    drag = undefined;
    dragging.value = false;
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', end);
    document.removeEventListener('pointercancel', cancelPointer);
    window.removeEventListener('blur', cancel);
    current?.handle.removeEventListener('lostpointercapture', cancelPointer);
    if (current?.handle.hasPointerCapture?.(current.pointerId))
      current.handle.releasePointerCapture(current.pointerId);
    return current;
  }
  function cancel() {
    const current = cleanup();
    if (current) {
      widths.value = current.widths;
      utilities.value = current.utilities;
    }
  }
  function cancelPointer(event: PointerEvent) {
    if (drag && event.pointerId === drag.pointerId) cancel();
  }
  function start(column: ZtTableColumn, event: PointerEvent) {
    if (!canResize(column) || props.loading || event.button !== 0 || drag) return;
    event.preventDefault();
    const previous = new Map(widths.value);
    const previousUtilities = { ...utilities.value };
    freezeWidths();
    const handle = event.currentTarget as HTMLElement;
    drag = { column, pointerId: event.pointerId, startX: event.clientX,
      startWidth: width(column), widths: previous, utilities: previousUtilities, handle };
    dragging.value = true;
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', cancelPointer);
    window.addEventListener('blur', cancel);
    handle.addEventListener('lostpointercapture', cancelPointer);
    handle.setPointerCapture?.(event.pointerId);
  }
  function move(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const next = event.clientX === drag.startX ? drag.startWidth
      : Math.max(minimum(drag.column), Math.round(drag.startWidth + event.clientX - drag.startX));
    widths.value.set(drag.column.prop, next);
  }
  function end(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    move(event);
    const current = cleanup();
    if (!current) return;
    if (width(current.column) !== current.startWidth) {
      emit({ prop: current.column.prop, width: width(current.column) });
    } else {
      widths.value = current.widths;
      utilities.value = current.utilities;
    }
  }
  function keydown(column: ZtTableColumn, event: KeyboardEvent) {
    if (!canResize(column) || props.loading || drag || !['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
    event.preventDefault();
    freezeWidths();
    const old = width(column);
    const step = event.shiftKey ? 50 : 10;
    const next = event.key === 'Home' ? minimum(column)
      : Math.max(minimum(column), Math.round(old + (event.key === 'ArrowRight' ? step : -step)));
    widths.value.set(column.prop, next);
    if (next !== old) emit({ prop: column.prop, width: next });
  }
  watch(() => [props.resizable, props.loading, props.selection, props.expandable], cancel);
  watch(() => (props.columns ?? []).map(c => ({prop: c.prop, width: c.width, minWidth: c.minWidth, resizable: c.resizable, fixed: c.fixed})),
    (columns, old) => {
      // Template declarations produce fresh objects; only geometry changes interrupt a drag.
      if (old && columns.length === old.length && columns.every((column, i) => {
        const previous = old[i];
        return previous && column.prop === previous.prop && column.width === previous.width
          && column.minWidth === previous.minWidth && column.resizable === previous.resizable
          && column.fixed === previous.fixed;
      })) return;
      if (drag) cancel();
      for (const prop of widths.value.keys()) {
        const column = columns.find(c => c.prop === prop);
        const previous = old?.find(c => c.prop === prop);
        if (!column || column.width !== previous?.width || column.minWidth !== previous?.minWidth)
          widths.value.delete(prop);
      }
    }, { deep: true });
  watch(() => JSON.stringify(utilityLayout?.()), () => {
    cancel();
    utilities.value = {};
  });
  onBeforeUnmount(cleanup);
  return { width, widths, minimum, utilityWidth, totalWidth, canResize, dragging, start, keydown };
}
