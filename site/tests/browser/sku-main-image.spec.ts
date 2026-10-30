import { expect, test } from '@playwright/test';

test('PC main image keeps its natural ratio, resizes with the panel, and can be hidden without clearing the SKU', async ({ page }) => {
  await page.goto('/#/components/sku-select#example-preview');
  const demo = page.locator('[data-demo="sku-preview"]');
  const panel = demo.locator('.zt-sku-select');
  const image = panel.locator('.zt-sku-select__preview img');
  const dimensions = () => image.evaluate((el: HTMLImageElement) => {
    const r = el.getBoundingClientRect(); return { width: r.width, height: r.height, natural: el.naturalWidth };
  });
  await expect.poll(async () => (await dimensions()).natural).toBe(240);
  await expect.poll(async () => { const r = await dimensions(); return Math.abs(r.width / r.height - 2 / 3); }).toBeLessThan(0.02);
  const initialWidth = (await dimensions()).width;
  await demo.getByRole('slider', { name: '主图演示面板宽度' }).press('Home');
  await expect(demo.locator('output')).toHaveText('600px');
  await expect.poll(async () => (await dimensions()).width).toBeLessThan(initialWidth);
  await panel.locator('[data-skc="LOOK-SAND"]').click();
  await expect.poll(async () => (await dimensions()).natural).toBe(480);
  await expect.poll(async () => { const r = await dimensions(); return Math.abs(r.width / r.height - 2); }).toBeLessThan(0.02);
  await panel.locator('[data-sku="LOOK-SAND-M"]').click();
  await demo.locator('label').getByRole('switch').click();
  await expect(panel.locator('.zt-sku-select__preview')).toHaveCount(0);
  const widths = await panel.evaluate(el => ({ body: el.querySelector('.zt-sku-select__body')!.getBoundingClientRect().width, details: el.querySelector('.zt-sku-select__details')!.getBoundingClientRect().width }));
  expect(widths.details).toBeCloseTo(widths.body, 0);
  await expect(panel.locator('[data-sku="LOOK-SAND-M"]')).toHaveAttribute('aria-pressed', 'true');
  await demo.locator('label').getByRole('switch').click();
  await expect(panel.locator('.zt-sku-select__preview')).toBeVisible();
  await expect(panel.locator('[data-sku="LOOK-SAND-M"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: '五档尺寸与局部覆盖', exact: true })).toHaveCount(0);
  await panel.screenshot({ path: '/tmp/zt-sku-select-adaptive-main-image.png' });
});

test('narrow containers keep the main image hidden and preserve color thumbnails', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/#/components/sku-select#example-preview');
  const panel = page.locator('[data-demo="sku-preview"] .zt-sku-select');
  await expect(panel.locator('.zt-sku-select__preview')).toBeHidden();
  await expect(panel.locator('.zt-sku-select__color-image').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
