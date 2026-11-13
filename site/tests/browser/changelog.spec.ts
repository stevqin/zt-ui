import { expect, test } from '@playwright/test';

test('changelog renders versions, categorized lists, links and inline code as a document', async ({ page }) => {
  await page.goto('/#/guide/changelog');
  const content = page.locator('.changelog-content');
  await expect(page.getByRole('heading', { level: 1, name: '更新日志', exact: true })).toHaveCount(1);
  await expect(content.getByRole('heading', { level: 2 }).first()).toContainText('0.13.3');
  await expect(content.getByRole('heading', { level: 3 }).first()).toHaveText('新增');
  await expect(content.locator('li strong').first()).toContainText('InputNumber 数字输入框');
  await expect(content.locator('code').filter({ hasText: 'product_no' }).first()).toBeVisible();
  await expect(content.locator('a[href="https://github.com/stevqin/zt-ui/compare/v0.9.0...v0.10.0"]')).toBeVisible();
  await expect(page.locator('pre.changelog-content')).toHaveCount(0);
  await page.screenshot({ path: '/tmp/zt-changelog-rendered.png', fullPage: false });
});

test('Markdown renderer supports code blocks, lists, quotations and tables', async ({ page }) => {
  await page.goto('/#/guide/changelog');
  const html = await page.evaluate(async () => {
    const { renderMarkdown } = await import(new URL('src/app/markdown.ts', document.baseURI).href);
    return renderMarkdown('## Version\n\n**Added** and `valueType`\n\n1. First\n2. Second\n\n> Note\n\n```ts\nconst value = 1\n```\n\n| Key | Value |\n| --- | --- |\n| size | small |');
  });
  for (const tag of ['h2', 'strong', 'code', 'ol', 'blockquote', 'pre', 'table']) expect(html).toContain(`<${tag}`);
  expect(html).toContain('language-ts');
});

test('Markdown output strips executable markup and unsafe URLs', async ({ page }) => {
  await page.goto('/#/guide/changelog');
  const result = await page.evaluate(async () => {
    const { renderMarkdown } = await import(new URL('src/app/markdown.ts', document.baseURI).href);
    const host = document.createElement('div');
    host.innerHTML = renderMarkdown('<script>window.attack = true</script>\n\n<img src="x" onerror="alert(1)">\n\n[unsafe](javascript:alert(1))\n\n[safe](https://example.com/releases)');
    return { script: !!host.querySelector('script'), handler: !!host.querySelector('[onerror]'), unsafeLink: !!host.querySelector('a[href^="javascript:"]'), safeLink: host.querySelector('a[href="https://example.com/releases"]')?.textContent };
  });
  expect(result).toEqual({ script: false, handler: false, unsafeLink: false, safeLink: 'safe' });
});


test('version navigation locates complete historical entries and keeps the active version', async ({ page }) => {
  await page.goto('/#/guide/changelog');
  await expect(page).toHaveTitle('更新日志 · Zt UI');
  const outline = page.getByRole('complementary', { name: '本页目录' });
  await expect(outline).toContainText('版本记录');
  await outline.getByRole('link', { name: 'v0.12.0', exact: true }).click();
  await expect(page).toHaveURL(/#release-0-12-0$/);
  await expect.poll(() => page.locator('#release-0-12-0').evaluate(el => Math.abs(el.getBoundingClientRect().top - 88))).toBeLessThan(2);
  await expect(outline.getByRole('link', { name: 'v0.12.0', exact: true })).toHaveClass(/active/);
  await expect(page.locator('#release-0-12-0')).toContainText('SkuSelect');
  await outline.getByRole('link', { name: 'v0.13.3', exact: true }).click();
  await expect.poll(() => page.locator('#release-0-13-3').evaluate(el => Math.abs(el.getBoundingClientRect().top - 88))).toBeLessThan(2);
  await expect(page.locator('#release-0-13-3 .release-badge')).toHaveText('本次更新');
  await page.screenshot({ path: '/tmp/zt-changelog-desktop.png' });
});

test('release notes remain readable in narrow dark layouts and expose mobile version links', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/#/guide/changelog');
  await page.getByRole('button', { name: '深色主题', exact: true }).click();
  const quick = page.getByRole('navigation', { name: '版本快速导航' });
  await expect(quick).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const release = page.locator('#release-0-13-3');
  const meta = (await release.locator('.release-meta').boundingBox())!;
  const body = (await release.locator('.release-body').boundingBox())!;
  expect(body.y).toBeGreaterThan(meta.y + meta.height);
  await page.screenshot({ path: '/tmp/zt-changelog-mobile-dark.png' });
  await quick.getByRole('link', { name: 'v0.10.0', exact: true }).click();
  await expect(page).toHaveURL(/#release-0-10-0$/);
  await expect(page.locator('#release-0-10-0')).toContainText('Dropdown');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
