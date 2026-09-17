import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtAnchor } from './index';
it('scrolls a supplied container with offset and exposes nested links', async () => {
  const container = document.createElement('div');
  const target = document.createElement('section');
  target.id = 'section-a';
  container.append(target);
  document.body.append(container);
  container.scrollTo = vi.fn();
  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
    top: 50,
  } as DOMRect);
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
    top: 250,
  } as DOMRect);
  const w = mount(ZtAnchor, {
    props: {
      container,
      offset: 20,
      links: [
        {
          href: '#section-a',
          title: '总览',
          children: [{ href: '#child', title: '明细' }],
        },
      ],
    },
  });
  await w.get('a').trigger('click');
  expect(container.scrollTo).toHaveBeenCalledWith({
    top: 180,
    behavior: 'smooth',
  });
  expect(w.findAll('a')).toHaveLength(2);
  expect(w.emitted('select')?.[0]).toEqual(['#section-a']);
  w.unmount();
  container.remove();
});
it('tracks active sections on scroll and detaches the previous target', async () => {
  const first = document.createElement('div'),
    second = document.createElement('div'),
    section = document.createElement('section');
  section.id = 'anchor-track';
  document.body.append(section);
  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
    top: -30,
  } as DOMRect);
  const remove = vi.spyOn(first, 'removeEventListener');
  const w = mount(ZtAnchor, {
    props: {
      container: first,
      links: [{ href: '#anchor-track', title: '当前' }],
    },
  });
  await nextTick();
  expect(w.get('a').attributes('aria-current')).toBe('location');
  await w.setProps({ container: second });
  await nextTick();
  expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
  w.unmount();
  section.remove();
});
