import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectNoOverflow(page: Page, element: Locator) {
  await expect(element).toBeVisible();
  const bounds = await element.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  expect(await element.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

for (const width of [320, 390, 1440]) {
  test(`SKU single SKC defaults its color and leaves size empty at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/sku-select');
    const demo = page.locator('[data-demo="sku-single"]');
    const panel = demo.locator('.zt-sku-select');
    await expect(demo).toContainText('单色 SKU：尚未选择');
    await expect(panel.locator('[data-skc="VEST-CREAM"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('[data-sku]')).toHaveCount(2);
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await expect(panel.getByRole('button', { name: '切换商品', exact: true })).toHaveCount(0);
    const thumbnail = panel.locator('.zt-sku-select__color-image').first();
    await expect(thumbnail).toBeVisible();
    await expect.poll(() => thumbnail.locator('img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    await panel.locator('[data-sku="VEST-CREAM-M"]').click();
    await expect(demo).toContainText('单色 SKU：VEST-CREAM-M');
    await panel.getByRole('button', { name: '清空选择', exact: true }).click();
    await expect(demo).toContainText('单色 SKU：尚未选择');
    await expect(panel.locator('[data-skc="VEST-CREAM"]')).toHaveAttribute('aria-pressed', 'true');
    await expectNoOverflow(page, panel);
  });

  test(`SKU modal skips disabled colors and follows external product selection at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/sku-select');
    const demo = page.locator('[data-demo="sku-responsive"]');
    await demo.getByRole('button', { name: '打开商品选择', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: '选择商品规格', exact: true });
    const panel = dialog.locator('.zt-sku-select');
    await expect(dialog).toBeVisible();
    await expect(panel.locator('[data-skc="COAT-ROSE"]')).toBeDisabled();
    await expect(panel.locator('[data-skc="COAT-ROSE"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(panel.locator('[data-skc="COAT-SAGE"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await expect(demo).toContainText('弹层 SKU：尚未选择');
    const thumbnail = panel.locator('[data-skc="COAT-SAGE"] .zt-sku-select__color-image');
    await expect(thumbnail).toBeVisible();
    await expect.poll(() => thumbnail.locator('img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    if (width < 640) await expect(panel.locator('.zt-sku-select__preview')).toBeHidden();
    else await expect(panel.locator('.zt-sku-select__preview')).toBeVisible();
    await expectNoOverflow(page, dialog);
    await expectNoOverflow(page, panel);

    await panel.locator('[data-skc="COAT-INK"]').click();
    await panel.locator('[data-sku="COAT-INK-L"]').click();
    await expect(demo).toContainText('弹层 SKU：COAT-INK-L');
    await panel.getByRole('button', { name: '清空选择', exact: true }).click();
    await expect(panel.locator('[data-skc="COAT-SAGE"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await expect(demo).toContainText('弹层 SKU：尚未选择');

    await expect(panel.getByRole('button', { name: '切换商品', exact: true })).toHaveCount(0);
    await expect(panel.getByRole('combobox')).toHaveCount(0);
    await dialog.getByRole('combobox', { name: '演示商品', exact: true }).click();
    await page.getByRole('option', { name: '柔软开衫', exact: true }).click();
    await expect(panel.locator('[data-product-no]')).toHaveCount(0);
    await expect(panel.locator('[data-skc="CARDIGAN-OAT"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await panel.locator('[data-sku="CARDIGAN-OAT-M"]').click();
    await expect(demo).toContainText('弹层 SKU：CARDIGAN-OAT-M');
    await expectNoOverflow(page, panel);
  });
}


test('SKU native cards use the inherited dark palette and disabled styling', async ({ page }) => {
  await page.goto('/#/components/sku-select');
  await page.getByRole('button', { name: '深色主题', exact: true }).click();
  const panel = page.locator('[data-demo="sku-basic"] .zt-sku-select');
  const normal = panel.locator('[data-skc="TEE-SAND"]');
  const values = await normal.evaluate(el => {
    const style = getComputedStyle(el), parent = getComputedStyle(el.closest('.zt-sku-select')!);
    return { color: style.color, parentColor: parent.color, background: style.backgroundColor, parentBackground: parent.backgroundColor, font: style.fontFamily, parentFont: parent.fontFamily, border: style.borderTopWidth };
  });
  expect(values.color).toBe(values.parentColor);
  expect(values.background).toBe(values.parentBackground);
  expect(values.font).toBe(values.parentFont);
  expect(values.border).toBe('1px');
  await expect(page.locator('#example-disabled [data-skc="SHIRT-GREY"]')).toHaveCSS('opacity', '0.4');
});
