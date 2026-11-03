import { expect, test, type Locator } from '@playwright/test';

async function within(button: Locator, scroller: Locator) {
  const area = (await scroller.boundingBox())!;
  const control = (await button.boundingBox())!;
  expect(control.x).toBeGreaterThan(area.x);
  expect(control.x + control.width).toBeLessThan(area.x + area.width);
  expect(control.y).toBeGreaterThan(area.y);
  expect(control.y + control.height).toBeLessThan(area.y + area.height);
  expect(Math.abs(area.x + area.width - control.x - control.width - 16)).toBeLessThan(1);
  expect(Math.abs(area.y + area.height - control.y - control.height - 16)).toBeLessThan(1);
}

for (const width of [1440, 390]) {
  test(`local backtop buttons stay in their own lists and scroll independently at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/backtop');
    if (width === 390) await page.getByRole('button', { name: '深色主题', exact: true }).click();
    const demo = page.locator('#example-basic');
    const scroller = demo.locator('.scroll');
    await expect(scroller).toBeVisible();
    const button = demo.getByRole('button', { name: '返回顶部', exact: true });
    await expect(button).toHaveCount(0);
    await scroller.evaluate(el => { el.scrollTop = 100; });
    await expect(button).toHaveCount(0);
    await scroller.evaluate(el => { el.scrollTop = 400; });
    await expect(button).toBeVisible();
    await within(button, scroller);
    const before = (await button.boundingBox())!;
    await page.evaluate(() => window.scrollBy(0, 80));
    await within(button, scroller);
    expect((await button.boundingBox())!.y).toBeLessThan(before.y);
    const custom = page.locator('#example-custom');
    const customScroller = custom.locator('.scroll');
    await customScroller.evaluate(el => { el.scrollTop = 400; });
    const customButton = custom.getByRole('button', { name: '返回门店列表顶部', exact: true });
    await expect(customButton).toBeVisible();
    await within(customButton, customScroller);
    await demo.screenshot({ path: `/tmp/zt-backtop-local-${width}.png` });
    await button.click();
    await expect.poll(() => scroller.evaluate(el => el.scrollTop)).toBe(0);
    await expect(button).toHaveCount(0);
    await expect(demo.getByRole('status')).toHaveText('已返回 1 次');
    expect(await customScroller.evaluate(el => el.scrollTop)).toBe(400);
    await customButton.scrollIntoViewIfNeeded();
    const pageScroll = await page.evaluate(() => window.scrollY);
    await customButton.click();
    await expect.poll(() => customScroller.evaluate(el => el.scrollTop)).toBe(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
    await expect(customButton).toHaveCount(0);
  });
}
