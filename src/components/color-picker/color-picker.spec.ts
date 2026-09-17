import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { parseColor, toHex } from './color';
import ZtColorPicker from './ZtColorPicker.vue';
describe('ColorPicker', () => {
  it('parses HEX/RGB/HSL and rejects invalid inputs', () => {
    expect(toHex(parseColor('#f008')!, true)).toBe('#ff000088');
    expect(toHex(parseColor('rgb(255, 0, 0)')!)).toBe('#ff0000');
    expect(toHex(parseColor('hsl(120, 100%, 50%)')!)).toBe('#00ff00');
    expect(parseColor('rgb(999,0,0)')).toBeNull();
    expect(parseColor('not a color')).toBeNull();
  });
  it('cancels drafts and commits only valid confirmation', async () => {
    const w = mount(ZtColorPicker, {
      props: { modelValue: '#ff0000', presets: ['#00ff00'] },
    });
    await w.find('[aria-label="选择颜色"]').trigger('click');
    const p = document.querySelector(
      '[aria-label="预设 #00ff00"]',
    ) as HTMLButtonElement;
    p.click();
    await w.vm.$nextTick();
    (
      document.querySelector('[data-action=cancel]') as HTMLButtonElement
    ).click();
    expect(w.emitted('update:modelValue')).toBeUndefined();
    await w.vm.$nextTick();
    await w.find('[aria-label="选择颜色"]').trigger('click');
    (
      document.querySelector('[data-action=confirm]') as HTMLButtonElement
    ).click();
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['#ff0000']);
    w.unmount();
  });
});
