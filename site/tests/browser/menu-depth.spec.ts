import { expect, test } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`four-level menu navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/menu#example-modes');
    const demo = page.locator('#example-modes');
    const dual = demo.locator('.zt-menu--double');
    await expect(dual.locator('[data-menu-key="retail"]')).toHaveAttribute('aria-current', 'page');
    await dual.locator('[data-menu-key="online"]').click();
    await expect(demo).toContainText('双栏选择：工作台 / 经营分析 / 销售分析 / 线上销售');
    await expect(demo).toContainText('横向选择：工作台 / 经营概览');
    await dual.locator('[data-category="goods"]').click();
    await dual.locator('[data-menu-key="inventory"]').click();
    await dual.locator('[data-menu-key="stock-movement"]').click();
    await dual.locator('[data-menu-key="stock-out"]').click();
    await expect(demo).toContainText('双栏选择：商品管理 / 库存管理 / 库存流水 / 出库记录');

    await demo.locator('[data-horizontal-key="work"]').click();
    await page.locator('[data-horizontal-key="analytics"]').click();
    await page.locator('[data-horizontal-key="sales"]').click();
    await expect(page.locator('[data-horizontal-key="wholesale"]')).toHaveAttribute('aria-disabled', 'true');
    await page.locator('[data-horizontal-key="retail"]').click();
    await expect(demo).toContainText('横向选择：工作台 / 经营分析 / 销售分析 / 门店销售');
    await expect(page.locator('.zt-menu__horizontal-popup')).toHaveCount(0);
    await expect(demo).toContainText('双栏选择：商品管理 / 库存管理 / 库存流水 / 出库记录');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
