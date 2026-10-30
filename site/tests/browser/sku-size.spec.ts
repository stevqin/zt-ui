import { expect, test } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`SKU size buttons inherit all five global sizes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/sku-select');
    const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
    const panel = page.locator('[data-demo="sku-basic"] .zt-sku-select');
    const button = panel.locator('[data-sku="TEE-SKY-S"]');
    const metrics = () => button.evaluate(el => {
      const style = getComputedStyle(el), rect = el.getBoundingClientRect();
      return [rect.width, rect.height, parseFloat(style.paddingTop), parseFloat(style.fontSize)];
    });
    for (const [size, buttonWidth, height, padding, font] of [
      ['mini', 48, 28, 3, 11], ['small', 60, 34, 5, 12], ['default', 72, 42, 9, 13], ['medium', 80, 46, 10, 14], ['large', 92, 52, 12, 15],
    ] as const) {
      await tools.getByRole('combobox', { name: '组件尺寸' }).click();
      await page.getByRole('option', { name: size, exact: true }).click();
      await expect(panel).toHaveClass(new RegExp(`zt-sku-select--${size}`));
      await expect.poll(metrics).toEqual([buttonWidth, height, padding, font]);
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}
