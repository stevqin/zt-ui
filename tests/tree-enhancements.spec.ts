import { mount, type VueWrapper } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { compile } from 'sass';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { ZtTree, ZtCheckbox, type ZtTreeNode } from '../src';
import {
  flattenTree,
  normalizeChecked,
  partialChecked,
  toggleChecked,
} from '../src/components/tree/model';

const wrappers: VueWrapper[] = [];
const style = document.createElement('style');
beforeAll(() => {
  style.textContent = compile('src/components/tree/tree.scss').css;
  document.head.append(style);
});
afterAll(() => style.remove());
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});
function render(props = {}, slots = {}) {
  const wrapper = mount(ZtTree, { attachTo: document.body, props, slots });
  wrappers.push(wrapper);
  return wrapper;
}
const data: ZtTreeNode[] = [
  {
    key: 'parent',
    label: '父节点',
    children: [
      {
        key: 'display',
        label: '展示分组',
        checkable: false,
        children: [{ key: 'leaf', label: '子项' }],
      },
      { key: 'empty', label: '展示行', checkable: false },
      { key: 'disabled', label: '禁用项', disabled: true },
    ],
  },
];

describe('node-level Tree checking', () => {
  it('omits display-only keys but cascades through their checkable descendants', () => {
    const rows = flattenTree(data);
    expect(toggleChecked(rows, [], 'parent', false)).toEqual([
      'parent',
      'leaf',
    ]);
    expect(normalizeChecked(rows, ['parent'])).toEqual(['parent', 'leaf']);
    expect(normalizeChecked(rows, ['leaf'])).toEqual(['leaf', 'parent']);
    expect(toggleChecked(rows, ['parent', 'leaf'], 'leaf', false)).toEqual([]);
    expect(toggleChecked(rows, [], 'display', false)).toEqual([]);
    expect(partialChecked(rows, ['leaf'], 'display')).toBe(false);
  });

  it.each([false, true])(
    'hides checkboxes and aria-checked, and blocks Space for checkable=false (strict=%s)',
    async (checkStrictly) => {
      const wrapper = render({
        data,
        checkable: true,
        checkStrictly,
        checkedKeys: ['display', 'leaf'],
        defaultExpandedKeys: ['parent', 'display'],
      });
      const rows = wrapper.findAll('[role=treeitem]');
      expect(rows[1].find('input').exists()).toBe(false);
      expect(rows[1].attributes('aria-checked')).toBeUndefined();
      expect(rows[3].find('input').exists()).toBe(false);
      await wrapper.trigger('keydown', { key: 'ArrowDown' });
      await wrapper.trigger('keydown', { key: ' ' });
      expect(wrapper.emitted('check')).toBeUndefined();
      expect(wrapper.emitted('update:checkedKeys')).toBeUndefined();
      await wrapper.trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
        key: 'display',
      });
    },
  );

  it('supports a custom checkable field without hiding enabled siblings', async () => {
    const wrapper = render({
      checkable: true,
      fields: { key: 'id', label: 'title', checkable: 'canCheck' },
      data: [
        { id: 'group', title: '分组', canCheck: false },
        { id: 0, title: '可选项' },
      ],
    });
    expect(wrapper.findAll('input')).toHaveLength(1);
    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([[0]]);
  });

  it('removes display keys from results and preserves disabled existing selections', () => {
    const rows = flattenTree(data);
    expect(normalizeChecked(rows, ['display', 'disabled'])).toEqual([
      'disabled',
    ]);
    expect(toggleChecked(rows, ['display', 'disabled'], 'leaf', true)).toEqual([
      'disabled',
      'leaf',
    ]);
    expect(
      normalizeChecked(
        flattenTree([
          { key: 'group', checkable: false, children: [{ key: 'child' }] },
        ]),
        ['child'],
      ),
    ).toEqual(['child']);
  });
});

