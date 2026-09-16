import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZtPagination from '../src/components/pagination/ZtPagination.vue'

describe('Pagination status', () => {
  it.each(['default', 'primary', 'success', 'warning', 'danger', 'info'] as const)('applies %s theme and retains the active page', status => {
    const wrapper = mount(ZtPagination, { props: { status, currentPage: 2, total: 100 } })
    expect(wrapper.classes()).toContain(`zt-pagination--status-${status}`)
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2')
    wrapper.unmount()
  })
})
