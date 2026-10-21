import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { expect, it, vi } from 'vitest';
import Remote from './Remote.vue';

it('demonstrates server sorting through loading and returned data for all three sort states', async () => {
  vi.useFakeTimers();
  const w = mount(Remote);
  try {
    for (const name of ['杭州旗舰店', '上海静安店', '杭州旗舰店']) {
      await w.get('[data-sort="sales"]').trigger('click');
      expect(w.get('.zt-table').attributes('aria-busy')).toBe('true');
      expect(w.get('[data-sort="sales"]').attributes('disabled')).toBeDefined();
      await vi.advanceTimersByTimeAsync(240);
      await nextTick();
      expect(w.get('.zt-table').attributes('aria-busy')).toBe('false');
      expect(w.findAll('tbody tr')[0].text()).toContain(name);
      expect(w.text()).toContain('已接收服务端结果');
    }
  } finally {
    w.unmount();
    vi.useRealTimers();
  }
});
