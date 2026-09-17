import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ZtMention from './ZtMention.vue';
describe('Mention', () => {
  it('inserts a chosen mention at cursor without losing trailing text', async () => {
    const w = mount(ZtMention, {
      props: {
        modelValue: 'Hello @al world',
        options: [{ value: 'alice' }],
        debounce: 0,
      },
    });
    const el = w.find('textarea');
    el.element.setSelectionRange(9, 9);
    await el.trigger('input');
    await new Promise((r) => setTimeout(r, 5));
    await flushPromises();
    await el.trigger('keydown', { key: 'ArrowDown' });
    await el.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([
      'Hello @alice world',
    ]);
    expect(w.emitted('select')?.length).toBe(1);
    w.unmount();
  });
});
it('cancels superseded asynchronous queries and handles errors without stale suggestions', async () => {
  const calls: {
    signal: AbortSignal;
    resolve: (v: { value: string }[]) => void;
    reject: (e: Error) => void;
  }[] = [];
  const w = mount(ZtMention, {
    props: {
      'onUpdate:modelValue': (value: string) =>
        w.setProps({ modelValue: value }),
      debounce: 0,
      fetchSuggestions: (_q: string, _p: string, signal: AbortSignal) =>
        new Promise((resolve, reject) =>
          calls.push({ signal, resolve, reject }),
        ),
    },
  });
  const el = w.find('textarea');
  await el.setValue('@a');
  el.element.setSelectionRange(2, 2);
  await el.trigger('click');
  await new Promise((r) => setTimeout(r, 5));
  await el.setValue('@ab');
  el.element.setSelectionRange(3, 3);
  await el.trigger('click');
  await new Promise((r) => setTimeout(r, 5));
  expect(calls[0]!.signal.aborted).toBe(true);
  calls.at(-1)!.reject(new Error('failed'));
  await flushPromises();
  expect(document.body.textContent).toContain('failed');
  calls[0]!.resolve([{ value: 'stale' }]);
  await flushPromises();
  await el.trigger('keydown', { key: 'ArrowDown' });
  await el.trigger('keydown', { key: 'Enter' });
  expect(w.emitted('select')).toBeUndefined();
  w.unmount();
  expect(calls.at(-1)!.signal.aborted).toBe(true);
});
it('does not show or select suggestions for disabled and composing input', async () => {
  const w = mount(ZtMention, {
    props: { options: [{ value: 'a' }], debounce: 0 },
  });
  const el = w.find('textarea');
  await el.trigger('compositionstart');
  await el.setValue('@a');
  await el.trigger('keydown', { key: 'Enter', isComposing: true });
  expect(el.attributes('aria-expanded')).toBe('false');
  await el.trigger('compositionend');
  await new Promise((r) => setTimeout(r, 5));
  await w.setProps({ disabled: true });
  await el.trigger('keydown', { key: 'ArrowDown' });
  await el.trigger('keydown', { key: 'Enter' });
  expect(w.emitted('select')).toBeUndefined();
  w.unmount();
});
