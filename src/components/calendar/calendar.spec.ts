import { it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Calendar from './ZtCalendar.vue';
it('builds leap month grid and selects controlled date', async () => {
  const w = mount(Calendar, { props: { modelValue: '2024-02-10' } });
  expect(w.findAll('[data-date]')).toHaveLength(42);
  await w.get('[data-date="2024-02-29"]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['2024-02-29']);
});
it('week view has seven days and range blocks selection', async () => {
  const w = mount(Calendar, {
    props: {
      modelValue: '2024-02-10',
      view: 'week',
      range: ['2024-02-09', '2024-02-11'],
    },
  });
  expect(w.findAll('[data-date]')).toHaveLength(7);
  expect(
    w.get('[data-date="2024-02-08"]').attributes('disabled'),
  ).toBeDefined();
  await w.get('[data-date="2024-02-08"]').trigger('click');
  expect(w.emitted('update:modelValue')).toBeUndefined();
});
it('navigates months and displays holiday labels', async () => {
  const w = mount(Calendar, {
    props: {
      modelValue: '2024-02-10',
      holidays: [{ key: '2024-02-10', value: '春节' }],
    },
  });
  expect(w.text()).toContain('春节');
  await w.get('[aria-label=下个月]').trigger('click');
  expect(w.text()).toContain('2024 年 3 月');
});
it('keyboard navigation crosses months with focus restoration', async () => {
  const w = mount(Calendar, {
    attachTo: document.body,
    props: { modelValue: '2024-02-29' },
  });
  await w
    .get('[data-date="2024-02-29"]')
    .trigger('keydown', { key: 'PageDown' });
  expect(w.text()).toContain('2024 年 3 月');
  expect(document.activeElement?.getAttribute('data-date')).toBe('2024-03-29');
  w.unmount();
});
it('invalid ranges disable every cell and toolbar view switch works', async () => {
  const w = mount(Calendar, {
    props: { modelValue: '2024-02-10', range: ['invalid', '2024-02-20'] },
  });
  expect(w.findAll('[data-date]:disabled')).toHaveLength(42);
  await w.findAll('header button').at(-1)!.trigger('click');
  expect(w.findAll('[data-date]')).toHaveLength(7);
  expect(w.emitted('update:view')?.[0]).toEqual(['week']);
});
