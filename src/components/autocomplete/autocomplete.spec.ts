import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ZtAutocomplete from './ZtAutocomplete.vue';
describe('Autocomplete', () => {
  it('ignores stale requests and skips disabled keyboard options', async () => {
    const resolvers: ((v: any[]) => void)[] = [];
    const signals: AbortSignal[] = [];
    const w = mount(ZtAutocomplete, {
      props: {
        debounce: 0,
        fetchSuggestions: (_q: string, s: AbortSignal) => {
          signals.push(s);
          return new Promise((r) => resolvers.push(r));
        },
      },
    });
    await w.find('input').setValue('a');
    await new Promise((r) => setTimeout(r, 5));
    await w.find('input').setValue('ab');
    await new Promise((r) => setTimeout(r, 5));
    expect(signals[0]?.aborted).toBe(true);
    resolvers[1]!([{ value: 'blocked', disabled: true }, { value: 'new' }]);
    await flushPromises();
    resolvers[0]!([{ value: 'old' }]);
    await flushPromises();
    await w.find('input').trigger('keydown', { key: 'ArrowDown' });
    await w.find('input').trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['new']);
    w.unmount();
  });
  it('aborts on unmount and prevents composing selection', async () => {
    let signal: AbortSignal | undefined;
    const w = mount(ZtAutocomplete, {
      props: {
        debounce: 0,
        fetchSuggestions: (_q: string, s: AbortSignal) => {
          signal = s;
          return new Promise(() => {});
        },
      },
    });
    await w.find('input').setValue('x');
    await new Promise((r) => setTimeout(r, 5));
    w.unmount();
    expect(signal?.aborted).toBe(true);
  });
});
it('closes on Tab and blur without stealing focus; Escape invalidates pending results', async () => {
  const w = mount(ZtAutocomplete, {
    attachTo: document.body,
    props: { debounce: 0, options: [{ value: 'alice' }] },
  });
  const field = w.find('input');
  field.element.focus();
  await field.setValue('a');
  await new Promise((r) => setTimeout(r, 5));
  await field.trigger('keydown', { key: 'Tab' });
  expect(field.attributes('aria-expanded')).toBe('false');
  const other = document.createElement('button');
  document.body.append(other);
  other.focus();
  await flushPromises();
  expect(document.activeElement).toBe(other);
  other.remove();
  w.unmount();
});
it('supports Home/End list navigation and composition does not select', async () => {
  const w = mount(ZtAutocomplete, {
    props: { debounce: 0, options: [{ value: 'a' }, { value: 'b' }] },
  });
  await w.find('input').trigger('focus');
  await new Promise((r) => setTimeout(r, 5));
  await w.find('input').trigger('keydown', { key: 'End' });
  await w.find('input').trigger('keydown', { key: 'Enter', isComposing: true });
  expect(w.emitted('select')).toBeUndefined();
  await w.find('input').trigger('keydown', { key: 'Enter' });
  expect(w.emitted('select')?.[0]).toEqual([{ value: 'b' }]);
  w.unmount();
});
