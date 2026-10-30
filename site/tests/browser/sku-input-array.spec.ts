import { expect, test } from '@playwright/test';

test('array mode echoes values, edits and pastes one ordered array, and clears to []', async ({ page }) => {
  await page.goto('/#/components/sku-input#example-array');
  const demo = page.locator('[data-demo="sku-input-array"]');
  const field = (sku: string) => demo.locator(`[data-sku="${sku}"] input`);
  const values = () => demo.locator('pre').evaluate(el => JSON.parse(el.textContent || '[]'));
  await expect(field('TEE-023-S')).toHaveValue('2');
  await field('TEE-023-XS').fill('3');
  await expect.poll(values).toEqual([{ sku: 'TEE-023-XS', quantity: 3 }, { sku: 'TEE-023-S', quantity: 2 }]);
  await field('TEE-023-XS').evaluate(el => {
    const clipboardData = new DataTransfer(); clipboardData.setData('text/plain', '1\t4\n2\t3');
    el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }));
  });
  await expect.poll(values).toEqual([{ sku: 'TEE-023-XS', quantity: 1 }, { sku: 'TEE-023-S', quantity: 4 }, { sku: 'TEE-000-XS', quantity: 2 }, { sku: 'TEE-000-S', quantity: 3 }]);
  await expect(demo.locator('[data-total]')).toHaveText('总数量 10');
  await demo.getByRole('button', { name: '清空数量' }).click();
  await expect.poll(values).toEqual([]);
  await expect(demo.locator('[data-total]')).toHaveText('总数量 0');
});

test('product contracts expose field tables and copied examples contain complete data', async ({ page }) => {
  await page.goto('/#/components/sku-input#api');
  await expect(page.locator('#api table table')).toHaveCount(0);
  await expect(page.locator('#api-ZtSkuInput-data-structures').getByRole('heading', { name: '数据结构', exact: true })).toBeVisible();
  for (const [name, fields] of [
    ['ZtSkuProduct', ['product_no', 'spu', 'product_name', 'skcs']],
    ['ZtSkuColor', ['skc', 'color_code', 'color_name', 'image_url', 'skus', 'disabled']],
    ['ZtSkuOption', ['sku', 'size_code', 'size_name', 'disabled']],
    ['ZtSkuQuantityValue', ['sku', 'quantity']],
  ] as const) {
    const table = page.getByRole('table', { name: `${name} 字段`, exact: true });
    await expect(table).toBeVisible();
    for (const field of fields) await expect(table.getByRole('cell', { name: field, exact: true })).toHaveCount(1);
  }
  await expect(page.getByRole('table', { name: 'ZtSkuProduct 字段', exact: true })).toContainText('至少提供一项');
  await page.locator('#api-ZtSkuInput-data-structures').screenshot({ path: '/tmp/zt-sku-flat-data-structures.png' });
  const example = page.locator('#example-basic');
  await example.getByRole('button', { name: '展开代码', exact: true }).click();
  const code = example.locator('pre code');
  await expect(code).toContainText('product_no:');
  await expect(code).toContainText('skcs:');
  await expect(code).toContainText('skus:');
  await expect(code).toContainText("sku: 'TEE-023-S'");
  await expect(code).not.toContainText("from './data'");
  await page.screenshot({ path: '/tmp/zt-sku-input-data-contracts.png', fullPage: false });
});
