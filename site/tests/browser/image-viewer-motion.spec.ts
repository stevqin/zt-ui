import { test, expect } from '@playwright/test';

async function open(page: import('@playwright/test').Page) {
  await page.goto('/#/components/image');
  const thumbnail = page.locator('#example-preview .zt-image').first();
  await thumbnail.click();
  const viewer = page.getByRole('dialog', { name: '图片预览', exact: true });
  await expect(viewer).toBeVisible();
  return { thumbnail, viewer };
}
const activeFrame = (viewer: import('@playwright/test').Locator) => viewer.locator('.zt-image-viewer__frame:not([aria-hidden="true"])');

test('preview controls animate on hover and press while retaining their position', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const { viewer } = await open(page);
  for (const name of ['关闭预览', '上一张', '下一张', '缩小', '放大', '向左旋转', '重置', '向右旋转']) {
    const button = viewer.getByRole('button', { name, exact: true });
    await button.hover();
    await expect.poll(async () => button.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeGreaterThan(1.05);
    if (name === '关闭预览') {
      await expect.poll(async () => button.locator('.zt-icon-glyph').evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).b))).toBeGreaterThan(.9);
    }
    if (name === '上一张' || name === '下一张') {
      const box = (await button.boundingBox())!;
      expect(Math.abs(box.y + box.height / 2 - 500)).toBeLessThan(1);
    }
    await page.mouse.down();
    await expect.poll(async () => button.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeLessThan(.98);
    await page.mouse.move(1, 1); await page.mouse.up();
  }
  await expect(viewer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(viewer).toHaveCount(0);
});

test('image changes crossfade directionally without overwriting zoom or rotation and survive rapid reversal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const { viewer, thumbnail } = await open(page);
  await viewer.getByRole('button', { name: '放大', exact: true }).click();
  await viewer.getByRole('button', { name: '向右旋转', exact: true }).click();
  await expect(activeFrame(viewer).locator('img')).toHaveAttribute('style', /scale\(1\.2\).*rotate\(90deg\)/);
  const sample = async (previous: boolean, clicks: number) => viewer.evaluate(async (el, action) => {
    const button = el.querySelector<HTMLButtonElement>(action.previous ? '.zt-image-viewer__prev' : '.zt-image-viewer__next')!;
    for (let i = 0; i < action.clicks; i++) button.click();
    const frames: { x: number; opacity: number }[] = [];
    const start = performance.now();
    while (performance.now() - start < 400) {
      await new Promise(requestAnimationFrame);
      const frame = el.querySelector('.zt-image-viewer__frame:not([aria-hidden="true"])');
      if (frame) { const style = getComputedStyle(frame); frames.push({ x: new DOMMatrix(style.transform).e, opacity: Number(style.opacity) }); }
    }
    return frames;
  }, { previous, clicks });
  const next = await sample(false, 1);
  expect(next.some(frame => frame.x > 1 && frame.opacity > 0 && frame.opacity < 1)).toBe(true);
  await expect(viewer.locator('.zt-image-viewer__frame')).toHaveCount(1);
  await expect(activeFrame(viewer).locator('img')).toHaveAttribute('style', /scale\(1\).*rotate\(0deg\)/);
  await expect(viewer.locator('.zt-image-viewer__counter')).toHaveText('2 / 3');
  const previous = await sample(true, 2);
  expect(previous.some(frame => frame.x < -1)).toBe(true);
  await expect(viewer.locator('.zt-image-viewer__counter')).toHaveText('3 / 3');
  const wrap = await sample(false, 1);
  expect(wrap.some(frame => frame.x > 1)).toBe(true);
  await viewer.evaluate(async el => {
    for (const selector of ['.zt-image-viewer__next', '.zt-image-viewer__next', '.zt-image-viewer__prev']) {
      (el.querySelector(selector) as HTMLButtonElement).click(); await new Promise(requestAnimationFrame);
    }
  });
  await expect.poll(async () => viewer.locator('.zt-image-viewer__frame').count()).toBe(1);
  await expect(activeFrame(viewer)).toHaveCount(1);
  await expect(activeFrame(viewer)).not.toHaveAttribute('inert');
  await expect(viewer.locator('.zt-image-viewer__counter')).toHaveText('2 / 3');
  await expect(activeFrame(viewer)).toHaveAttribute('data-image-index', '1');
  await page.screenshot({ path: '/tmp/zt-image-preview-motion.png' });
  await page.keyboard.press('Escape');
  await expect(thumbnail).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('preview motion respects reduced motion and controls fit a narrow dark viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/components/image');
  await page.getByRole('button', { name: '深色主题', exact: true }).click();
  await page.locator('#example-preview .zt-image').first().click();
  const viewer = page.getByRole('dialog', { name: '图片预览', exact: true });
  const button = viewer.getByRole('button', { name: '下一张', exact: true });
  await button.hover();
  await expect(button).toHaveCSS('transition-duration', '0s');
  expect(await button.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBe(1);
  await button.click();
  await expect(viewer.locator('.zt-image-viewer__counter')).toHaveText('2 / 3');
  await expect(activeFrame(viewer)).toHaveAttribute('data-image-index', '1');
  await expect(activeFrame(viewer)).toHaveCSS('transition-duration', '0s');
  await expect(activeFrame(viewer).locator('img')).toHaveCSS('transition-duration', '0s');
  const toolbar = (await viewer.getByRole('toolbar').boundingBox())!;
  expect(toolbar.x).toBeGreaterThanOrEqual(0);
  expect(toolbar.x + toolbar.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/zt-image-preview-mobile-dark.png' });
});


test('a cold image stays visible until its replacement loads, then transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/image-motion-fixture/*.svg', async route => {
    if (route.request().url().endsWith('/b.svg')) await pending;
    await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#4986dd"/></svg>' });
  });
  await page.goto('/#/components/image');
  await page.evaluate(async () => {
    const { createApp, h } = await import(new URL('node_modules/.vite/deps/vue.js', document.baseURI).href);
    const source = await fetch(new URL('src/examples/image/Preview.vue', document.baseURI)).then(response => response.text());
    const componentUrl = source.match(/from "([^"\n]+src\/index\.ts[^"\n]*)"/)?.[1];
    if (!componentUrl) throw new Error('Cannot locate library module URL');
    const { ZtImageViewer } = await import(componentUrl);
    const host = document.createElement('div'); document.body.append(host);
    createApp({ render: () => h(ZtImageViewer, { urls: ['/image-motion-fixture/a.svg', '/image-motion-fixture/b.svg'] }) }).mount(host);
  });
  const viewer = page.getByRole('dialog', { name: '图片预览', exact: true });
  await expect(viewer.getByRole('button', { name: '放大', exact: true })).toBeEnabled();
  await viewer.getByRole('button', { name: '下一张', exact: true }).click();
  await expect(viewer.getByRole('status')).toHaveText('图片加载中…');
  await expect(activeFrame(viewer)).toHaveAttribute('data-image-index', '0');
  expect(await activeFrame(viewer).locator('img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(viewer.getByRole('button', { name: '放大', exact: true })).toBeDisabled();
  release();
  await expect(activeFrame(viewer)).toHaveAttribute('data-image-index', '1');
  await expect(viewer.getByRole('status')).toHaveCount(0);
  await expect(viewer.locator('.zt-image-viewer__frame')).toHaveCount(1);
  expect(await activeFrame(viewer).locator('img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(viewer.getByRole('button', { name: '放大', exact: true })).toBeEnabled();
});
