import { test, expect } from '@playwright/test';

test('description grids keep spans, alignment and wrapped values inside their panels', async ({ page }) => {
  await page.goto('/#/components/descriptions');
  await expect(page.locator('.zt-descriptions').first()).toBeVisible();
  const geometry = await page.locator('.zt-descriptions').evaluateAll(nodes => nodes.map(node => {
    const bounds = node.querySelector('dl')!.getBoundingClientRect();
    const items = [...node.querySelectorAll('.zt-descriptions__item')].map(item => {
      const rect = item.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width, scroll: item.scrollWidth, client: item.clientWidth };
    });
    return { left: bounds.left, right: bounds.right, width: node.querySelector('dl')!.clientWidth, items };
  }));
  expect(geometry.length).toBeGreaterThanOrEqual(3);
  for (const grid of geometry) for (const item of grid.items) {
    expect(item.left).toBeGreaterThanOrEqual(grid.left - 1);
    expect(item.right).toBeLessThanOrEqual(grid.right + 1);
    expect(item.scroll).toBeLessThanOrEqual(item.client + 1);
  }
  expect(Math.abs(geometry[0].items[4].width - geometry[0].width)).toBeLessThanOrEqual(1);
  await page.locator('.zt-descriptions dd').first().evaluate(node => { node.textContent = 'ORDER_' + 'A'.repeat(160); });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const panel of await page.locator('.zt-descriptions').all()) {
    const data = await panel.evaluate(node => {
      const grid = node.querySelector('dl')!;
      return { width: grid.clientWidth, scroll: grid.scrollWidth, items: [...node.querySelectorAll('.zt-descriptions__item')].map(item => item.getBoundingClientRect().width) };
    });
    expect(data.scroll).toBeLessThanOrEqual(data.width);
    for (const width of data.items) expect(Math.abs(width - data.width)).toBeLessThanOrEqual(1);
  }
});
