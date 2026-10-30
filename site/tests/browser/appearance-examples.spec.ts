import { expect, test } from '@playwright/test';

test('dedicated appearance demos are absent while API and global size remain available', async ({ page }) => {
  for (const [route, component] of [['button', 'ZtButton'], ['config-provider', 'ZtConfigProvider'], ['sku-input', 'ZtSkuInput']]) {
    await page.goto(`/#/components/${route}`);
    await expect(page.getByRole('heading', { name: /五档尺寸与局部覆盖|显式尺寸对比|嵌套覆盖与属性优先级/ })).toHaveCount(0);
    await expect(page.locator(`#api-${component}-props`).getByRole('cell', { name: 'size', exact: true })).toHaveCount(1);
    const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
    await expect(tools.getByRole('combobox', { name: '组件尺寸' })).toBeVisible();
  }
  const shared = page.locator('[data-demo="sku-input-shared"]');
  await expect(shared.getByRole('combobox')).toHaveCount(0);
  const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
  await tools.getByRole('combobox', { name: '组件尺寸' }).click();
  await page.getByRole('option', { name: 'mini', exact: true }).click();
  await expect(shared.locator('.zt-sku-input')).toHaveClass(/zt-sku-input--mini/);
  await expect(shared.locator('.zt-sku-select')).toHaveClass(/zt-sku-select--mini/);
  await page.getByRole('button', { name: /搜索文档/ }).click();
  const dialog = page.getByRole('dialog', { name: '搜索文档', exact: true });
  await dialog.getByRole('combobox', { name: '搜索关键词' }).fill('显式尺寸对比');
  await expect(dialog.getByRole('option')).toHaveCount(0);
  await expect(dialog).toContainText('没有找到结果');
});
