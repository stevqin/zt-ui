import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtInfiniteScroll } from './index';
it('prevents concurrent loading and retries after failure', async () => {
  let reject!: (reason: Error) => void;
  const load = vi.fn(
    () =>
      new Promise<void>((_, r) => {
        reject = r;
      }),
  );
  const w = mount(ZtInfiniteScroll, { props: { load, immediate: false } });
  const instance = w.vm as unknown as { check: () => Promise<void> };
  const pending = instance.check();
  void instance.check();
  expect(load).toHaveBeenCalledTimes(1);
  reject(new Error('失败'));
  await pending;
  await nextTick();
  expect(w.get('[role="alert"]').text()).toContain('加载失败');
  load.mockResolvedValue(undefined);
  await w.get('button').trigger('click');
  await flushPromises();
  expect(load).toHaveBeenCalledTimes(2);
  expect(w.find('[role="alert"]').exists()).toBe(false);
  w.unmount();
});
it('does not load when finished or disabled', async () => {
  const load = vi.fn();
  const w = mount(ZtInfiniteScroll, { props: { load, finished: true } });
  await flushPromises();
  expect(load).not.toHaveBeenCalled();
  await w.setProps({ finished: false, disabled: true });
  await (w.vm as unknown as { check: () => Promise<void> }).check();
  expect(load).not.toHaveBeenCalled();
  w.unmount();
});
it('aborts pending loads on unmount and suppresses late failure', async () => {
  let signal: AbortSignal | undefined, reject!: (error: Error) => void;
  const w = mount(ZtInfiniteScroll, {
    props: {
      load: (s) => {
        signal = s;
        return new Promise<void>((_, r) => (reject = r));
      },
    },
  });
  await nextTick();
  w.unmount();
  expect(signal?.aborted).toBe(true);
  reject(new Error('late'));
  await flushPromises();
  expect(w.emitted('error')).toBeUndefined();
});
it('uses container bottom thresholds, does not auto-run when immediate is false, and pauses after completion', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
    top: 50,
    bottom: 250,
  } as DOMRect);
  const load = vi.fn().mockResolvedValue(undefined),
    w = mount(ZtInfiniteScroll, {
      props: { container, load, immediate: false, distance: 20 },
    });
  let bottom = 400;
  vi.spyOn(w.element, 'getBoundingClientRect').mockImplementation(
    () => ({ bottom }) as DOMRect,
  );
  await flushPromises();
  expect(load).not.toHaveBeenCalled();
  container.dispatchEvent(new Event('scroll'));
  await flushPromises();
  expect(load).not.toHaveBeenCalled();
  bottom = 260;
  container.dispatchEvent(new Event('scroll'));
  await flushPromises();
  expect(load).toHaveBeenCalledTimes(1);
  await w.setProps({ finished: true });
  container.dispatchEvent(new Event('scroll'));
  await flushPromises();
  expect(load).toHaveBeenCalledTimes(1);
  w.unmount();
  container.remove();
});
