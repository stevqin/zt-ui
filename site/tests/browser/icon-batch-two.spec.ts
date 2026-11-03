import { test, expect } from '@playwright/test';

const addedNames = ["bank", "coins", "banknote", "calculator", "invoice", "piggy-bank", "safe", "trend-up", "trend-down", "currency-yuan", "currency-dollar", "abacus", "bow-tie", "tie", "hat", "cap", "glasses", "sock", "boot", "sneaker", "watch", "ring", "umbrella", "thread-spool", "ship", "plane", "train", "car", "bicycle", "anchor", "crane", "hand-truck", "delivery-return", "map", "signpost", "fuel", "file-text", "file-spreadsheet", "file-pdf", "file-code", "folder-open", "folder-add", "book-open", "graduation-cap", "medal", "award", "coffee", "clipboard-signature", "contact-book", "team-meeting", "user-remove", "user-settings", "user-lock", "chat-check", "mail-open", "mail-send", "phone-call", "phone-missed", "video-call", "languages", "chart-stacked", "chart-waterfall", "chart-network", "chart-treemap", "chart-timeline", "pivot-table", "merge-cells", "split-cells", "braces", "binary", "terminal", "webhook", "arrow-up-right", "arrow-down-left", "arrows-expand", "arrows-collapse", "repeat", "shuffle", "align-left", "align-center", "align-right", "indent", "outdent", "crop", "price-tags", "discount-badge", "membership", "ticket", "scan-line", "pos-terminal", "shopping-bag-check", "storefront-check", "return-receipt", "sales-target", "loyalty-points", "voucher-stack", "cpu", "memory", "hard-drive", "usb", "plug", "battery", "battery-charging", "bluetooth", "network", "shield-alert", "lock-keyhole", "scan-face", "leaf", "flower", "tree", "mountain", "waves", "flame", "droplet", "snowflake", "thermometer", "wind", "cloud-rain", "cloud-snow"];

test('second batch has 120 distinct nonempty glyphs within the 24px canvas', async ({ page }) => {
  await page.goto('/#/components/icon');
  const gallery = page.locator('#example-gallery');
  await expect(gallery.locator('[data-icon]')).toHaveCount(309);
  const result = await gallery.locator('[data-icon] svg').evaluateAll((elements, names) => {
    const errors: string[] = [];
    const signatures: string[] = [];
    for (const svg of elements) {
      const name = svg.closest('[data-icon]')!.getAttribute('data-icon')!;
      if (!names.includes(name)) continue;
      const bounds = (svg as SVGSVGElement).getBBox();
      if (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > 24 || bounds.y + bounds.height > 24 || (!bounds.width && !bounds.height)) errors.push(name);
      signatures.push(svg.innerHTML);
    }
    return { errors, count: signatures.length, unique: new Set(signatures).size };
  }, addedNames);
  expect(result).toEqual({ errors: [], count: 120, unique: 120 });
  await page.evaluate(names => {
    const panel = document.createElement('section');
    panel.id = 'new-icon-contact-sheet';
    panel.style.cssText = 'position:absolute;top:0;left:0;z-index:99999;width:1200px;padding:32px;background:var(--doc-bg);color:var(--doc-text);font:13px system-ui;';
    panel.innerHTML = '<h1 style="margin:0 0 6px;font-size:24px">Zt Icon · 新增 120 个图标</h1><p style="margin:0 0 24px;color:var(--doc-muted)">第二批 · 总计 309 个 · 24px / 40px 实际渲染</p>';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(10,1fr);gap:8px';
    for (const name of names) {
      const source = document.querySelector(`[data-icon="${name}"] svg`)!;
      const tile = document.createElement('div');
      tile.style.cssText = 'min-width:0;height:112px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px;padding:12px 6px;border-radius:8px;background:var(--doc-surface);';
      for (const size of [24, 40]) {
        const svg = source.cloneNode(true) as SVGSVGElement;
        svg.style.cssText = `width:${size}px;height:${size}px;flex:none`;
        tile.append(svg);
      }
      const label = document.createElement('span');
      label.style.cssText = 'width:100%;font:10px/1.4 ui-monospace,monospace;text-align:center;overflow-wrap:anywhere';
      label.textContent = name;
      tile.append(label);
      grid.append(tile);
    }
    panel.append(grid);
    document.body.append(panel);
  }, addedNames);
  await page.locator('#new-icon-contact-sheet').screenshot({ path: '/tmp/zt-icon-batch2-light.png' });
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.locator('#new-icon-contact-sheet').screenshot({ path: '/tmp/zt-icon-batch2-dark.png' });
});
