import { test, expect } from '@playwright/test';

for (const width of [1440, 390, 320]) {
  test(`horizontal label feedback preserves control width and adapts at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/form');
    if (width < 1000) await page.getByRole('button', { name: '深色主题', exact: true }).click();
    const demo = page.locator('#example-layout');
    const form = demo.locator('.zt-form').first();
    const input = form.getByRole('textbox', { name: '姓名', exact: true });
    const initial = (await input.boundingBox())!.width;
    await demo.getByRole('button', { name: '校验横向表单', exact: true }).click();
    const feedback = form.locator('.zt-form-item__feedback-label.is-side[role="alert"]');
    await expect(feedback).toHaveCount(2);
    expect(Math.abs((await input.boundingBox())!.width - initial)).toBeLessThan(1);
    await expect(input).toHaveAttribute('aria-describedby', (await feedback.first().getAttribute('id'))!);
    await expect(form.locator('.zt-form-item__feedback-label.is-below')).toHaveCount(0);
    for (const label of ['右侧标签', '左侧标签']) {
      await demo.getByRole('radio', { name: label, exact: true }).click();
      const control = (await input.boundingBox())!;
      const message = (await feedback.first().boundingBox())!;
      if (width > 1000) {
        expect(message.x).toBeGreaterThan(control.x + control.width);
        expect(Math.abs(message.y + message.height / 2 - control.y - control.height / 2)).toBeLessThan(1);
      } else {
        expect(message.y + message.height).toBeLessThan(control.y);
      }
    }
    // Wrapped server/localization text remains inside its own column and preserves control width.
    const beforeLong = (await input.boundingBox())!.width;
    await feedback.first().locator('span').evaluate(el => { el.textContent = '请核对姓名，需与组织通讯录中的完整姓名一致。'.repeat(4); });
    await expect.poll(async () => (await feedback.first().boundingBox())!.height).toBeGreaterThan(30);
    expect(Math.abs((await input.boundingBox())!.width - beforeLong)).toBeLessThan(1);
    expect(await form.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    const next = (await form.locator('.zt-form-item').nth(1).boundingBox())!;
    const message = (await feedback.first().boundingBox())!;
    expect(message.y + message.height).toBeLessThan(next.y);
    await demo.screenshot({ path: `/tmp/zt-form-side-long-${width}.png` });
    await demo.getByRole('radio', { name: '顶部标签', exact: true }).click();
    await expect(form.locator('.zt-form-item__heading .zt-form-item__feedback-label')).toHaveCount(2);
    await demo.getByRole('button', { name: '重置', exact: true }).click();
    await expect(form.locator('[role="alert"]')).toHaveCount(0);
  });
}

test('horizontal feedback responds to container width independently of the viewport', async ({ page }) => {
  await page.goto('/#/components/form');
  const demo = page.locator('#example-layout');
  const form = demo.locator('.zt-form').first();
  await demo.getByRole('button', { name: '校验横向表单', exact: true }).click();
  const item = form.locator('.zt-form-item').first();
  await expect(item).not.toHaveClass(/is-feedback-stacked/);
  await form.evaluate(el => { (el as HTMLElement).style.width = '340px'; });
  await expect(item).toHaveClass(/is-feedback-stacked/);
  const control = (await item.locator('input').boundingBox())!;
  const error = (await item.locator('[role="alert"]').boundingBox())!;
  expect(error.y + error.height).toBeLessThan(control.y);
  await form.evaluate(el => { (el as HTMLElement).style.width = ''; });
  await expect(item).not.toHaveClass(/is-feedback-stacked/);
});
