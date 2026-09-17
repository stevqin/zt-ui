import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import ZtAlert from '../src/components/alert/ZtAlert.vue';
import { ZtMessage } from '../src/components/message';
import { ZtNotification } from '../src/components/notification';
import { ZtMessageBox } from '../src/components/message-box';
import ZtLoading from '../src/components/loading/ZtLoading.vue';
import ZtDropdown from '../src/components/dropdown/ZtDropdown.vue';
afterEach(() => {
  ZtMessage.closeAll();
  ZtNotification.closeAll();
  ZtMessageBox.closeAll();
  vi.useRealTimers();
  document.body.innerHTML = '';
});
describe('feedback additions', () => {
  it('closes an alert once and renders safe text', async () => {
    const w = mount(ZtAlert, {
      props: { title: '<b>警告</b>', closable: true },
    });
    expect(w.text()).toContain('<b>警告</b>');
    await w.get('button').trigger('click');
    expect(w.emitted('close')).toHaveLength(1);
    expect(w.find('[role="alert"]').exists()).toBe(false);
  });
  it('groups messages and releases them on expiry', async () => {
    vi.useFakeTimers();
    const a = ZtMessage({
      message: '保存完成',
      duration: 1000,
      grouping: true,
    });
    const b = ZtMessage({
      message: '保存完成',
      duration: 1000,
      grouping: true,
    });
    expect(a).toBe(b);
    await nextTick();
    expect(document.body.textContent).toContain('保存完成');
    expect(document.querySelectorAll('.zt-message')).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1001);
    expect(document.querySelector('.zt-message')).toBeNull();
  });
  it('keeps notification content visible until manually closed', async () => {
    const n = ZtNotification({
      title: '任务完成',
      message: '报表已生成',
      duration: 0,
      position: 'bottom-left',
    });
    await nextTick();
    expect(document.body.textContent).toContain('报表已生成');
    n.close();
    await nextTick();
    expect(document.querySelector('.zt-notification')).toBeNull();
  });
  it('distinguishes cancellation from confirmation', async () => {
    const p = ZtMessageBox.confirm('删除草稿？');
    const result = p.catch((e) => e);
    await nextTick();
    const buttons = [...document.querySelectorAll('button')];
    (
      buttons.find((b) => b.textContent === '取消') as HTMLButtonElement
    ).click();
    await flushPromises();
    expect(await result).toMatchObject({ action: 'cancel' });
  });
  it('validates prompt without closing then resolves entered value', async () => {
    const p = ZtMessageBox.prompt('输入名称', {
      inputValidator: (v) => v.length > 2 || '至少3个字符',
    });
    await nextTick();
    const input = document.querySelector('input')!;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const confirm = () =>
      [...document.querySelectorAll('button')]
        .find((b) => b.textContent === '确定')!
        .click();
    confirm();
    await flushPromises();
    expect(document.body.textContent).toContain('至少3个字符');
    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    confirm();
    await flushPromises();
    expect(await p).toEqual({ action: 'confirm', value: 'abc' });
  });
  it('only masks loading content when requested', async () => {
    const w = mount(ZtLoading, {
      props: { loading: false },
      slots: { default: '内容' },
    });
    expect(w.find('[role="status"]').exists()).toBe(false);
    await w.setProps({ loading: true });
    expect(w.find('[role="status"]').exists()).toBe(true);
    expect(w.attributes('aria-busy')).toBe('true');
    w.unmount();
  });
  it('dropdown skips disabled items and emits command', async () => {
    const w = mount(ZtDropdown, {
      props: {
        items: [
          { key: 'a', label: '禁止', disabled: true },
          { key: 'b', label: '编辑' },
        ],
      },
      slots: { default: '操作' },
      attachTo: document.body,
    });
    await w.get('button').trigger('keydown', { key: 'ArrowDown' });
    await flushPromises();
    const item = document.querySelector(
      '[role="menuitem"]:not([disabled])',
    ) as HTMLButtonElement;
    expect(item.textContent).toContain('编辑');
    item.click();
    await nextTick();
    expect(w.emitted('command')?.[0]?.[0]).toBe('b');
    w.unmount();
  });
});

it('pauses expiry while hovered and resumes remaining time', async () => {
  vi.useFakeTimers();
  ZtMessage({ message: '等待查看', duration: 1000 });
  await nextTick();
  const toast = document.querySelector('.zt-message')!;
  await vi.advanceTimersByTimeAsync(400);
  toast.dispatchEvent(new Event('mouseenter'));
  await vi.advanceTimersByTimeAsync(2000);
  expect(document.querySelector('.zt-message')).not.toBeNull();
  toast.dispatchEvent(new Event('mouseleave'));
  await vi.advanceTimersByTimeAsync(601);
  expect(document.querySelector('.zt-message')).toBeNull();
});
it('cleans contextual messages when the owner unmounts', async () => {
  const { defineComponent, h } = await import('vue');
  const { useZtMessage } = await import('../src/components/message');
  const Child = defineComponent({
    setup() {
      const message = useZtMessage();
      return () =>
        h(
          'button',
          { onClick: () => message({ message: '宿主消息', duration: 0 }) },
          '显示',
        );
    },
  });
  const w = mount(Child);
  await w.get('button').trigger('click');
  expect(document.body.textContent).toContain('宿主消息');
  w.unmount();
  expect(document.querySelector('.zt-message')).toBeNull();
});
