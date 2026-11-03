import { test, expect } from '@playwright/test';

test('InfiniteScroll density and list radius follow global appearance without breaking paging', async ({ page }) => {
  await page.goto('/#/components/infinite-scroll');
  const demo = page.locator('#example-pagination');
  const root = demo.locator('.zt-infinite-scroll');
  await expect(root.locator('li').first()).toBeVisible();
  const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
  const heights: number[] = [];
  for (const [size, font] of [['mini', '11px'], ['small', '12px'], ['default', '13px'], ['medium', '14px'], ['large', '15px']]) {
    await tools.getByRole('combobox', { name: '组件尺寸' }).click();
    await page.getByRole('option', { name: size, exact: true }).click();
    await expect(root).toHaveCSS('font-size', font);
    await expect(root.locator('li > span').first()).toHaveCSS('font-size', font);
    heights.push((await root.locator('li').first().boundingBox())!.height);
  }
  expect(heights.every((height, index) => index === 0 || height > heights[index - 1])).toBe(true);
  const radius = tools.getByRole('slider', { name: '组件圆角' });
  await radius.press('Home');
  await expect(demo.locator('.pagination-demo__viewport')).toHaveCSS('border-radius', '0px');
  await expect(root).toHaveCSS('border-radius', '0px');
  await radius.press('End');
  const maximum = (await radius.getAttribute('aria-valuemax'))!;
  await expect(demo.locator('.pagination-demo__viewport')).toHaveCSS('border-radius', `${maximum}px`);
  await expect(root).toHaveCSS('border-radius', `${maximum}px`);
  const basic = page.locator('#example-basic .infinite-basic');
  await expect(basic).toHaveCSS('border-radius', `${maximum}px`);
  // Changing density may fill a short viewport automatically; scrolling must still stop at total.
  const viewport = demo.getByRole('region', { name: '商品库存列表', exact: true });
  for (let i = 0; i < 3; i++) {
    const count = await root.locator('li').count();
    if (count === 25) break;
    await viewport.evaluate(el => { el.scrollTop = el.scrollHeight; el.dispatchEvent(new Event('scroll')); });
    await expect.poll(async () => root.locator('li').count()).toBeGreaterThan(count);
  }
  await expect(root.locator('li')).toHaveCount(25);
  await expect(root.getByRole('status')).toHaveCSS('font-size', '15px');
  const retry = page.locator('#example-retry');
  await retry.getByRole('button', { name: '请求下一页', exact: true }).click();
  await expect(retry.getByRole('alert')).toHaveCSS('font-size', '15px');
  await page.screenshot({ path: '/tmp/zt-infinite-scroll-large-radius.png' });
});
