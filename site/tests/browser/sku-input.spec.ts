import { expect, test } from '@playwright/test';

test('PC SKU matrix edits, traverses and pastes quantities with live totals', async ({ page }) => {
  await page.goto('/#/components/sku-input');
  const demo = page.locator('[data-demo="sku-input-basic"]');
  const cell = (sku: string) => demo.locator(`[data-sku="${sku}"] input`);
  await expect(demo.locator('.zt-input__wrapper').first()).toHaveCSS('border-top-width', '0px');
  await expect(demo.locator('input[placeholder]')).toHaveCount(0);
  await expect(cell('TEE-023-XS')).toHaveValue('');
  await cell('TEE-023-XS').fill('3');
  await cell('TEE-023-XS').press('Tab');
  await expect(cell('TEE-023-S')).toBeFocused();
  await cell('TEE-023-S').fill('4');
  await cell('TEE-023-S').press('Enter');
  await expect(cell('TEE-023-M')).toBeFocused();
  await expect(demo.locator('[data-total]')).toHaveText('总数量 7');
  await demo.locator('.info-toggle').getByRole('switch').click();
  await expect(demo.locator('.zt-sku-input__header')).toHaveCount(0);
  await expect(cell('TEE-023-S')).toHaveValue('4');
  await expect(demo.locator('[data-total]')).toHaveText('总数量 7');
  await demo.locator('.info-toggle').getByRole('switch').click();
  await expect(demo.locator('.zt-sku-input__header')).toBeVisible();
  await cell('TEE-023-M').evaluate(el => {
    const data = new DataTransfer(); data.setData('text/plain', '1\t2\r\n3\t4\r\n');
    el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data }));
  });
  await expect(cell('TEE-000-L')).toHaveValue('4');
  await expect(demo.locator('[data-total]')).toHaveText('总数量 17');
  await cell('TEE-023-M').press('ArrowDown');
  await expect(cell('TEE-000-M')).toBeFocused();
  await demo.getByRole('button', { name: '清空数量' }).click();
  await expect(cell('TEE-000-L')).toHaveValue('');
  await expect(demo.locator('[data-total]')).toHaveText('总数量 0');
  await cell('TEE-023-S').fill('8');
  await demo.locator('.zt-sku-input').screenshot({ path: '/tmp/zt-sku-input-desktop.png' });
});

test('disabled and missing SKUs preserve their matrix positions during paste', async ({ page }) => {
  await page.goto('/#/components/sku-input#example-constraints');
  const demo = page.locator('[data-demo="sku-input-constraints"]');
  const cell = (sku: string) => demo.locator(`[data-sku="${sku}"] input`);
  await expect(cell('TEE-023-M')).toBeDisabled();
  await expect(cell('TEE-050-S')).toBeDisabled();
  await expect(demo.locator('[data-row="1"][data-col="0"] input')).toHaveCount(0);
  await cell('TEE-023-XS').evaluate(el => {
    const data = new DataTransfer(); data.setData('text/plain', '1\t2\t99\t4\n5\t6\t7\t8');
    el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data }));
  });
  await expect(cell('TEE-023-M')).toHaveValue('3');
  await expect(cell('TEE-000-S')).toHaveValue('6');
  await expect(cell('TEE-000-M')).toHaveValue('7');
  await cell('TEE-023-S').fill('99');
  await expect(cell('TEE-023-S')).toHaveValue('20');
  await demo.locator('label').filter({ hasText: '只读' }).getByRole('switch').click();
  await expect(cell('TEE-023-S')).toHaveAttribute('readonly');
});

test('PC matrix inherits global size/theme and keeps the color column fixed in its own scroll area', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/#/components/sku-input');
  const demo = page.locator('[data-demo="sku-input-basic"]');
  const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
  const background = await demo.locator('.zt-sku-input').evaluate(el => getComputedStyle(el).backgroundColor);
  await tools.getByRole('button', { name: '深色主题' }).click();
  await expect.poll(() => demo.locator('.zt-sku-input').evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(background);
  let previousHeight = 0;
  for (const size of ['mini', 'small', 'default', 'medium', 'large']) {
    await tools.getByRole('combobox', { name: '组件尺寸' }).click();
    await page.getByRole('option', { name: size, exact: true }).click();
    await expect(demo.locator('.zt-sku-input')).toHaveClass(new RegExp(`--${size}`));
    const cellHeight = () => demo.locator('[data-row="0"][data-col="0"]').evaluate(el => el.getBoundingClientRect().height);
    await expect.poll(cellHeight).toBeGreaterThan(previousHeight);
    previousHeight = await cellHeight();
  }
  const scroll = demo.locator('.zt-sku-input__scroll');
  const color = demo.locator('tbody th').first();
  const total = demo.locator('tbody .zt-sku-input__sum').first();
  const totalX = await total.evaluate(el => el.getBoundingClientRect().x);
  const x = await color.evaluate(el => el.getBoundingClientRect().x);
  await scroll.evaluate(el => { el.scrollLeft = 250; });
  expect(await scroll.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  expect(await color.evaluate(el => el.getBoundingClientRect().x)).toBeCloseTo(x, 0);
  expect(await total.evaluate(el => el.getBoundingClientRect().x)).toBeCloseTo(totalX, 0);
  const right = await total.evaluate(el => el.getBoundingClientRect().right);
  expect(right).toBeLessThanOrEqual(await scroll.evaluate(el => el.getBoundingClientRect().right));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await demo.locator('.zt-sku-input').screenshot({ path: '/tmp/zt-sku-input-dark.png' });
});
