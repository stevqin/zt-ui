import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtCol } from './index';
it('applies span offset and responsive overrides', () => {
  const w = mount(ZtCol, {
    props: { span: 12, offset: 2, xs: 24, md: { span: 8, offset: 4 } },
  });
  expect(w.classes()).toContain('zt-col-12');
  expect(w.classes()).toContain('zt-col-offset-2');
  expect(w.classes()).toContain('zt-col-xs-24');
  expect(w.classes()).toContain('zt-col-md-offset-4');
});
