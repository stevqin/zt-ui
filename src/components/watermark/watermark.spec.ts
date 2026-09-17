import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtWatermark } from './index';
it('renders multiline text safely and reacts to appearance changes', async () => {
  const w = mount(ZtWatermark, {
    props: { content: ['内部资料', '<script>'], rotate: -15, gap: [20, 30] },
  });
  const layer = w.get('.zt-watermark__layer');
  expect(layer.attributes('aria-hidden')).toBe('true');
  const uri = layer.attributes('style');
  expect(w.get('.zt-watermark__tile').text()).toContain('<script>');
  expect(w.find('script').exists()).toBe(false);
  await w.setProps({ rotate: 0, opacity: 0.3 });
  expect(layer.attributes('style')).toContain('opacity: 0.3');
  expect(layer.attributes('style')).not.toBe(uri);
});
