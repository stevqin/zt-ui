import { test, expect } from '@playwright/test';

test('icon controls remain below the header while scrolling through the gallery', async ({ page }) => {
  await page.goto('/#/components/icon');
  const gallery = page.locator('#example-gallery');
  const tools = gallery.getByRole('group', { name: '图标检索与动效' });
  await expect(tools).toBeVisible();
  const icon = gallery.locator('[data-icon="camera"]');
  await icon.scrollIntoViewIfNeeded();
  const header = (await page.locator('.site-header').boundingBox())!;
  const box = (await tools.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(header.y + header.height);
  expect(box.y).toBeLessThan(header.height + 28);
  await tools.getByRole('textbox', { name: '搜索图标' }).fill('chart');
  await expect(gallery.locator('[data-icon]')).toHaveCount(17);
  await expect(tools).toBeInViewport();
});

test('icon tips copy the name or configured component, support keyboard and recover from clipboard failure', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#/components/icon');
  const gallery = page.locator('#example-gallery');
  const icon = gallery.locator('[data-icon="warehouse"]');
  await icon.click();
  const popup = page.locator('.zt-popover').filter({ has: page.locator('.icon-copy') });
  await expect(popup).toBeVisible();
  await expect(popup).toHaveAccessibleName('warehouse 图标复制');
  await popup.getByRole('button', { name: '复制图标名', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('warehouse');
  await expect(popup.getByRole('status')).toHaveText('已复制图标名');
  await page.keyboard.press('Escape');
  await expect(popup).toHaveCount(0);
  await expect(icon).toBeFocused();
  await gallery.getByRole('combobox', { name: '图标动效', exact: true }).click();
  await page.getByRole('option', { name: '呼吸', exact: true }).click();
  await icon.focus();
  await page.keyboard.press('Enter');
  await expect(popup.getByRole('button', { name: '复制图标名', exact: true })).toBeFocused();
  await popup.getByRole('button', { name: '复制组件', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('<ZtIcon name="warehouse" animation="pulse" animation-trigger="hover" />');
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: () => Promise.reject(new Error('denied')) });
    document.execCommand = () => false;
  });
  await popup.getByRole('button', { name: '复制组件', exact: true }).click();
  await expect(popup.getByRole('status')).toHaveText('复制失败，请选择上方代码手动复制');
  await gallery.getByRole('textbox', { name: '搜索图标' }).fill('no-matching-glyph');
  await expect(popup).toHaveCount(0);
  await expect(gallery.locator('[data-icon]')).toHaveCount(0);
  await expect(gallery.getByRole('status')).toContainText('没有匹配的图标');
});

test('all icons belong to one category and category/search filters compose', async ({ page }) => {
  await page.goto('/#/components/icon');
  const gallery = page.locator('#example-gallery');
  await expect(gallery.locator('[data-category]')).toHaveCount(12);
  const names = await gallery.locator('[data-icon]').evaluateAll(tiles => tiles.map(tile => (tile as HTMLElement).dataset.icon));
  expect(names).toHaveLength(309);
  expect(new Set(names).size).toBe(309);
  await gallery.getByRole('combobox', { name: '图标分类', exact: true }).click();
  await page.getByRole('option', { name: '服装设计', exact: true }).click();
  await expect(gallery.locator('[data-icon]')).toHaveCount(24);
  await gallery.getByRole('textbox', { name: '搜索图标' }).fill('shirt');
  await expect(gallery.locator('[data-icon]')).toHaveCount(1);
  await gallery.getByRole('textbox', { name: '搜索图标' }).fill('');
  await gallery.getByRole('combobox', { name: '图标分类', exact: true }).click();
  await page.getByRole('option', { name: '全部分类', exact: true }).click();
  await gallery.getByRole('textbox', { name: '搜索图标' }).fill('库存');
  await expect(gallery.locator('[data-icon]')).toHaveCount(25);
  await gallery.getByRole('textbox', { name: '搜索图标' }).fill('');
  await gallery.locator('[data-icon="warehouse"]').click();
  await page.screenshot({ path: '/tmp/zt-icon-gallery-copy-light.png' });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '深色主题', exact: true }).click();
  await gallery.locator('[data-icon="warehouse"]').click();
  await page.screenshot({ path: '/tmp/zt-icon-gallery-copy-dark.png' });
});

for (const width of [390, 320]) {
  test(`floating gallery tools and copy tips fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/components/icon');
    const gallery = page.locator('#example-gallery');
    const tools = gallery.getByRole('group', { name: '图标检索与动效' });
    await gallery.locator('[data-icon="warehouse"]').scrollIntoViewIfNeeded();
    await expect(tools).toBeInViewport();
    const header = (await page.locator('.site-header').boundingBox())!;
    const rect = (await tools.boundingBox())!;
    expect(rect.y).toBeGreaterThanOrEqual(header.y + header.height);
    expect(rect.y).toBeLessThan(header.height + 28);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await gallery.locator('[data-icon="warehouse"]').click();
    const popup = page.locator('.zt-popover').filter({ has: page.locator('.icon-copy') });
    await expect(popup).toBeVisible();
    const box = (await popup.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `/tmp/zt-icon-gallery-copy-${width}.png` });
  });
}


test('filtering from the toolbar keeps keyboard focus in the search input', async ({ page }) => {
  await page.goto('/#/components/icon');
  const gallery = page.locator('#example-gallery');
  const tile = gallery.locator('[data-icon="warehouse"]');
  await tile.click();
  await tile.press('ArrowDown');
  await expect(page.getByRole('button', { name: '复制图标名', exact: true })).toBeFocused();
  const search = gallery.getByRole('textbox', { name: '搜索图标' });
  await search.focus();
  await search.press('w');
  await expect(search).toBeFocused();
  await expect(page.locator('.icon-copy')).toHaveCount(0);
});
