import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtAffix } from './index';
it('fixes relative to supplied container and preserves placeholder dimensions', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
    top: 40,
    bottom: 340,
    left: 10,
    right: 310,
    width: 300,
    height: 300,
  } as DOMRect);
  const w = mount(ZtAffix, {
    props: { container, offset: 10 },
    slots: { default: () => h('button', '工具栏') },
  });
  vi.spyOn(w.element, 'getBoundingClientRect').mockReturnValue({
    top: 20,
    left: 20,
    width: 200,
    height: 40,
  } as DOMRect);
  vi.spyOn(
    w.get('.zt-affix__content').element,
    'getBoundingClientRect',
  ).mockReturnValue({ height: 40, width: 200 } as DOMRect);
  container.dispatchEvent(new Event('scroll'));
  await nextTick();
  expect(w.get('.zt-affix__content').attributes('style')).toContain(
    'position: fixed',
  );
  expect(w.get('.zt-affix__content').attributes('style')).toContain(
    'top: 50px',
  );
  expect(w.attributes('style')).toContain('height: 40px');
  w.unmount();
  container.remove();
});
it('repositions element-bound content when an ancestor scrolls', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  let top = 100;
  vi.spyOn(container, 'getBoundingClientRect').mockImplementation(
    () =>
      ({ top, bottom: top + 300, left: 0, width: 300, height: 300 }) as DOMRect,
  );
  const w = mount(ZtAffix, {
    props: { container, offset: 10 },
    slots: { default: () => h('button', 'Tools') },
  });
  vi.spyOn(w.element, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    left: 0,
    width: 200,
    height: 30,
  } as DOMRect);
  vi.spyOn(
    w.get('.zt-affix__content').element,
    'getBoundingClientRect',
  ).mockReturnValue({ height: 30 } as DOMRect);
  container.dispatchEvent(new Event('scroll'));
  await nextTick();
  expect(w.get('.zt-affix__content').attributes('style')).toContain(
    'top: 110px',
  );
  top = 50;
  window.dispatchEvent(new Event('scroll'));
  await nextTick();
  expect(w.get('.zt-affix__content').attributes('style')).toContain(
    'top: 60px',
  );
  w.unmount();
  container.remove();
});
