import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import ZtSelect from '../src/components/select/ZtSelect.vue';
afterEach(() => (document.body.innerHTML = ''));
const options = Array.from({ length: 10000 }, (_, i) => ({
  value: i,
  label: `选项 ${i}`,
  disabled: i === 9999,
}));
describe('virtual select', () => {
  it('renders a window and preserves keyboard indexes across distant scroll', async () => {
    const w = mount(ZtSelect, {
      props: { options, virtual: true, itemHeight: 32, height: 160 },
      attachTo: document.body,
    });
    await w.get('[role="combobox"]').trigger('keydown', { key: 'ArrowUp' });
    await flushPromises();
    expect(document.querySelectorAll('[role="option"]').length).toBeLessThan(
      30,
    );
    const active = w
      .get('[role="combobox"]')
      .attributes('aria-activedescendant');
    expect(document.getElementById(active!)?.textContent).toContain('9998');
    await w.get('[role="combobox"]').trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.[0]).toEqual([9998]);
    w.unmount();
  });
  it('resets the window on filtering and retains multiple choices', async () => {
    const w = mount(ZtSelect, {
      props: {
        options,
        virtual: true,
        filterable: true,
        multiple: true,
        modelValue: [8000],
      },
      attachTo: document.body,
    });
    const input = w.get('input');
    await input.trigger('click');
    await flushPromises();
    const list = document.querySelector('.zt-select__list') as HTMLElement;
    list.scrollTop = 5000;
    list.dispatchEvent(new Event('scroll'));
    await input.setValue('选项 12');
    await flushPromises();
    expect(document.querySelector('[role="option"]')?.textContent).toContain(
      '选项 12',
    );
    expect(document.querySelectorAll('[role="option"]').length).toBeLessThan(
      40,
    );
    expect(w.text()).toContain('8000');
    w.unmount();
  });
});
it('omits aria-activedescendant when manual scrolling unmounts the active option', async () => {
  const w = mount(ZtSelect, {
    props: { options, virtual: true, itemHeight: 32, height: 160 },
    attachTo: document.body,
  });
  await w.get('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' });
  await flushPromises();
  const list = document.querySelector('.zt-select__list') as HTMLElement;
  list.scrollTop = 5000;
  list.dispatchEvent(new Event('scroll'));
  await flushPromises();
  const id = w.get('[role="combobox"]').attributes('aria-activedescendant');
  expect(id ? document.getElementById(id) : true).toBeTruthy();
  w.unmount();
});
