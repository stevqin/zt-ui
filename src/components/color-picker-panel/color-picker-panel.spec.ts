import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ZtColorPickerPanel from './ZtColorPickerPanel.vue';
describe('ColorPickerPanel', () => {
  it('reports invalid text and disables confirm until valid', async () => {
    const w = mount(ZtColorPickerPanel, {
      props: { modelValue: '#ff0000', showAlpha: true },
    });
    await w.find('input[type=text]').setValue('invalid');
    expect(w.find('[role=alert]').exists()).toBe(true);
    expect(
      w.find('[data-action=confirm]').attributes('disabled'),
    ).toBeDefined();
    await w.find('input[type=text]').setValue('rgba(0,0,255,0.5)');
    await w.find('[data-action=confirm]').trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['#0000ff80']);
  });
});
it('supports keyboard palette editing, alpha, and semantic status without premature commit', async () => {
  const w = mount(ZtColorPickerPanel, {
    props: { modelValue: '#ff0000', showAlpha: true, status: 'success' },
  });
  await w
    .find('.zt-color-panel__palette')
    .trigger('keydown', { key: 'ArrowLeft', shiftKey: true });
  expect(w.emitted('update:modelValue')).toBeUndefined();
  await w.find('[aria-label="透明度"]').setValue('0.5');
  await w.find('[data-action=confirm]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['#ff1a1a80']);
  expect(w.attributes('style')).toContain('--zt-success-ink');
  await w.setProps({ disabled: true });
  await w.find('[data-action=confirm]').trigger('click');
  expect(w.emitted('update:modelValue')).toHaveLength(1);
  w.unmount();
});
it('tracks pointer palette movement and releases capture on unmount', async () => {
  const w = mount(ZtColorPickerPanel, { props: { modelValue: '#ff0000' } });
  const p = w.find('.zt-color-panel__palette');
  p.element.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
  await p.trigger('pointerdown', { pointerId: 1, clientX: 50, clientY: 50 });
  await p.trigger('pointerup', { pointerId: 1 });
  await w.find('[data-action=confirm]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['#804040']);
  w.unmount();
});
