import { expect, test } from '@playwright/test';

test.use({ hasTouch: true });

for (const width of [320, 390, 640]) {
  test(`mobile date range stays within ${width}px and selects across months`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto('/#/components/date-picker');
    const input = page.getByPlaceholder('请选择日期范围', { exact: true });
    await input.click();
    const panel = page.locator('.zt-date-picker__panel');
    await expect(panel).toHaveAttribute('aria-modal', 'true');
    await expect(panel.locator('.zt-date-picker__calendar')).toHaveCount(1);
    const bounds = await panel.boundingBox();
    expect(bounds!.x).toBe(0);
    expect(bounds!.width).toBe(width);
    expect(Math.abs(bounds!.y + bounds!.height - 740)).toBeLessThan(2);
    expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    const start = panel.locator('[data-date$="-20"]');
    const startDate = await start.getAttribute('data-date');
    await start.tap();
    await panel.getByRole('button', { name: '下个月', exact: true }).tap();
    const end = panel.locator('[data-date$="-05"]');
    const endDate = await end.getAttribute('data-date');
    await end.tap();
    await expect(input).toHaveValue('');
    await panel.getByRole('button', { name: '确定', exact: true }).tap();
    await expect(panel).toHaveCount(0);
    await expect(input).toHaveValue(`${startDate} 至 ${endDate}`);
  });
}

test('short screen keeps datetime actions visible and rotates without losing draft', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 420 });
  await page.goto('/#/components/date-time-picker');
  const input = page.getByPlaceholder('请选择日期时间范围', { exact: true });
  await input.click();
  const panel = page.locator('.zt-date-picker__panel');
  const footer = panel.locator('.zt-date-picker__footer');
  await expect(footer).toBeInViewport();
  const confirm = panel.getByRole('button', { name: '确定', exact: true });
  await expect(confirm).toBeInViewport();
  await panel.locator('[data-date$="-10"]').click();
  await panel.locator('[data-date$="-20"]').click();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(panel.locator('.zt-date-picker__calendar')).toHaveCount(2);
  await page.setViewportSize({ width: 390, height: 740 });
  await expect(panel.locator('.zt-date-picker__calendar')).toHaveCount(1);
  await expect(confirm).toBeEnabled();
  await page.screenshot({ path: 'test-results/date-picker-mobile.png' });
  await page.locator('.zt-date-picker__mask').click({ position: { x: 5, y: 5 } });
  await expect(input).toHaveValue('');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});
