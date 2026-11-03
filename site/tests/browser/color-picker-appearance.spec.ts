import { expect, test } from '@playwright/test';

test('popup owns one border while the standalone color panel retains its surface', async ({ page }) => {
  await page.goto('/#/components/color-picker');
  await page.locator('#example-basic').getByRole('button', { name: '选择颜色', exact: true }).click();
  const popup = page.getByRole('dialog').filter({ has: page.locator('.zt-color-panel') });
  const panel = popup.locator('.zt-color-panel');
  await expect(panel).toBeVisible();
  await popup.screenshot({ path: '/tmp/zt-color-picker-before.png' });
  await expect(popup).toHaveCSS('border-top-width', '1px');
  await expect(panel).toHaveCSS('border-top-width', '0px');
  await expect(popup).toHaveCSS('padding-top', '0px');
  await popup.screenshot({ path: '/tmp/zt-color-picker-single-border.png' });
  await page.goto('/#/components/color-picker-panel');
  await expect(page.locator('#example-basic .zt-color-panel')).toHaveCSS('border-top-width', '1px');
});


for (const width of [1440, 320]) {
  test(`underline inherits Form, preserves explicit false and commits colors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/color-picker');
    if (width === 320) await page.getByRole('button', { name: '深色主题', exact: true }).click();
    const demo = page.locator('#example-underline');
    const controls = demo.locator('.zt-color-picker');
    await expect(controls).toHaveCount(3);
    const direct = controls.nth(0).getByRole('button', { name: '选择颜色', exact: true });
    for (const i of [0, 1]) {
      await expect(controls.nth(i)).toHaveClass(/is-form-underline/);
      const trigger = controls.nth(i).getByRole('button');
      await expect(trigger).toHaveCSS('border-top-width', '0px');
      await expect(trigger).toHaveCSS('border-right-width', '0px');
      await expect(trigger).toHaveCSS('border-bottom-width', '1px');
      await expect(trigger).toHaveCSS('border-radius', '0px');
    }
    await expect(controls.nth(2)).not.toHaveClass(/is-form-underline/);
    await expect(controls.nth(2).getByRole('button')).toHaveCSS('border-top-width', '1px');
    const before = (await direct.boundingBox())!;
    await direct.click();
    const popup = page.getByRole('dialog').filter({ has: page.locator('.zt-color-panel') });
    await expect(popup.locator('.zt-color-panel')).toHaveCSS('border-top-width', '0px');
    await expect(popup.locator('.is-form-underline')).toHaveCount(0);
    await expect(popup.getByRole('textbox', { name: 'HEX RGB HSL 颜色', exact: true })).toHaveCSS('border-top-width', '1px');
    expect((await direct.boundingBox())!.height).toBe(before.height);
    const popupBox = (await popup.boundingBox())!;
    expect(popupBox.x).toBeGreaterThanOrEqual(0);
    expect(popupBox.x + popupBox.width).toBeLessThanOrEqual(width);
    await popup.getByRole('textbox', { name: 'HEX RGB HSL 颜色', exact: true }).fill('#00ff00');
    await popup.getByRole('button', { name: '确定', exact: true }).click();
    await expect(direct).toContainText('#00ff00');
    await expect(direct).toBeFocused();
    await expect(demo).toContainText('颜色：#00ff00');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await demo.screenshot({ path: `/tmp/zt-color-picker-underline-${width}.png` });
  });
}

for (const [route, width] of [['color-picker', 1440], ['color-picker-panel', 320]] as const) {
  test(`${route} shows the complete hue spectrum before interacting with its sliders`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`/#/components/${route}`);
    if (width === 320) await page.getByRole('button', { name: '深色主题', exact: true }).click();
    const demo = page.locator('#example-alpha');
    if (route === 'color-picker') await demo.getByRole('button', { name: '选择颜色', exact: true }).click();
    const panel = route === 'color-picker' ? page.getByRole('dialog').locator('.zt-color-panel') : demo.locator('.zt-color-panel');
    const hue = panel.getByRole('slider', { name: '色相', exact: true });
    await expect(hue).toBeVisible();
    await expect(hue).toHaveCSS('background-image', /linear-gradient/);
    const initial = Number(await hue.inputValue());
    expect(initial).toBeGreaterThan(200); expect(initial).toBeLessThan(230);
    const alpha = panel.getByRole('slider', { name: '透明度', exact: true });
    await expect(alpha).toHaveCSS('background-image', /conic-gradient/);
    expect(Number(await alpha.inputValue())).toBeCloseTo(.5, 1);
    await panel.screenshot({ path: `/tmp/zt-${route}-initial-spectrum.png` });
    await hue.focus(); await hue.press('Home');
    await expect(hue).toHaveValue('0');
    await expect(panel.locator('.zt-color-panel__palette')).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    await hue.press('End');
    await expect(hue).toHaveValue('359');
    await alpha.focus(); await alpha.press('Home');
    await expect(alpha).toHaveValue('0');
    const text = panel.getByRole('textbox', { name: 'HEX RGB HSL 颜色', exact: true });
    await expect(text).toHaveValue(/00$/);
    await panel.getByRole('button', { name: '确定', exact: true }).click();
    await expect(demo).toContainText(/含透明度的 HEX：#[0-9a-f]{6}00/);
  });
}
