import { test, expect } from '@playwright/test';

test('filter overlay stays inside the list and entry/exit arrows match their doors', async ({ page }) => {
  await page.goto('/#/components/icon');
  const gallery = page.locator('#example-gallery');
  const filterPaths = gallery.locator('[data-icon="filter-list"] svg path');
  await expect(filterPaths).toHaveCount(2);
  const overlay = await filterPaths.evaluateAll(paths => {
    const list = (paths[0] as SVGPathElement).getBBox();
    const funnel = (paths[1] as SVGPathElement).getBBox();
    return { listRight: list.x + list.width, listBottom: list.y + list.height, listHeight: list.height,
      funnelRight: funnel.x + funnel.width, funnelBottom: funnel.y + funnel.height, funnelHeight: funnel.height };
  });
  expect(overlay.funnelRight).toBeLessThanOrEqual(overlay.listRight);
  expect(overlay.funnelBottom).toBeLessThanOrEqual(overlay.listBottom);
  expect(overlay.funnelHeight).toBeLessThan(overlay.listHeight);
  for (const name of ['login', 'logout']) {
    const paths = gallery.locator(`[data-icon="${name}"] svg path`);
    await expect(paths).toHaveCount(2);
    const geometry = await paths.evaluateAll(elements => {
      const door = (elements[0] as SVGPathElement).getBBox();
      const arrow = elements[1] as SVGPathElement;
      const start = arrow.getPointAtLength(0);
      const tip = arrow.getPointAtLength(Math.sqrt(32));
      return { doorLeft: door.x, doorRight: door.x + door.width, doorHeight: door.height, arrowStart: start.x, arrowTip: tip.x };
    });
    expect(geometry.arrowTip).toBeGreaterThan(geometry.arrowStart);
    expect(geometry.doorHeight).toBeGreaterThanOrEqual(18);
    if (name === 'login') {
      expect(geometry.arrowTip).toBeGreaterThan(geometry.doorLeft);
      expect(geometry.arrowTip).toBeLessThan(geometry.doorRight);
    } else {
      expect(geometry.arrowTip).toBeGreaterThan(geometry.doorRight);
    }
  }
  await page.evaluate(() => {
    const previous = {
      'filter-list': ['M3 5h18M3 10h12M3 15h6', 'M12 13h10l-3.5 4v3.5l-3 1.5v-5L12 13Z'],
      messages: ['M3 3h14v11H8l-5 4V3Zm14 4h4v15l-5-4h-5v-4'],
      login: ['M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4', 'm10 8-4 4 4 4M6 12h9'],
      logout: ['M10 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4', 'm15 8 4 4-4 4M19 12H9'],
    };
    const frame = document.createElement('div');
    frame.id = 'icon-symbol-comparison';
    frame.style.cssText = 'position:fixed;inset:16px auto auto 16px;z-index:99999;width:640px;padding:28px;background:#fff;color:#1c293b;font:14px system-ui;border:1px solid #ddd;border-radius:12px;';
    frame.innerHTML = '<h2 style="margin:0 0 24px">图标修正 · 24px / 64px</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px"><b>修正前</b><b>修正后</b></div>';
    for (const [name, paths] of Object.entries(previous)) {
      const current = document.querySelector(`[data-icon="${name}"] svg`)!;
      const old = current.cloneNode(false) as SVGSVGElement;
      paths.forEach(d => { const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', d); old.append(path); });
      const row = document.createElement('div');
      row.dataset.symbol = name;
      row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;border-top:1px solid #e5e9ef;margin-top:16px;padding-top:16px';
      for (const svg of [old, current]) {
        const cell = document.createElement('div');
        cell.innerHTML = `<div style="font-family:monospace;margin-bottom:12px">${name}</div>`;
        for (const size of [24, 64]) {
          const copy = svg.cloneNode(true) as SVGSVGElement;
          copy.style.cssText = `width:${size}px;height:${size}px;display:inline-block;margin-right:32px;vertical-align:middle`;
          cell.append(copy);
        }
        row.append(cell);
      }
      frame.append(row);
    }
    document.body.append(frame);
  });
  await page.locator('#icon-symbol-comparison').screenshot({ path: '/tmp/zt-icon-symbols-comparison.png' });
  await page.locator('#icon-symbol-comparison [data-symbol]').evaluateAll(rows => rows.forEach(row => { if ((row as HTMLElement).dataset.symbol !== 'filter-list') row.remove(); }));
  await page.locator('#icon-symbol-comparison').screenshot({ path: '/tmp/zt-icon-filter-list-comparison.png' });

});
