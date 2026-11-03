import { expect, test } from '@playwright/test';

test('carousel slides move through intermediate positions and settle after rapid navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/components/carousel');
  const carousel = page.getByRole('region', { name: '门店活动轮播' });
  await expect(carousel).toBeVisible();
  const samples = await carousel.evaluate(async (el) => {
    const incoming = el.querySelectorAll('.zt-carousel__slide')[1]!;
    const x = () => incoming.getBoundingClientRect().x - el.getBoundingClientRect().x;
    (el.querySelector('[aria-label="下一张"]') as HTMLButtonElement).click();
    const values: number[] = [];
    const start = performance.now();
    while (performance.now() - start < 500) { await new Promise(requestAnimationFrame); values.push(x()); }
    return { width: el.clientWidth, values };
  });
  expect(samples.values.some(x => x > 2 && x < samples.width - 2)).toBe(true);
  await expect.poll(() => carousel.locator('.zt-carousel__slide[aria-hidden="false"]').evaluate(el => Math.abs(el.getBoundingClientRect().x - el.parentElement!.getBoundingClientRect().x))).toBeLessThan(1);
  await carousel.getByRole('button', { name: '下一张', exact: true }).click();
  await carousel.getByRole('button', { name: '下一张', exact: true }).click();
  await carousel.getByRole('button', { name: '上一张', exact: true }).click();
  await expect(carousel.locator('.zt-carousel__slide[aria-hidden="false"]')).toContainText('周末门店特惠');
  await expect.poll(() => carousel.locator('.zt-carousel__slide:visible').count()).toBe(1);
  for (const hidden of await carousel.locator('.zt-carousel__slide[aria-hidden="true"]').all()) await expect(hidden).toHaveAttribute('inert', '');
  await carousel.screenshot({ path: '/tmp/zt-carousel-motion.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await carousel.getByRole('button', { name: '下一张', exact: true }).click();
  await expect(carousel.locator('.zt-carousel__slide[aria-hidden="false"]')).toHaveCSS('transition-duration', '0s');
});

for (const action of ['上一张', '下一张'] as const) {
  test(`carousel ${action} keeps wrap direction`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#/components/carousel');
    const carousel = page.getByRole('region', { name: '门店活动轮播' });
    await expect(carousel).toBeVisible();
    if (action === '下一张') {
      await carousel.getByRole('button', { name: '切换到第 3 张', exact: true }).click();
      await expect.poll(() => carousel.locator('.zt-carousel__slide:visible').count()).toBe(1);
    }
    const samples = await carousel.evaluate(async (el, action) => {
      const target = el.querySelectorAll('.zt-carousel__slide')[action === '上一张' ? 2 : 0]!;
      (el.querySelector(`[aria-label="${action}"]`) as HTMLButtonElement).click();
      const values: number[] = [];
      const start = performance.now();
      while (performance.now() - start < 500) {
        await new Promise(requestAnimationFrame);
        values.push(target.getBoundingClientRect().x - el.getBoundingClientRect().x);
      }
      return values;
    }, action);
    expect(samples.some(x => action === '上一张' ? x < -2 : x > 2)).toBe(true);
    await expect.poll(() => carousel.locator('.zt-carousel__slide[aria-hidden="false"]').evaluate(el => Math.abs(el.getBoundingClientRect().x - el.parentElement!.getBoundingClientRect().x))).toBeLessThan(1);
  });
}

test('auto height follows active slotted content through animated and rapid changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/components/carousel');
  await page.evaluate(async () => {
    const { createApp, h } = await import(new URL('node_modules/.vite/deps/vue.js', document.baseURI).href);
    const source = await fetch(new URL('src/examples/carousel/Basic.vue', document.baseURI)).then(response => response.text());
    const componentUrl = source.match(/from "([^"]+src\/index\.ts[^"]*)"/)?.[1];
    if (!componentUrl) throw new Error('Cannot locate library module URL');
    const { ZtCarousel } = await import(componentUrl);
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;inset:0 auto auto 0;width:600px;z-index:99999';
    document.body.append(host);
    createApp({ render: () => h(ZtCarousel, { height: 'auto', label: '自适应内容测试' }, { default: () => [180, 280, 220].map((height, i) => h('div', { key: i, style: { height: `${height}px` } }, `内容 ${i + 1}`)) }) }).mount(host);
  });
  const carousel = page.getByRole('region', { name: '自适应内容测试' });
  await expect(carousel).toBeVisible();
  const height = () => carousel.evaluate(el => el.getBoundingClientRect().height);
  await expect.poll(height).toBe(180);
  const heights = await carousel.evaluate(async el => {
    (el.querySelector('[aria-label="下一张"]') as HTMLButtonElement).click();
    const samples: number[] = [];
    const start = performance.now();
    while (performance.now() - start < 500) {
      await new Promise(requestAnimationFrame);
      samples.push(el.getBoundingClientRect().height);
    }
    return samples;
  });
  expect(heights.every(height => height >= 180 && height <= 280)).toBe(true);
  await expect.poll(height).toBe(280);
  await expect.poll(() => carousel.locator('.zt-carousel__slide:visible').count()).toBe(1);
  await carousel.getByRole('button', { name: '下一张', exact: true }).click();
  await carousel.getByRole('button', { name: '下一张', exact: true }).click();
  await expect.poll(height).toBe(180);
  await expect.poll(() => carousel.locator('.zt-carousel__slide:visible').count()).toBe(1);
  await carousel.getByRole('button', { name: '上一张', exact: true }).click();
  await expect.poll(height).toBe(220);
  await expect.poll(() => carousel.locator('.zt-carousel__slide:visible').count()).toBe(1);
  await carousel.screenshot({ path: '/tmp/zt-carousel-auto-height.png' });
});
