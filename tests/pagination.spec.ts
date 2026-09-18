import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { compile } from 'sass'
import { buildPagerItems } from '../src/components/pagination/pagination'
import ZtPagination from '../src/components/pagination/ZtPagination.vue'

let styles: HTMLStyleElement
beforeAll(() => {
  styles = document.createElement('style')
  styles.textContent = compile('src/components/pagination/pagination.scss').css
  document.head.append(styles)
})
afterAll(() => styles.remove())

describe('buildPagerItems', () => {
  it('returns every page when the page count fits', () => {
    expect(buildPagerItems(5, 3, 7)).toEqual([1, 2, 3, 4, 5])
  })

  it('collapses pages around the current page with jump controls', () => {
    expect(buildPagerItems(20, 1, 7)).toEqual([1, 2, 3, 4, 5, 'next-more', 20])
    expect(buildPagerItems(20, 10, 7)).toEqual([1, 'prev-more', 9, 10, 11, 'next-more', 20])
    expect(buildPagerItems(20, 20, 7)).toEqual([1, 'prev-more', 16, 17, 18, 19, 20])
  })
})

describe('ZtPagination', () => {
  it.each([
    ['mini', '104px'],
    ['small', '112px'],
    ['default', '120px'],
    ['medium', '128px'],
    ['large', '136px'],
  ] as const)('sizes the page-size selector for the %s density', (size, width) => {
    const wrapper = mount(ZtPagination, {
      attachTo: document.body,
      props: { total: 1000, size, pageSizes: [10, 20, 50, 100, 200, 500], layout: 'sizes' },
    })
    try {
      expect(getComputedStyle(wrapper.get('.zt-pagination').element).getPropertyValue('--zt-pagination-size-select-width').trim()).toBe(width)
      expect(getComputedStyle(wrapper.get('.zt-pagination__sizes').element).width).toBe(width)
    } finally { wrapper.unmount() }
  })

  it('uses size as the sole density prop', () => {
    const wrapper = mount(ZtPagination, {
      props: { total: 30, size: 'large', small: true, layout: 'pager' } as any,
    })

    expect(wrapper.classes()).toContain('zt-pagination--large')
  })

  it.each([
    { label: '下一页', target: '3' },
    { label: '上一页', target: '1' },
  ])('retains keyboard focus when $label becomes disabled at page $target', async ({ label, target }) => {
    const wrapper = mount(ZtPagination, { attachTo: document.body, props: { total: 30, currentPage: 2, layout: 'prev, pager, next' } })
    try {
      const button = wrapper.find(`[aria-label="${label}"]`)
      ;(button.element as HTMLButtonElement).focus()
      await button.trigger('click')
      expect((button.element as HTMLButtonElement).disabled).toBe(true)
      expect(document.activeElement).toBe(wrapper.find('[aria-current="page"]').element)
      expect(document.activeElement?.textContent).toBe(target)
    } finally { wrapper.unmount() }
  })

  it('leaves focus on an enabled navigation button during non-boundary paging', async () => {
    const wrapper = mount(ZtPagination, { attachTo: document.body, props: { total: 40, currentPage: 2, layout: 'prev, pager, next' } })
    try {
      const button = wrapper.find('[aria-label="下一页"]')
      ;(button.element as HTMLButtonElement).focus()
      await button.trigger('click')
      expect(document.activeElement).toBe(button.element)
    } finally { wrapper.unmount() }
  })

  it.each([false, true])('does not steal outside focus during boundary paging (previously focused=%s)', async focused => {
    const wrapper = mount(ZtPagination, { attachTo: document.body, props: { total: 20, layout: 'prev, pager, next' } })
    const outside = document.createElement('input')
    document.body.append(outside)
    try {
      const button = wrapper.find('[aria-label="下一页"]')
      if (focused) (button.element as HTMLButtonElement).focus()
      else outside.focus()
      const update = button.trigger('click')
      outside.focus()
      await update
      expect(document.activeElement).toBe(outside)
    } finally { wrapper.unmount(); outside.remove() }
  })

  it('renders configured layout modules and page count from total', () => {
    const wrapper = mount(ZtPagination, {
      global: { stubs: { teleport: true } },
      props: { total: 95, pageSize: 10, currentPage: 3, layout: 'total, sizes, prev, pager, next, jumper' },
    })

    expect(wrapper.find('.zt-pagination__total').text()).toBe('共 95 条')
    expect(wrapper.findAll('.zt-pagination__pager-button')).toHaveLength(7)
    expect(wrapper.find('.zt-pagination__sizes').exists()).toBe(true)
    expect(wrapper.find('.zt-pagination__jumper').exists()).toBe(true)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('3')
  })

  it('emits model and change events when a page is selected', async () => {
    const wrapper = mount(ZtPagination, {
      props: { total: 100, currentPage: 2, pageSize: 10, layout: 'prev, pager, next' },
    })

    await wrapper.find('[aria-label="第 5 页"]').trigger('click')
    expect(wrapper.emitted('update:currentPage')).toEqual([[5]])
    expect(wrapper.emitted('current-change')).toEqual([[5]])
    expect(wrapper.emitted('change')).toEqual([[5, 10]])

    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('next-click')).toEqual([[6]])
  })

  it('keeps an internal page when v-model is omitted', async () => {
    const wrapper = mount(ZtPagination, {
      props: { total: 100, layout: 'prev, pager, next' },
    })

    await wrapper.find('[aria-label="第 3 页"]').trigger('click')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('3')

    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('4')
    expect(wrapper.emitted('next-click')).toEqual([[4]])
  })

  it('corrects the current page when the available page count shrinks', async () => {
    const wrapper = mount(ZtPagination, {
      props: { total: 100, currentPage: 10, layout: 'pager' },
    })

    await wrapper.setProps({ total: 20 })
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
    expect(wrapper.emitted('update:currentPage')).toEqual([[2]])
    expect(wrapper.emitted('current-change')).toEqual([[2]])
    expect(wrapper.emitted('change')).toEqual([[2, 10]])
  })

  it('clamps the current page when page size changes', async () => {
    const wrapper = mount(ZtPagination, {
      global: { stubs: { teleport: true } },
      props: { total: 95, currentPage: 10, pageSize: 10, pageSizes: [10, 20], layout: 'sizes, pager' },
    })

    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]').find(option => option.text() === '20 条/页')!.trigger('click')
    expect(wrapper.emitted('update:pageSize')).toEqual([[20]])
    expect(wrapper.emitted('size-change')).toEqual([[20]])
    expect(wrapper.emitted('update:currentPage')).toEqual([[5]])
    expect(wrapper.emitted('current-change')).toEqual([[5]])
    expect(wrapper.emitted('change')).toEqual([[5, 20]])
  })

  it('never emits page zero when page-count is zero', async () => {
    const wrapper = mount(ZtPagination, {
      global: { stubs: { teleport: true } },
      props: { pageCount: 0, currentPage: 5, pageSize: 10, pageSizes: [10, 20], layout: 'sizes, pager' },
    })

    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]').find(option => option.text() === '20 条/页')!.trigger('click')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('1')
    expect(wrapper.emitted('change')).toEqual([[1, 20]])
    expect((wrapper.emitted('update:currentPage') ?? []).flat()).not.toContain(0)
  })

  it('moves focus to the current page after a collapsed-range jump', async () => {
    const wrapper = mount(ZtPagination, {
      attachTo: document.body,
      props: { total: 100, currentPage: 4, pagerCount: 7, layout: 'pager' },
    })
    const jump = wrapper.find('[aria-label="向后 5 页"]')
    ;(jump.element as HTMLButtonElement).focus()

    await jump.trigger('click')
    const active = document.activeElement as HTMLElement
    expect(active.getAttribute('aria-current')).toBe('page')
    expect(active.textContent).toBe('9')
    wrapper.unmount()
  })

  it('supports page-count priority, slot alignment and jump input', async () => {
    const wrapper = mount(ZtPagination, {
      props: { total: 10, pageCount: 12, currentPage: 1, layout: 'slot, ->, jumper, total' },
      slots: { default: '<strong class="custom-content">筛选结果</strong>' },
    })

    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.findAll('.zt-pagination__group')).toHaveLength(2)
    const input = wrapper.find('input')
    await input.setValue('20')
    expect(wrapper.emitted('update:currentPage')).toEqual([[12]])
  })

  it('prevents interaction when disabled and hides a single page on request', async () => {
    const disabled = mount(ZtPagination, {
      props: { total: 100, currentPage: 2, disabled: true, layout: 'prev, pager, next' },
    })
    await disabled.find('[aria-label="第 3 页"]').trigger('click')
    expect(disabled.emitted('update:currentPage')).toBeUndefined()
    expect(disabled.findAll('button').every(button => button.attributes('disabled') !== undefined)).toBe(true)

    const hidden = mount(ZtPagination, { props: { total: 5, hideOnSinglePage: true } })
    expect(hidden.find('.zt-pagination').exists()).toBe(false)
  })
})
