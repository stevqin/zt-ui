import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtStatistic } from './index';
it('formats finite values and does not convert invalid data into zero', async () => {
  const w = mount(ZtStatistic, {
    props: { value: 12345.6, precision: 2, prefix: '¥', suffix: '元' },
  });
  expect(w.text()).toBe('¥12,345.60元');
  await w.setProps({ value: NaN });
  expect(w.text()).toBe('¥—元');
  await w.setProps({ value: 12, formatter: (v) => v + ' 件' });
  expect(w.text()).toBe('¥12 件元');
});
it('supports negative numbers custom separators and fallback before formatter', () => {
  const formatter = vi.fn();
  const invalid = mount(ZtStatistic, {
    props: { value: Infinity, fallback: '不可用', formatter },
  });
  expect(invalid.text()).toBe('不可用');
  expect(formatter).not.toHaveBeenCalled();
  const negative = mount(ZtStatistic, {
    props: {
      value: -1234.25,
      precision: 2,
      groupSeparator: ' ',
      decimalSeparator: ',',
    },
  });
  expect(negative.text()).toBe('-1 234,25');
  expect(mount(ZtStatistic).text()).toBe('—');
});
