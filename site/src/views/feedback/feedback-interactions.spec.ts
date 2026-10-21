import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, expect, it, vi } from 'vitest';
import Message from './Message.vue';
import Loading from './Loading.vue';
import Dialog from './Dialog.vue';
import Drawer from './Drawer.vue';
import MessageBox from './MessageBox.vue';

const wrappers: ReturnType<typeof mount>[] = [];
function render(component: Parameters<typeof mount>[0]) {
  const wrapper = mount(component, { attachTo: document.body });
  wrappers.push(wrapper);
  return wrapper;
}
async function click(wrapper: ReturnType<typeof mount>, label: string) {
  const button = wrapper
    .findAll('button')
    .find((item) => item.text() === label);
  expect(button, label).toBeDefined();
  await button!.trigger('click');
  await flushPromises();
}
afterEach(async () => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  await vi.advanceTimersByTimeAsync(1000);
  vi.useRealTimers();
});
it('updates one persistent message by ID and cleans up when leaving', async () => {
  vi.useFakeTimers();
  const wrapper = render(Message);
  await click(wrapper, '创建常驻消息');
  await click(wrapper, '更新为成功');
  expect(document.querySelectorAll('.zt-notice')).toHaveLength(1);
  expect(document.body.textContent).toContain('导入完成，共 128 条');
  wrapper.unmount();
  wrappers.pop();
  await vi.advanceTimersByTimeAsync(1000);
  expect(document.querySelector('.zt-notice')).toBeNull();
});
it('automatically closes staged fullscreen loading without leaving a mask', async () => {
  vi.useFakeTimers();
  const wrapper = render(Loading);
  await click(wrapper, '分阶段加载');
  expect(document.querySelector('.zt-loading')).not.toBeNull();
  await vi.advanceTimersByTimeAsync(3000);
  await flushPromises();
  expect(document.querySelector('.zt-loading')).toBeNull();
  expect(wrapper.text()).toContain('任务完成');
});

it('saves native dialog input and displays the returned business value', async () => {
  vi.useFakeTimers();
  const wrapper = render(Dialog);
  await click(wrapper, '打开编辑弹窗');
  document.querySelector<HTMLInputElement>('[aria-label="报表名称"]')!.value =
    '季度经营报表';
  document
    .querySelector<HTMLButtonElement>(
      '.zt-dialog .zt-overlay__button--primary',
    )!
    .click();
  await vi.advanceTimersByTimeAsync(2200);
  await flushPromises();
  expect(wrapper.text()).toContain('季度经营报表');
  expect(wrapper.text()).toContain('api');
  expect(document.querySelector('.zt-dialog')).toBeNull();
});
it('preserves a dirty drawer when discard is canceled', async () => {
  vi.useFakeTimers();
  const wrapper = render(Drawer);
  await click(wrapper, '打开筛选抽屉');
  const input = document.querySelector<HTMLInputElement>(
    '[aria-label="门店关键词"]',
  )!;
  input.value = '上海';
  input.dispatchEvent(new Event('input'));
  document
    .querySelector<HTMLButtonElement>('.zt-drawer .zt-overlay__close')!
    .click();
  await flushPromises();
  expect(document.querySelector('.zt-box')).not.toBeNull();
  document
    .querySelector<HTMLButtonElement>('[data-zt-action="cancel"]')!
    .click();
  await vi.advanceTimersByTimeAsync(1000);
  expect(document.querySelector('.zt-drawer')).not.toBeNull();
  expect(input.value).toBe('上海');
});
it('distinguishes prompt cancellation from empty input', async () => {
  vi.useFakeTimers();
  const wrapper = render(MessageBox);
  await click(wrapper, '输入名称');
  document
    .querySelector<HTMLButtonElement>('[data-zt-action="cancel"]')!
    .click();
  await vi.advanceTimersByTimeAsync(1000);
  await flushPromises();
  expect(wrapper.text()).toContain('prompt 返回 null：已取消');
});

it('shows the spring dialog even on narrow screens and provides a fullscreen comparison', async () => {
  vi.useFakeTimers();
  const originalMatchMedia = window.matchMedia;
  const matchMedia = vi
    .spyOn(window, 'matchMedia')
    .mockImplementation((query) => ({
      ...originalMatchMedia.call(window, query),
      matches: query.includes('max-width') && !query.includes('-0.02px'),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  try {
    const Motion = (await import('./Motion.vue')).default;
    const wrapper = render(Motion);
    await click(wrapper, '果冻弹窗');
    expect(document.querySelector('.zt-dialog')).not.toBeNull();
    expect(document.querySelector('.zt-dialog--fullscreen')).toBeNull();
    document
      .querySelector<HTMLButtonElement>('.zt-dialog .zt-overlay__close')!
      .click();
    await vi.advanceTimersByTimeAsync(1000);
    await flushPromises();
    await click(wrapper, '全屏淡入对照');
    expect(document.querySelector('.zt-dialog--fullscreen')).not.toBeNull();
  } finally {
    matchMedia.mockRestore();
  }
});
