import { afterEach, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import Tooltip from '../src/components/tooltip/ZtTooltip.vue';
import Dropdown from '../src/components/dropdown/ZtDropdown.vue';
import { ZtMessage, useZtMessage } from '../src/components/message';
import Config from '../src/components/config-provider/ZtConfigProvider.vue';
afterEach(() => {
  ZtMessage.closeAll();
  vi.useRealTimers();
  document.body.innerHTML = '';
});
it('disabled tooltip ignores initially visible state', async () => {
  const w = mount(Tooltip, {
    props: { visible: true, disabled: true, content: 'hidden' },
  });
  await nextTick();
  expect(document.querySelector('[role=tooltip]')).toBeNull();
  w.unmount();
});
it('tooltip remains visible while keyboard focus is inside after pointer leaves', async () => {
  vi.useFakeTimers();
  const w = mount(Tooltip, {
    props: { content: 'help', openDelay: 0, closeDelay: 0 },
    slots: { default: 'Target' },
  });
  await w.get('.zt-tooltip__trigger').trigger('focusin');
  await vi.runAllTimersAsync();
  await w.get('.zt-tooltip__trigger').trigger('pointerleave');
  await vi.runAllTimersAsync();
  expect(document.querySelector('[role=tooltip]')).not.toBeNull();
  w.unmount();
});
it('dropdown closes and cannot command when disabled while open', async () => {
  const w = mount(Dropdown, {
    props: { items: [{ key: 'a', label: 'Edit' }] },
  });
  await w.get('button').trigger('keydown', { key: 'ArrowDown' });
  await flushPromises();
  expect(document.querySelector('[role=menu]')).not.toBeNull();
  await w.setProps({ disabled: true });
  await flushPromises();
  expect(document.querySelector('[role=menu]')).toBeNull();
  expect(w.emitted('command')).toBeUndefined();
  w.unmount();
});
it('different component owners do not share grouped message ownership', async () => {
  const Child = defineComponent({
    setup() {
      const message = useZtMessage();
      return () =>
        h(
          'button',
          {
            onClick: () =>
              message({ message: 'same', grouping: true, duration: 0 }),
          },
          'show',
        );
    },
  });
  const w = mount(Config, {
    slots: { default: () => [h(Child, { key: 'a' }), h(Child, { key: 'b' })] },
  });
  await w.findAll('button')[0]!.trigger('click');
  await w.findAll('button')[1]!.trigger('click');
  expect(document.querySelectorAll('.zt-message')).toHaveLength(2);
  w.unmount();
});
it('grouped updates do not restart a hovered message timer', async () => {
  vi.useFakeTimers();
  ZtMessage({ message: 'pause', grouping: true, duration: 1000 });
  await nextTick();
  document.querySelector('.zt-message')!.dispatchEvent(new Event('mouseenter'));
  ZtMessage({ message: 'pause', grouping: true, duration: 1000 });
  await vi.advanceTimersByTimeAsync(1500);
  expect(document.querySelector('.zt-message')).not.toBeNull();
});
it('dropdown Escape reports one close transition', async () => {
  const w = mount(Dropdown, {
    props: { items: [{ key: 'a', label: 'Edit' }] },
    attachTo: document.body,
  });
  await w.get('button').trigger('keydown', { key: 'ArrowDown' });
  await flushPromises();
  document
    .querySelector('[role=menuitem]')!
    .dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
  await flushPromises();
  expect(
    w.emitted('visible-change')?.filter((args) => args[0] === false),
  ).toHaveLength(1);
  w.unmount();
});
it('message hover and focus pause independently', async () => {
  vi.useFakeTimers();
  ZtMessage({ message: 'two causes', duration: 1000 });
  await nextTick();
  const toast = document.querySelector('.zt-message')!;
  toast.dispatchEvent(new Event('mouseenter'));
  toast.dispatchEvent(new Event('focusin'));
  toast.dispatchEvent(new Event('mouseleave'));
  await vi.advanceTimersByTimeAsync(1500);
  expect(document.querySelector('.zt-message')).not.toBeNull();
  toast.dispatchEvent(new Event('focusout'));
  await vi.advanceTimersByTimeAsync(1001);
  expect(document.querySelector('.zt-message')).toBeNull();
});
it('contextual messages retain dark theme and supplied size', async () => {
  const Child = defineComponent({
    setup() {
      const message = useZtMessage();
      return () =>
        h(
          'button',
          { onClick: () => message({ message: 'dark', duration: 0 }) },
          'show',
        );
    },
  });
  const w = mount(Config, {
    props: { theme: 'dark', size: 'large' },
    slots: { default: () => h(Child) },
  });
  await w.get('button').trigger('click');
  const toast = document.querySelector<HTMLElement>('.zt-message')!;
  expect(toast.style.getPropertyValue('--zt-surface')).toBe('#343c49');
  expect(toast.style.fontSize).toBe('15px');
  w.unmount();
});
it('message box async failure allows retry and restores initial focus', async () => {
  const { ZtMessageBox } = await import('../src/components/message-box');
  const trigger = document.createElement('button');
  document.body.append(trigger);
  trigger.focus();
  let calls = 0;
  const result = ZtMessageBox.confirm('Save', {
    beforeConfirm: async () => {
      if (!calls++) throw Error('failed');
    },
  });
  await flushPromises();
  const confirm = () =>
    [...document.querySelectorAll('button')]
      .find((b) => b.textContent === '确定')!
      .click();
  confirm();
  await flushPromises();
  expect(document.body.textContent).toContain('failed');
  confirm();
  expect(await result).toEqual({ action: 'confirm', value: '' });
  await flushPromises();
  expect(document.activeElement).toBe(trigger);
});
