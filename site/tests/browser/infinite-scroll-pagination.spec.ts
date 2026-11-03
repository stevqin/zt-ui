import { test, expect } from '@playwright/test';

async function bottom(viewport: import('@playwright/test').Locator) {
  await viewport.evaluate(el => { el.scrollTop = el.scrollHeight; el.dispatchEvent(new Event('scroll')); });
}

test('simple inventory list renders two fields and appends pages once until total is reached', async ({ page }) => {
  await page.goto('/#/components/infinite-scroll');
  const demo = page.locator('#example-pagination');
  const viewport = demo.getByRole('region', { name: '商品库存列表', exact: true });
  const items = viewport.locator('ul > li');
  await expect(items).toHaveCount(10);
  await expect(items.first().locator('span')).toHaveText('无线键盘 01');
  await expect(items.first().locator('small')).toHaveText('库存 20 件');
  await expect(demo.locator('.pagination-demo__heading')).toContainText('10 / 25');
  await expect(viewport.locator('table')).toHaveCount(0);
  await bottom(viewport);
  await expect(viewport.getByRole('status')).toHaveText('正在加载第 2 页…');
  for (let i = 0; i < 5; i++) await bottom(viewport);
  await expect(items).toHaveCount(20);
  await bottom(viewport);
  await expect(items).toHaveCount(25);
  await expect(viewport.getByRole('status')).toHaveText('全部 25 条商品已加载');
  const ids = await items.evaluateAll(nodes => nodes.map(node => node.getAttribute('data-id')));
  expect(new Set(ids).size).toBe(25);
  await bottom(viewport);
  await expect(items).toHaveCount(25);
});

test('simple inventory list fits narrow dark layouts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/#/components/infinite-scroll');
  await page.getByRole('button', { name: '深色主题', exact: true }).click();
  const demo = page.locator('#example-pagination');
  await expect(demo.locator('ul > li')).toHaveCount(10);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await demo.locator('.pagination-demo').screenshot({ path: `/tmp/zt-infinite-simple-dark-${width}.png` });
  }
});
