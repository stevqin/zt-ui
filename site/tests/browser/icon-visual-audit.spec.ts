import { test, expect } from '@playwright/test';

test('renders every built-in icon at 24px and 48px for visual auditing', async ({ page }) => {
  await page.goto('/#/components/icon');
  await expect(page.locator('[data-icon]')).toHaveCount(309);
  await page.evaluate(() => {
    const icons = Array.from(document.querySelectorAll('[data-icon]'));
    const collection = document.createElement('main');
    collection.id = 'icon-audit';
    collection.style.cssText = 'position:absolute;inset:0 auto auto 0;z-index:99999;background:#fff;color:#202936;width:1240px;font:13px system-ui;';
    for (let start = 0; start < icons.length; start += 60) {
      const sheet = document.createElement('section');
      sheet.dataset.sheet = String(start / 60 + 1);
      sheet.style.cssText = 'padding:28px;width:1240px;background:#fff';
      sheet.innerHTML = `<h2 style="margin:0 0 22px">Zt Icon · ${start + 1}–${Math.min(start + 60, icons.length)} / ${icons.length} · 24px / 48px</h2>`;
      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(10,1fr);gap:8px';
      for (const original of icons.slice(start, start + 60)) {
        const cell = document.createElement('div');
        const name = original.getAttribute('data-icon')!;
        cell.style.cssText = 'height:112px;min-width:0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:10px 5px;border-radius:8px;background:#f4f6f8;';
        for (const size of [24, 48]) {
          const svg = original.querySelector('svg')!.cloneNode(true) as SVGSVGElement;
          svg.style.cssText = `width:${size}px;height:${size}px;flex:none`;
          cell.append(svg);
        }
        const label = document.createElement('span');
        label.textContent = name;
        label.style.cssText = 'width:100%;text-align:center;font:10px/1.4 ui-monospace,monospace;overflow-wrap:anywhere';
        cell.append(label);
        grid.append(cell);
      }
      sheet.append(grid);
      collection.append(sheet);
    }
    document.body.append(collection);
  });
  for (let sheet = 1; sheet <= 6; sheet++) {
    await page.locator(`[data-sheet="${sheet}"]`).screenshot({ path: `/tmp/zt-icon-audit-${sheet}.png` });
  }
});
