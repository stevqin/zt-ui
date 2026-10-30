import { expect, test } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`focus ring policy applies to controls and teleported layers at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/config-provider#example-focusring');
    const demo = page.locator('#example-focusring');
    const input = demo.getByRole('textbox', { name: '焦点环示例输入', exact: true });
    const button = demo.getByRole('button', { name: '示例按钮', exact: true });
    const ring = (selector: string) => page.locator(selector).evaluate(el => getComputedStyle(el).outlineStyle);
    const glow = () => input.locator('..').evaluate(el => getComputedStyle(el).boxShadow);
    await input.click();
    await expect(input).toBeFocused();
    expect(await glow()).not.toMatch(/0px 0px 0px [23]px/);
    await input.press('Tab');
    await expect(button).toBeFocused();
    expect(await button.evaluate(el => getComputedStyle(el).outlineWidth)).toBe('0px');

    await demo.getByRole('button', { name: '仅键盘（keyboard）', exact: true }).click();
    await input.click();
    expect(await input.evaluate(el => el.matches(':focus-visible'))).toBe(true);
    expect(await glow()).not.toMatch(/0px 0px 0px [23]px/);
    await input.press('Tab');
    expect(await button.evaluate(el => getComputedStyle(el).outlineWidth)).toBe('2px');
    await button.click();
    expect(await button.evaluate(el => getComputedStyle(el).outlineWidth)).toBe('0px');

    await demo.getByRole('button', { name: '所有聚焦（all）', exact: true }).click();
    // Embedded Vue content must keep its own surfaces inside a service overlay.
    await demo.locator('.focus-demo__scope').evaluate(scope => {
      const host = document.createElement('div');
      host.className = 'zt-overlay focus-service-host';
      host.style.display = 'contents';
      scope.parentElement!.insertBefore(host, scope);
      host.append(scope);
    });
    await input.click();
    expect(await glow()).toMatch(/0px 0px 0px 3px/);
    expect(await input.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('none');
    await button.click();
    expect(await button.evaluate(el => getComputedStyle(el).outlineWidth)).toBe('2px');
    await demo.getByRole('button', { name: '嵌套关闭', exact: true }).click();
    expect(await demo.getByRole('button', { name: '嵌套关闭', exact: true }).evaluate(el => getComputedStyle(el).outlineWidth)).toBe('0px');

    const nested = demo.getByRole('button', { name: '嵌套关闭', exact: true });
    await nested.press('Shift+Tab');
    await demo.getByRole('button', { name: '打开焦点环弹窗', exact: true }).press('Tab');
    await expect(nested).toBeFocused();
    expect(await nested.evaluate(el => getComputedStyle(el).outlineWidth)).toBe('0px');

    await demo.locator('.zt-select__control').click();
    const search = page.locator('.zt-select__dropdown input');
    if (await search.count()) await search.first().press('ArrowDown');
    else await demo.locator('.zt-select__control').press('ArrowDown');
    await expect(page.getByRole('option', { name: '草稿', exact: true })).toBeVisible();
    expect(await page.locator('.zt-select__dropdown').evaluate(el => getComputedStyle(el).getPropertyValue('--zt-focus-ring-width').trim())).toBe('2px');
    await page.keyboard.press('Escape');
    await demo.getByRole('button', { name: '打开焦点环弹窗', exact: true }).click();
    const dialog = page.getByRole('dialog');
    const modalInput = dialog.getByRole('textbox', { name: '弹窗内输入', exact: true });
    await modalInput.click();
    expect(await modalInput.locator('..').evaluate(el => getComputedStyle(el).boxShadow)).toMatch(/0px 0px 0px 3px/);
    expect(await ring('.zt-modal')).toBe('none');
    await dialog.getByRole('button', { name: '关闭焦点环弹窗', exact: true }).click();

    await demo.getByRole('button', { name: '仅键盘（keyboard）', exact: true }).click();
    await demo.getByRole('button', { name: '打开焦点环弹窗', exact: true }).click();
    await modalInput.click();
    expect(await modalInput.locator('..').evaluate(el => getComputedStyle(el).boxShadow)).not.toMatch(/0px 0px 0px [23]px/);
    await modalInput.press('Tab');
    expect(await dialog.locator(':focus').evaluate(el => getComputedStyle(el).outlineWidth)).toBe('2px');
    await dialog.getByRole('button', { name: '关闭焦点环弹窗', exact: true }).click();

    await demo.getByRole('button', { name: '关闭（none）', exact: true }).click();
    await demo.getByRole('button', { name: '打开焦点环弹窗', exact: true }).click();
    await modalInput.click();
    await modalInput.press('Tab');
    expect(await dialog.locator(':focus').evaluate(el => getComputedStyle(el).outlineWidth)).toBe('0px');
    expect(await modalInput.locator('..').evaluate(el => getComputedStyle(el).boxShadow)).not.toMatch(/0px 0px 0px [23]px/);
  });
}

test('default policy also suppresses focus rings in independent zt-alert services', async ({ page }) => {
  await page.goto('/#/components/zt-alert-message-box');
  await page.locator('#example-basic').getByRole('button', { name: '输入名称', exact: true }).click();
  const input = page.locator('.zt-box__input');
  await input.click();
  await expect(input).toBeFocused();
  await expect.poll(() => input.evaluate(el => getComputedStyle(el).boxShadow)).not.toMatch(/0px 0px 0px 3px/);
  await input.press('Tab');
  expect(await page.locator('.zt-box :focus').evaluate(el => getComputedStyle(el).outlineWidth)).toBe('0px');
});