describe('Tree row heights', () => {
  it('keeps fixed rows by default and makes natural heights opt-in', async () => {
    const wrapper = render({ data: [{ key: 1, label: '可换行内容' }] });
    expect(
      wrapper.get<HTMLElement>('[role=treeitem]').element.style.height,
    ).toBe('32px');
    await wrapper.setProps({ autoItemHeight: true, itemHeight: 40 });
    const row = wrapper.get<HTMLElement>('[role=treeitem]').element;
    expect(row.style.height).toBe('auto');
    expect(row.style.minHeight).toBe('40px');
    expect(
      getComputedStyle(wrapper.get('.zt-tree__content').element).whiteSpace,
    ).toBe('normal');
    expect(
      getComputedStyle(wrapper.get('.zt-tree__content').element).overflowWrap,
    ).toBe('anywhere');
  });

  it('preserves natural-row scroll positions after replacing data, and clamps to real DOM height', async () => {
    const nodes = Array.from({ length: 5 }, (_, key) => ({
      key,
      label: String(key),
    }));
    const wrapper = render({ data: nodes, autoItemHeight: true, height: 100 });
    await nextTick();
    let scrollHeight = 500;
    Object.defineProperties(wrapper.element, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, get: () => scrollHeight },
    });
    wrapper.element.scrollTop = 250;
    await wrapper.trigger('scroll');
    await wrapper.setProps({ data: nodes.map((node) => ({ ...node })) });
    await nextTick();
    expect(wrapper.element.scrollTop).toBe(250);
    scrollHeight = 180;
    await wrapper.setProps({ data: nodes.slice(0, 2) });
    await nextTick();
    expect(wrapper.element.scrollTop).toBe(80);
  });

  it('scrolls keyboard navigation to the actual variable-height row bounds', async () => {
    const wrapper = render({
      data: [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      autoItemHeight: true,
      height: 100,
    });
    await nextTick();
    Object.defineProperty(wrapper.element, 'clientHeight', {
      configurable: true,
      value: 100,
    });
    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 200,
    } as DOMRect);
    const last = wrapper.findAll<HTMLElement>('[role=treeitem]')[2].element;
    vi.spyOn(last, 'getBoundingClientRect').mockReturnValue({
      top: 240,
      bottom: 320,
      height: 80,
    } as DOMRect);
    wrapper.element.scrollTop = 50;
    await wrapper.trigger('scroll');
    await wrapper.trigger('keydown', { key: 'End' });
    expect(wrapper.element.scrollTop).toBe(170);
  });

  it('keeps virtual windows fixed-height even when automatic heights are requested', () => {
    const wrapper = render({
      data: Array.from({ length: 1000 }, (_, key) => ({ key })),
      autoItemHeight: true,
      virtual: true,
      height: 100,
      itemHeight: 40,
    });
    expect(wrapper.findAll('[role=treeitem]').length).toBeLessThan(20);
    expect(
      wrapper.get<HTMLElement>('[role=treeitem]').element.style.height,
    ).toBe('40px');
    expect(
      wrapper.get<HTMLElement>('[role=treeitem]').element.style.position,
    ).toBe('absolute');
  });
});

describe('Tree expand indicators', () => {
  it('renders a rotating SVG inside the existing expand button', async () => {
    const wrapper = render({ data });
    const button = wrapper.get('[data-expand]');
    expect(button.find('svg').exists()).toBe(true);
    expect(button.attributes('aria-label')).toBe('展开');
    await button.trigger('click');
    expect(button.attributes('aria-label')).toBe('收起');
    expect(
      getComputedStyle(button.get('.zt-tree__expand-icon').element).transform,
    ).toBe('rotate(90deg)');
  });

  it('exposes expanded/loading/disabled/node to a custom expand-icon slot, including lazy loading', async () => {
    let resolve!: (value: ZtTreeNode[]) => void;
    const wrapper = render(
      {
        data: [{ key: 'lazy', label: '懒加载', isLeaf: false }],
        load: () =>
          new Promise<ZtTreeNode[]>((done) => {
            resolve = done;
          }),
      },
      {
        'expand-icon': (scope: {
          expanded: boolean;
          loading: boolean;
          disabled: boolean;
          node: ZtTreeNode;
        }) =>
          h(
            'span',
            { class: 'custom-arrow' },
            `${scope.node.key}:${scope.expanded}:${scope.loading}:${scope.disabled}`,
          ),
      },
    );
    expect(wrapper.get('.custom-arrow').text()).toBe('lazy:false:false:false');
    await wrapper.get('[data-expand]').trigger('click');
    expect(wrapper.get('.custom-arrow').text()).toBe('lazy:true:true:false');
    resolve([{ key: 'child', label: '子节点' }]);
    await vi.waitFor(() =>
      expect(wrapper.get('.custom-arrow').text()).toBe('lazy:true:false:false'),
    );
    await wrapper.setProps({ disabled: true });
    expect(wrapper.get('.custom-arrow').text()).toBe('lazy:true:false:true');
    expect(wrapper.get('[data-expand]').attributes('disabled')).toBeDefined();
  });
});

