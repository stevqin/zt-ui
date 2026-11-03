import { test, expect } from '@playwright/test';

test('form alternatives preserve field width, focus errors and keep popovers anchored', async ({ page }) => {
  await page.goto('/#/components/form');
  const demo = page.locator('#example-feedback');
  const form = demo.locator('.zt-form');
  const name = form.getByRole('textbox', { name: '联系人', exact: true });
  await expect(name).toBeVisible();
  await demo.getByRole('radio', { name: '汇总', exact: true }).click();
  const initial = (await name.boundingBox())!.width;
  await demo.getByRole('button', { name: '校验并保存', exact: true }).click();
  await expect(form.locator('.zt-form__summary-field')).toHaveCount(3);
  await expect(name).toBeFocused();
  expect(Math.abs((await name.boundingBox())!.width - initial)).toBeLessThan(1);
  await expect(name.locator('xpath=..')).toHaveCSS('border-color', 'rgb(239, 68, 68)');
  await expect(form.locator('.zt-form-item__error-indicator')).toHaveCount(0);
  const popup = page.locator('.zt-form-item__error.is-popover.is-visible');
  await expect(popup).toHaveCount(1);
  await expect(popup).toHaveText('请填写联系人姓名');
  await form.locator('.zt-form__summary-field').filter({ hasText: '所属部门' }).click();
  await expect(form.getByRole('combobox', { name: '所属部门', exact: true })).toBeFocused();
  await page.mouse.move(0, 0);
  await expect(popup).toHaveText('请选择所属部门');
  await demo.screenshot({ path: '/tmp/zt-form-summary-light.png' });
  await demo.getByRole('radio', { name: '浮层', exact: true }).click();
  await expect(form.locator('.zt-form__summary')).toHaveCount(0);
  await name.focus();
  await expect(popup).toHaveText('请填写联系人姓名');
  const bounds = await popup.boundingBox(), anchor = await name.boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(anchor!.y);
  const label = await form.locator('.zt-form-item__label').first().boundingBox();
  expect(bounds!.x).toBeGreaterThan(label!.x + label!.width);
  await name.press('Escape');
  await expect(popup).toHaveCount(0);
  await demo.getByRole('radio', { name: '下方', exact: true }).click();
  await expect(form.locator('.zt-form-item__feedback-inline')).toHaveCount(3);
  await expect(form.locator('.zt-form-item__error-indicator')).toHaveCount(0);
  await demo.screenshot({ path: '/tmp/zt-form-inline-light.png' });
  await demo.getByRole('radio', { name: '标签旁', exact: true }).click();
  await expect(form.locator('.zt-form-item__feedback-label')).toHaveCount(3);
  await expect(form.locator('.zt-form-item__error-indicator')).toHaveCount(0);
  await demo.getByRole('radio', { name: '汇总', exact: true }).click();
  await name.fill('陈晨');
  await name.press('Tab');
  await expect(form.locator('.zt-form__summary-field')).toHaveCount(2);
  await demo.getByRole('button', { name: '重置', exact: true }).click();
  await expect(form.locator('.zt-form__summary')).toHaveCount(0);
});

for (const width of [390, 320]) {
  test(`form messages fit ${width}px dark/mobile and escape filtered stacking contexts`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/components/form');
    await page.getByRole('button', { name: '深色主题', exact: true }).click();
    const demo = page.locator('#example-feedback');
    await demo.getByRole('radio', { name: '汇总', exact: true }).click();
    await demo.getByRole('button', { name: '校验并保存', exact: true }).click();
    await expect(demo.locator('.zt-form__summary-field')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await demo.screenshot({ path: `/tmp/zt-form-summary-dark-${width}.png` });
    await demo.getByRole('radio', { name: '浮层', exact: true }).click();
    await demo.locator('.feedback-demo__panel').evaluate(el => { (el as HTMLElement).style.cssText += ';position:relative;z-index:6000;filter:blur(0px)'; });
    const input = demo.getByRole('textbox', { name: '联系人', exact: true });
    await input.focus();
    const popup = page.locator('.zt-form-item__error.is-popover.is-visible');
    await expect(popup).toBeVisible();
    expect(await popup.evaluate(el => Number(getComputedStyle(el).zIndex))).toBeGreaterThan(6000);
    const box = (await popup.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `/tmp/zt-form-popover-dark-${width}.png` });
    // Floating server error text must never move the next field.
    const nextLabel = demo.locator('.zt-form-item__label').nth(1);
    const nextY = (await nextLabel.boundingBox())!.y;
    const formHeight = (await demo.locator('.zt-form').boundingBox())!.height;
    await popup.evaluate(el => { el.textContent = '联系人信息与业务系统记录不一致，请核对完整姓名以及所属业务组织后重新提交。'.repeat(3); });
    await expect(popup).toHaveClass(/is-bottom/);
    expect(Math.abs((await nextLabel.boundingBox())!.y - nextY)).toBeLessThan(1);
    expect(Math.abs((await demo.locator('.zt-form').boundingBox())!.height - formHeight)).toBeLessThan(1);
    const longBox = (await popup.boundingBox())!;
    expect(longBox.y).toBeGreaterThan((await input.boundingBox())!.y);
    expect(longBox.x + longBox.width).toBeLessThanOrEqual(width);

  });
}

