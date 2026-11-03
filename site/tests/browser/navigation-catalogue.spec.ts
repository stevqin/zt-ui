import { test, expect } from '@playwright/test';

test('catalogue groups toggle with keyboard and reopen for the destination route', async ({ page }) => {
  await page.goto('/#/components/button');
  const nav = page.getByRole('complementary', { name: '文档导航', exact: true });
  const form = nav.getByRole('button', { name: '表单组件', exact: true });
  await expect(nav.locator('.nav-group-toggle[aria-expanded="false"]')).toHaveCount(0);
  await form.focus();
  await page.keyboard.press('Enter');
  await expect(form).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(form).toHaveAttribute('aria-expanded', 'true');
  const target = nav.getByRole('link', { name: 'Form 表单', exact: true });
  await target.scrollIntoViewIfNeeded();
  await expect(target.locator('small')).toHaveText('表单');
  await target.click();
  await expect(target).toHaveAttribute('aria-current', 'page');
  const heading = nav.locator('.sidebar-group.is-current .nav-group');
  await expect(heading).toBeVisible();
  expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual((await nav.boundingBox())!.y - 1);
  await form.click();
  await expect(target).not.toBeVisible();
  await page.evaluate(() => { location.hash = '/components/input'; });
  await expect(form).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'Input 输入框', exact: true })).toHaveAttribute('aria-current', 'page');
  await nav.evaluate(el => { el.scrollTop = 0; });
  await nav.screenshot({ path: '/tmp/zt-refined-catalogue-light.png' });
});

test('mobile catalogue groups are accessible and close after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/components/button');
  await page.getByRole('button', { name: '深色主题', exact: true }).click();
  await page.getByRole('button', { name: '打开文档导航', exact: true }).click();
  const nav = page.locator('.mobile-navigation');
  await expect(nav.locator('.nav-group-toggle[aria-expanded="false"]')).toHaveCount(0);
  const target = nav.getByRole('link', { name: 'Form 表单', exact: true });
  await target.scrollIntoViewIfNeeded();
  await expect(target).toBeVisible();
  expect(await nav.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/zt-refined-catalogue-mobile-dark.png' });
  await target.click();
  await expect(nav).not.toBeVisible();
  await expect(page).toHaveURL(/components\/form$/);
});