describe('Tree slotted keyboard controls', () => {
  it.each([
    'input',
    'textarea',
    'select',
    'button',
    'link',
    'editable',
    'tabstop',
    'checkbox-role',
  ])('leaves %s keyboard events to the inner control', async (kind) => {
    const widget = () =>
      kind === 'link'
        ? h('a', { href: '#', class: 'widget' }, '链接')
        : kind === 'editable'
          ? h('div', { contenteditable: 'true', class: 'widget' }, '编辑')
          : kind === 'tabstop'
            ? h('div', { tabindex: 0, class: 'widget' }, '操作')
            : kind === 'checkbox-role'
              ? h('div', { role: 'checkbox', class: 'widget' }, '勾选')
              : h(
                  kind,
                  { class: 'widget' },
                  kind === 'button'
                    ? h('span', { class: 'inner' }, '编辑')
                    : undefined,
                );
    const wrapper = render({ data, checkable: true }, { default: widget });
    const initial = wrapper.attributes('aria-activedescendant');
    const target = wrapper.find('.inner').exists()
      ? wrapper.get('.inner').element
      : wrapper.get('.widget').element;
    for (const key of ['ArrowDown', 'Home', 'End', 'Enter', ' ']) {
      const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      });
      target.dispatchEvent(event);
      await nextTick();
      expect(event.defaultPrevented).toBe(false);
    }
    expect(wrapper.attributes('aria-activedescendant')).toBe(initial);
    expect(wrapper.emitted('select')).toBeUndefined();
    expect(wrapper.emitted('check')).toBeUndefined();
  });

  it('still lets the tree root handle navigation and checking', async () => {
    const wrapper = render({ data, checkable: true, checkStrictly: true });
    await wrapper.trigger('keydown', { key: ' ' });
    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['parent']]);
    await wrapper.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
      key: 'parent',
    });
  });

  it.each(['.zt-checkbox__label', '.zt-checkbox__inner'])(
    'keeps label-based checkbox activation separate from row selection (%s)',
    async (selector) => {
      const update = vi.fn();
      const wrapper = render(
        { data: [{ key: 'row', label: '内容' }] },
        {
          default: () =>
            h(ZtCheckbox, { 'onUpdate:modelValue': update }, () => '订阅'),
        },
      );
      wrapper.get<HTMLElement>(selector).element.click();
      await nextTick();
      expect(update).toHaveBeenCalledWith(true);
      expect(wrapper.emitted('select')).toBeUndefined();
    },
  );

  it('leaves associated input captions to their control but keeps plain labels selectable', async () => {
    const wrapper = render(
      { data: [{ key: 'row' }] },
      {
        default: () => [
          h(
            'label',
            { for: 'tree-inline-name' },
            h('span', { class: 'caption' }, '名称'),
          ),
          h('input', { id: 'tree-inline-name' }),
          h('label', { class: 'plain-label' }, '普通节点标签'),
        ],
      },
    );
    await wrapper.get('.caption').trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();
    await wrapper.get('.plain-label').trigger('click');
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'row' });
  });

  it('lets an inner button activate without selecting its row, while plain row content remains selectable', async () => {
    const action = vi.fn();
    const wrapper = render(
      { data: [{ key: 'row', label: '内容' }] },
      {
        default: () => [
          h('span', { class: 'label' }, '内容'),
          h('button', { onClick: action }, '操作'),
        ],
      },
    );
    await wrapper.get('button').trigger('click');
    expect(action).toHaveBeenCalledOnce();
    expect(wrapper.emitted('select')).toBeUndefined();
    await wrapper.get('.label').trigger('click');
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'row' });
  });

  it('does not take over composing or already handled key events', async () => {
    const wrapper = render({ data });
    for (const options of [{ isComposing: true }, {}]) {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
        ...options,
      });
      if (!options.isComposing) event.preventDefault();
      wrapper.element.dispatchEvent(event);
      await nextTick();
    }
    expect(wrapper.emitted('select')).toBeUndefined();
  });
});
