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

test('collapse controls match the module title height at every size', async ({ page }) => {
  await page.goto('/#/components/menu');
  const sizePicker = page.getByRole('combobox', { name: '组件尺寸', exact: true });
  const menu = page.locator('#example-basic .zt-menu--vertical');
  const collapse = menu.locator('.zt-menu__collapse');
  const title = page.locator('#example-modes .zt-menu__module-title');
  const height = (locator: typeof collapse) => locator.evaluate(el => el.getBoundingClientRect().height);
  let previousHeight = 0;

  for (const size of ['mini', 'small', 'default', 'medium', 'large']) {
    await sizePicker.click();
    await page.getByRole('option', { name: size, exact: true }).click();
    await expect(menu).toHaveClass(new RegExp(`zt-menu--${size}\\b`));
    const titleHeight = await height(title);
    expect(titleHeight).toBeGreaterThan(previousHeight);
    expect(await height(collapse)).toBe(titleHeight);
    await collapse.click();
    await expect(collapse).toHaveAttribute('aria-expanded', 'false');
    expect(await height(collapse)).toBe(titleHeight);
    await collapse.click();
    previousHeight = titleHeight;
  }
});
