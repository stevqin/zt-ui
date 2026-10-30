import { expect, test } from '@playwright/test';

test('size columns share available width and fit a normal PC panel before scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1100 });
  await page.goto('/#/components/sku-input');
  const panel = page.locator('[data-demo="sku-input-basic"] .zt-sku-input');
  const sizes = panel.locator('thead [data-size]');
  const widths = () => sizes.evaluateAll(cells => cells.map(cell => cell.getBoundingClientRect().width));
  await panel.evaluate(el => { el.style.width = '1000px'; });
  const wide = await widths();
  const colorWidth = await panel.locator('tbody th').first().evaluate(el => el.getBoundingClientRect().width);
  await panel.evaluate(el => { el.style.width = '720px'; });
  await expect.poll(() => panel.locator('.zt-sku-input__scroll').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  const compact = await widths();
  expect(Math.max(...compact) - Math.min(...compact)).toBeLessThan(1);
  expect(compact[0]).toBeLessThan(wide[0]);
  expect(await panel.locator('tbody th').first().evaluate(el => el.getBoundingClientRect().width)).toBeLessThan(colorWidth);
  await panel.screenshot({ path: '/tmp/zt-sku-input-fluid-columns.png' });
});

test('all five global sizes adjust data, heading and summary row heights together', async ({ page }) => {
  await page.goto('/#/components/sku-input');
  const panel = page.locator('[data-demo="sku-input-basic"] .zt-sku-input');
  const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
  let previous = [0, 0, 0];
  for (const size of ['mini', 'small', 'default', 'medium', 'large']) {
    await tools.getByRole('combobox', { name: '组件尺寸' }).click();
    await page.getByRole('option', { name: size, exact: true }).click();
    const heights = await panel.evaluate(el => ['thead tr', 'tbody tr', 'tfoot tr'].map(selector => el.querySelector(selector)!.getBoundingClientRect().height));
    for (let i = 0; i < heights.length; i++) expect(heights[i], `${size} row ${i}`).toBeGreaterThan(previous[i]!);
    previous = heights;
  }
});
