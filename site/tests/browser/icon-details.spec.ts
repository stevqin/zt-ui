import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
const originals = JSON.parse(readFileSync(new URL('../fixtures/icon-mature-reference.json', import.meta.url), 'utf8'));

test('reference-based adaptations stay in bounds and render a visual comparison', async ({ page }) => {
  await page.goto('/#/components/icon');
  await expect(page.locator('[data-icon]')).toHaveCount(309);
  const invalid = await page.locator('[data-icon] svg').evaluateAll(elements => elements.flatMap(el => {
    const b = (el as SVGSVGElement).getBBox();
    return b.x < 0 || b.y < 0 || b.x + b.width > 24.1 || b.y + b.height > 24.1 ? [el.closest('[data-icon]')!.getAttribute('data-icon')] : [];
  }));
  expect(invalid).toEqual([]);
  await expect(page.locator('[data-icon="barcode"] svg')).toHaveAttribute('stroke-linecap', 'butt');
  await page.evaluate(before => {
    const panel = document.createElement('section');
    panel.id = 'detail-comparison';
    panel.style.cssText = 'position:absolute;top:0;left:0;z-index:99999;width:1440px;padding:28px;background:#fff;color:#202936;font:13px system-ui';
    panel.innerHTML = '<h1 style="margin:0 0 6px;font-size:24px">Zt Icon · 成熟参考与少量微调</h1><p style="color:#60656f;margin:0 0 24px">每格左侧为成熟参考，右侧为微调后 · 24px / 56px</p>';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:12px';
    for (const [name, shapes] of Object.entries(before)) {
      const source = document.querySelector(`[data-icon="${name}"] svg`)!;
      const old = source.cloneNode(false) as SVGSVGElement;
      old.setAttribute('stroke-linecap', 'round');
      for (const shape of shapes as any[]) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', shape[0]);
        const attributes = shape[0] === 'path' ? { d: shape[1] } : shape[0] === 'circle'
          ? { cx: shape[1], cy: shape[2], r: shape[3] }
          : { x: shape[1], y: shape[2], width: shape[3], height: shape[4], rx: shape[5] ?? 0 };
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
        old.append(element);
      }
      const cell = document.createElement('div');
      cell.style.cssText = 'padding:14px 12px;background:#f4f6f8;border-radius:10px';
      cell.innerHTML = `<strong style="display:block;margin-bottom:12px;font:600 12px ui-monospace,monospace">${name}</strong>`;
      const row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px';
      for (const [index, svg] of [old, source].entries()) {
        const column = document.createElement('div');
        column.innerHTML = `<div style="margin-bottom:10px;color:#60656f;font-size:10px">${index === 0 ? '成熟参考' : '微调后'}</div>`;
        for (const size of [24, 56]) {
          const copy = svg.cloneNode(true) as SVGSVGElement;
          copy.style.cssText = `display:inline-block;width:${size}px;height:${size}px;margin-right:8px;vertical-align:middle`;
          column.append(copy);
        }
        row.append(column);
      }
      cell.append(row);
      grid.append(cell);
    }
    panel.append(grid);
    document.body.append(panel);
  }, originals);
  await page.locator('#detail-comparison').screenshot({ path: '/tmp/zt-icon-reference-adapted.png' });
});
