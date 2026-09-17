import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtBacktop } from './index';
it('appears only above threshold and scrolls the selected element', async () => {
  const container = document.createElement('div');
  container.scrollTo = vi.fn();
  const w = mount(ZtBacktop, { props: { container, visibilityHeight: 100 } });
  expect(w.find('button').exists()).toBe(false);
  container.scrollTop = 120;
  container.dispatchEvent(new Event('scroll'));
  await nextTick();
  await w.get('button').trigger('click');
  expect(container.scrollTo).toHaveBeenCalledWith({
    top: 0,
    behavior: 'smooth',
  });
  expect(w.emitted('click')).toHaveLength(1);
  w.unmount();
});
