import { expect, test } from '@playwright/test';

for (const [width, height] of [[2560, 900], [1440, 900], [1199, 900], [1024, 900], [390, 900], [1440, 480], [390, 640]]) {
  test(`documentation uses available area at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/#/components/form');
    const layout = page.locator('.documentation-layout');
    const metrics = await layout.evaluate(el => {
      const main = el.querySelector('main')!;
      const article = main.querySelector('.doc-article')!;
      return { width: el.getBoundingClientRect().width, columns: getComputedStyle(el).gridTemplateColumns.split(' '), main: main.getBoundingClientRect().width, article: article.getBoundingClientRect().width, padding: parseFloat(getComputedStyle(main).paddingLeft) + parseFloat(getComputedStyle(main).paddingRight), sidebarHeight: el.querySelector('.sidebar')?.getBoundingClientRect().height, overflow: document.documentElement.scrollWidth > window.innerWidth };
    });
    expect(metrics.width).toBeCloseTo(width, 0);
    expect(metrics.overflow).toBe(false);
    expect(metrics.article).toBeCloseTo(metrics.main - metrics.padding, 0);
    if (width >= 960) expect(metrics.sidebarHeight).toBeCloseTo(height - 64, 0);
    if (width >= 1200) {
      expect(metrics.columns).toHaveLength(3);
      expect(metrics.columns[0]).toBe('264px');
      expect(metrics.columns[2]).toBe('184px');
      await expect(page.locator('.page-outline')).toBeVisible();
    } else {
      await expect(page.locator('.page-outline')).toBeHidden();
      if (width >= 960) expect(metrics.columns).toHaveLength(2);
    }
  });
}

for (const [width, height] of [[1440, 900], [390, 640]]) test(`search modal keyboard and focus restoration at ${width}×${height}`, async ({ page }) => {
  await page.setViewportSize({ width, height });
  await page.goto('/#/components/form');
  const trigger = page.getByRole('button', { name: /搜索文档/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '搜索文档', exact: true });
  await expect(page.locator('.zt-modal .docs-search-modal')).toBeVisible();
  const query = dialog.getByRole('combobox', { name: '搜索关键词' });
  await expect(query).toBeFocused();
  await query.fill('SkuSelect');
  await expect(dialog.getByRole('option').first()).toContainText('SkuSelect');
  await query.press('ArrowDown');
  await query.press('ArrowUp');
  await query.press('Enter');
  await expect(page).toHaveURL(/sku-select/);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('.zt-modal').click({ position: { x: 3, y: 3 } });
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await query.press('Escape');
  await expect(dialog).toBeHidden();
});