test('floating feedback never shifts fields on hover and tracks summary height changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1800 });
  await page.goto('/#/components/form');
  const demo = page.locator('#example-feedback');
  const form = demo.locator('.zt-form');
  const name = form.getByRole('textbox', { name: '联系人', exact: true });
  const email = form.getByRole('textbox', { name: '联系邮箱', exact: true });
  await demo.getByRole('radio', { name: '汇总', exact: true }).click();
  await demo.getByRole('button', { name: '校验并保存', exact: true }).click();
  await demo.getByRole('radio', { name: '浮层', exact: true }).click();
  // Emulate wide label slots so both fields use the bottom placement branch.
  await form.locator('.zt-form-item__label-text').evaluateAll(labels => {
    labels.forEach(label => { (label as HTMLElement).style.width = '800px'; });
  });
  await email.focus();
  const emailPopup = page.locator('.zt-form-item__error.is-popover.is-visible').filter({ hasText: '请填写联系邮箱' });
  const assertAnchoredBelow = async () => {
    await expect.poll(async () => {
      const popup = (await emailPopup.boundingBox())!;
      const control = (await email.locator('xpath=../..').boundingBox())!;
      return Math.abs(popup.y - control.y - control.height - 7);
    }).toBeLessThanOrEqual(1);
  };
  await assertAnchoredBelow();
  const initialEmailY = (await email.boundingBox())!.y;
  await name.hover();
  await expect(page.locator('.zt-form-item__error.is-popover.is-visible')).toHaveCount(2);
  expect(Math.abs((await email.boundingBox())!.y - initialEmailY)).toBeLessThan(1);
  const frames = await email.evaluate(async el => {
    const positions: number[] = [];
    for (let i = 0; i < 12; i++) { await new Promise(requestAnimationFrame); positions.push(el.getBoundingClientRect().y); }
    return positions;
  });
  expect(Math.max(...frames) - Math.min(...frames)).toBeLessThan(1);
  await expect(email).toBeFocused();
  await assertAnchoredBelow();
  // Repeated hover/leave must preserve the form geometry and scroll position.
  await demo.locator('.feedback-demo__panel header strong').hover();
  await expect(page.locator('.zt-form-item__error.is-popover.is-visible')).toHaveCount(1);
  await expect.poll(async () => Math.abs((await email.boundingBox())!.y - initialEmailY)).toBeLessThanOrEqual(1);
  await assertAnchoredBelow();

  await demo.getByRole('radio', { name: '汇总', exact: true }).click();
  await email.focus();
  await expect(form.locator('.zt-form__summary-field')).toHaveCount(3);
  await assertAnchoredBelow();
  const beforeSummaryShrinkY = (await email.boundingBox())!.y;
  // Validate a separate field without changing focus on the anchored control.
  await name.evaluate(input => {
    (input as HTMLInputElement).value = '陈晨';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(form.locator('.zt-form__summary-field')).toHaveCount(2);
  await expect(email).toBeFocused();
  await expect.poll(async () => beforeSummaryShrinkY - (await email.boundingBox())!.y).toBeGreaterThan(10);
  await assertAnchoredBelow();
});

for (const width of [1440, 390, 320]) {
  test(`label feedback stays readable without a floating layer at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/form');
    if (width < 1000) await page.getByRole('button', { name: '深色主题', exact: true }).click();
    const demo = page.locator('#example-feedback');
    const name = demo.getByRole('textbox', { name: '联系人', exact: true });
    const controlWidth = (await name.boundingBox())!.width;
    await demo.getByRole('button', { name: '校验并保存', exact: true }).click();
    await expect(demo.locator('.zt-form-item__feedback-label')).toHaveCount(3);
    await expect(page.locator('.zt-form-item__error.is-visible')).toHaveCount(0);
    await expect(demo.locator('.zt-form__summary')).toHaveCount(0);
    await expect(name).toBeFocused();
    expect(Math.abs((await name.boundingBox())!.width - controlWidth)).toBeLessThan(1);
    const heading = demo.locator('.zt-form-item__heading').first();
    const error = heading.locator('.zt-form-item__feedback-label');
    await expect(name).toHaveAttribute('aria-describedby', (await error.getAttribute('id'))!);
    await error.locator('span').evaluate(el => { el.textContent = '请核对联系人信息，输入的姓名需与组织通讯录一致。'.repeat(3); });
    const geometry = await heading.evaluate(el => {
      const label = el.querySelector('label')!.getBoundingClientRect();
      const message = el.querySelector('.zt-form-item__feedback-label')!.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      return { overlap: message.left < label.right && message.top < label.bottom && message.bottom > label.top, bottom: box.bottom, messageBottom: message.bottom, scroll: el.scrollWidth, width: el.clientWidth };
    });
    expect(geometry.overlap).toBe(false);
    expect(geometry.messageBottom).toBeLessThanOrEqual(geometry.bottom + 1);
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width);
    expect(geometry.bottom).toBeLessThan((await name.boundingBox())!.y);
    await name.fill('示例联系人');
    await name.press('Tab');
    await expect(heading.locator('.zt-form-item__feedback-label')).toHaveCount(0);
    await demo.screenshot({ path: `/tmp/zt-refined-form-${width}.png` });
  });
}
