import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtQRCode } from './index';
import { encodeQRCode } from './encode';
import jsQR from 'jsqr';
it('round trips a unicode payload through an independent decoder', () => {
  const value = 'https://example.com/订单?id=42';
  const qr = encodeQRCode(value, 'H');
  const scale = 6,
    margin = 4,
    width = (qr.size + margin * 2) * scale;
  const pixels = new Uint8ClampedArray(width * width * 4).fill(255);
  for (let y = 0; y < qr.size; y++)
    for (let x = 0; x < qr.size; x++)
      if (qr.data[y * qr.size + x])
        for (let dy = 0; dy < scale; dy++)
          for (let dx = 0; dx < scale; dx++) {
            const index =
              (((y + margin) * scale + dy) * width +
                (x + margin) * scale +
                dx) *
              4;
            pixels[index] = pixels[index + 1] = pixels[index + 2] = 0;
          }
  expect(jsQR(pixels, width, width)?.data).toBe(value);
});
it('renders accessible SVG and explicit empty/error states', async () => {
  const w = mount(ZtQRCode, {
    props: { value: 'hello', size: 140, level: 'M' },
  });
  expect(w.get('svg').attributes('width')).toBe('140');
  expect(w.get('svg').attributes('role')).toBe('img');
  await w.setProps({ value: '' });
  expect(w.get('[role="status"]').text()).toContain('暂无内容');
  await w.setProps({ value: 'x'.repeat(10000) });
  expect(w.get('[role="alert"]').text()).toContain('编码失败');
});
it('downloads SVG and releases its object URL', async () => {
  vi.useFakeTimers();
  const create = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:qr-test'),
    revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {}),
    click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
  const w = mount(ZtQRCode, { props: { value: 'download' } });
  expect(
    (w.vm as unknown as { download: (name: string) => boolean }).download(
      'report',
    ),
  ).toBe(true);
  expect(w.emitted('download')?.[0]).toEqual(['report.svg']);
  expect(create).toHaveBeenCalled();
  expect(click).toHaveBeenCalled();
  vi.runAllTimers();
  expect(revoke).toHaveBeenCalledWith('blob:qr-test');
  w.unmount();
  create.mockRestore();
  revoke.mockRestore();
  click.mockRestore();
  vi.useRealTimers();
});
it('reclaims download URLs and timers on unmount', () => {
  vi.useFakeTimers();
  const create = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:cleanup'),
    revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {}),
    click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
  const w = mount(ZtQRCode, { props: { value: 'cleanup' } });
  (w.vm as unknown as { download: () => boolean }).download();
  w.unmount();
  expect(revoke).toHaveBeenCalledWith('blob:cleanup');
  expect(vi.getTimerCount()).toBe(0);
  create.mockRestore();
  revoke.mockRestore();
  click.mockRestore();
  vi.useRealTimers();
});
it('reports Canvas renderer failure and recovers when changing renderer', async () => {
  const context = vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue(null);
  const w = mount(ZtQRCode, { props: { value: 'canvas', renderAs: 'canvas' } });
  await nextTick();
  expect(w.get('[role=alert]').text()).toContain('编码失败');
  expect(w.emitted('error')).toHaveLength(1);
  await w.setProps({
    renderAs: 'svg',
    color: '#ffffff',
    background: '#111111',
  });
  await flushPromises();
  expect(w.get('svg path').attributes('fill')).toBe('#ffffff');
  expect(w.get('svg rect').attributes('fill')).toBe('#111111');
  w.unmount();
  context.mockRestore();
});
