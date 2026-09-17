import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtRow } from './index';
import { ZtCol } from '../col';
it('shares horizontal gutter and handles vertical spacing', () => {
  const w = mount(ZtRow, {
    props: {
      gutter: [20, 12],
      justify: 'space-between',
      align: 'center',
      wrap: false,
    },
    slots: { default: () => h(ZtCol, { span: 12 }) },
  });
  expect(w.attributes('style')).toContain('row-gap: 12px');
  expect(w.get('.zt-col').attributes('style')).toContain('padding-left: 10px');
  expect(w.attributes('style')).toContain('nowrap');
});
it('nested rows override gutter without changing the outer context', () => {
  const w = mount(ZtRow, {
    props: { gutter: 24 },
    slots: {
      default: () =>
        h(ZtCol, { span: 24 }, () =>
          h(ZtRow, { gutter: 8 }, () => h(ZtCol, { span: 12 })),
        ),
    },
  });
  const cols = w.findAll('.zt-col');
  expect(cols[0].attributes('style')).toContain('padding-left: 12px');
  expect(cols[1].attributes('style')).toContain('padding-left: 4px');
});
