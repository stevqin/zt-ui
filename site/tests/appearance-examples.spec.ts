import { expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { ZtConfigProvider } from '@ztechjs/zt-ui';
import Shared from '../src/examples/sku-input/Shared.vue';
import { pages } from '../src/content/components';
import { buildSearchIndex } from '../src/app/search';
import { apiDocuments } from '../src/app/api';

it('omits dedicated size comparison and local appearance override demos from pages and search', () => {
  const examples = pages.flatMap(page => page.examples);
  expect(examples.some(example => /五档尺寸|尺寸对比|局部覆盖|嵌套覆盖/.test(example.title))).toBe(false);
  const index = buildSearchIndex(pages, [], apiDocuments);
  expect(index.some(record => /example-(?:sizes|priority)$/.test(record.path))).toBe(false);
});

it('uses global size in the shared SKU example without a local size selector', async () => {
  const wrapper = mount(ZtConfigProvider, { props: { size: 'small' }, slots: { default: () => h(Shared) } });
  expect(wrapper.findAll('[role="combobox"]')).toHaveLength(0);
  expect(wrapper.get('.zt-sku-input').classes()).toContain('zt-sku-input--small');
  expect(wrapper.get('.zt-sku-select').classes()).toContain('zt-sku-select--small');
  await wrapper.setProps({ size: 'large' });
  expect(wrapper.get('.zt-sku-input').classes()).toContain('zt-sku-input--large');
  expect(wrapper.get('.zt-sku-select').classes()).toContain('zt-sku-select--large');
  wrapper.unmount();
});
