import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { ZtTable, type ZtTableColumn } from '../src';
const wrappers: ReturnType<typeof mount>[] = [];
function render(extra: Record<string, unknown> = {}) {
  const columns: ZtTableColumn[] = [
    { prop: 'name', label: '门店', width: 120, minWidth: 80, fixed: 'left', sortable: true },
    { prop: 'sales', label: '销售额', width: 160, fixed: 'left', sortable: true },
    { prop: 'action', label: '操作', width: 100, fixed: 'right', resizable: false },
  ];
  const w = mount(ZtTable, { attachTo: document.body, props: {
    data: [{id: 1, name: '上海', sales: 20}], columns, resizable: true, selection: true, ...extra,
  } });
  wrappers.push(w);
  return w;
}
function pointer(target: EventTarget, type: string, x: number, id = 1, button = 0) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, pointerId: id, button }));
}
async function drag(w: ReturnType<typeof render>, from: number, to: number) {
  pointer(w.get('[data-resize="name"]').element, 'pointerdown', from);
  pointer(document, 'pointermove', to);
  pointer(document, 'pointerup', to);
  await nextTick();
}
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = ''; });
describe('Table column resizing', () => {
  it('is opt-in and can be disabled per column', () => {
    expect(render({resizable: false}).find('[data-resize]').exists()).toBe(false);
    const w = render();
    expect(w.findAll('[data-resize]')).toHaveLength(2);
    expect(w.find('[data-resize="action"]').exists()).toBe(false);
  });
  it('resizes header/body together, updates sticky offsets and never sorts or mutates input columns', async () => {
    const w = render();
    await drag(w, 120, 180);
    expect(w.get('thead th[data-column="name"]').attributes('style')).toContain('width: 180px');
    expect(w.findAll('tbody td')[1].attributes('style')).toContain('width: 180px');
    expect(w.get('thead th[data-column="sales"]').attributes('style')).toContain('left: 224px');
    expect(w.get('table').attributes('style')).toContain('width: 484px');
    expect(w.emitted('column-resize')).toEqual([[{prop: 'name', width: 180}]]);
    expect(w.emitted('sort-change')).toBeUndefined();
    expect(w.props('columns')[0].width).toBe(120);
  });
  it('keeps a locked narrow sibling at its existing width while another column changes', async () => {
    const w = render({columns: [
      {prop: 'name', label: '门店', width: 120, minWidth: 80},
      {prop: 'action', label: '操作', width: 40, resizable: false},
    ]});
    await drag(w, 120, 180);
    expect(w.get('thead th[data-column="action"]').element.style.width).toBe('40px');
    expect(w.get('thead th[data-column="action"]').element.style.minWidth).toBe('40px');
    expect(w.get('table').element.style.width).toBe('264px');
  });
  it('starts from rendered widths rather than the width hint and respects the minimum', async () => {
    const w = render();
    vi.spyOn(w.get('thead th[data-column="name"]').element, 'getBoundingClientRect').mockReturnValue({width: 240} as DOMRect);
    await drag(w, 240, 270);
    expect(w.emitted('column-resize')?.[0]).toEqual([{prop: 'name', width: 270}]);
    await drag(w, 270, -200);
    expect(w.get('[data-resize="name"]').attributes('aria-valuenow')).toBe('80');
  });
  it('does not emit or lock the layout when a handle is clicked without dragging', async () => {
    const w = render();
    await drag(w, 120, 120);
    expect(w.emitted('column-resize')).toBeUndefined();
    expect(w.classes()).not.toContain('is-resizing');
    expect(w.get('table').element.style.width).toBe('');
  });
  it('supports keyboard resizing without activating sorting', async () => {
    const w = render();
    await w.get('[data-resize="name"]').trigger('keydown', {key: 'ArrowRight'});
    expect(w.emitted('column-resize')?.[0]).toEqual([{prop: 'name', width: 130}]);
    await w.get('[data-resize="name"]').trigger('keydown', {key: 'Home'});
    expect(w.get('[data-resize="name"]').attributes('aria-valuenow')).toBe('80');
    expect(w.emitted('sort-change')).toBeUndefined();
  });
  it('cancels an interrupted drag and ignores other pointers, loading and non-primary mouse buttons', async () => {
    const w = render();
    const handle = w.get('[data-resize="name"]').element;
    pointer(handle, 'pointerdown', 120, 1, 2);
    pointer(document, 'pointermove', 180);
    expect(w.classes()).not.toContain('is-resizing');
    pointer(handle, 'pointerdown', 120);
    pointer(document, 'pointermove', 300, 2);
    expect(w.get('[data-resize="name"]').attributes('aria-valuenow')).toBe('120');
    pointer(document, 'pointermove', 180);
    pointer(document, 'pointercancel', 180);
    await nextTick();
    expect(w.get('[data-resize="name"]').attributes('aria-valuenow')).toBe('120');
    expect(w.emitted('column-resize')).toBeUndefined();
    await w.setProps({loading: true});
    pointer(handle, 'pointerdown', 120);
    expect(w.classes()).not.toContain('is-resizing');
  });
  it('preserves resized columns across reorder, drops removed columns and accepts new width props', async () => {
    const w = render();
    await drag(w, 120, 180);
    const columns = w.props('columns');
    await w.setProps({columns: [columns[1], columns[0]]});
    expect(w.get('[data-resize="name"]').attributes('aria-valuenow')).toBe('180');
    await w.setProps({columns: [{...columns[0], width: 200}, columns[1]]});
    expect(w.get('[data-resize="name"]').attributes('aria-valuenow')).toBe('200');
    await w.setProps({columns: [columns[1]]});
    expect(w.find('[data-resize="name"]').exists()).toBe(false);
  });
  it('cleans up document listeners if disabled or unmounted during a drag', async () => {
    const w = render();
    pointer(w.get('[data-resize="name"]').element, 'pointerdown', 120);
    await w.setProps({resizable: false});
    pointer(document, 'pointermove', 200);
    pointer(document, 'pointerup', 200);
    expect(w.emitted('column-resize')).toBeUndefined();
    await w.setProps({resizable: true});
    pointer(w.get('[data-resize="name"]').element, 'pointerdown', 120);
    w.unmount(); wrappers.pop();
    pointer(document, 'pointerup', 200);
    expect(w.emitted('column-resize')).toBeUndefined();
  });
});
it('renders SVG sort directions and keeps the complete sorting cycle', async () => {
  const w = render();
  const control = w.get('[data-sort="name"]');
  expect(control.findAll('svg')).toHaveLength(2);
  expect(control.text()).toBe('门店');
  for (const order of ['ascending', 'descending', 'none']) {
    await control.trigger('click');
    expect(w.get('thead th[data-column="name"]').attributes('aria-sort')).toBe(order);
    expect(control.findAll('.is-active')).toHaveLength(order === 'none' ? 0 : 1);
  }
});
