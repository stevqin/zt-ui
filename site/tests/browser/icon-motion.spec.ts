import { test, expect, type Page } from '@playwright/test';

async function select(page: Page, name: string, option: string) {
  await page.getByRole('combobox', { name, exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

test('gallery geometry, motion triggers, keyboard, reduced motion and mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/components/icon');
  const gallery = page.locator('#example-gallery');
  await expect(gallery.locator('[data-icon]')).toHaveCount(309);
  const invalid = await gallery.locator('[data-icon] svg').evaluateAll(svgs => svgs.flatMap(svg => {
    const box = (svg as SVGSVGElement).getBBox();
    return (box.width <= 0 && box.height <= 0) || box.x < 0 || box.y < 0 || box.x + box.width > 24.1 || box.y + box.height > 24.1
      ? [(svg.parentElement?.parentElement as HTMLElement).dataset.icon] : [];
  }));
  expect(invalid).toEqual([]);
  const icon = gallery.locator('[data-icon="warehouse"]');
  const svg = icon.locator('svg');
  await expect(svg).toHaveCSS('animation-name', 'none');
  await select(page, '图标动效', '呼吸');
  await icon.hover();
  await expect(svg).toHaveCSS('animation-name', 'zt-icon-motion-pulse');
  await gallery.locator('.icon-gallery__summary').hover();
  await expect(svg).toHaveCSS('animation-name', 'none');
  await select(page, '动效触发方式', '点击播放');
  await icon.focus();
  await page.keyboard.press('Enter');
  await expect(svg).toHaveCSS('animation-name', 'zt-icon-motion-pulse');
  await svg.evaluate(el => { el.getAnimations()[0]!.currentTime = 600; });
  await icon.click();
  await expect.poll(() => svg.evaluate(el => Number(el.getAnimations()[0]?.currentTime ?? 9999))).toBeLessThan(400);
  await expect(svg).toHaveCSS('animation-name', 'none', { timeout: 2000 });
  await icon.focus();
  await page.keyboard.press('Space');
  await expect(svg).toHaveCSS('animation-name', 'zt-icon-motion-pulse');
  await select(page, '动效触发方式', '持续播放');
  for (const [label, keyframe] of [['旋转', 'spin'], ['呼吸', 'pulse'], ['弹跳', 'bounce'], ['摇摆', 'shake']] as const) {
    await select(page, '图标动效', label);
    await expect(svg).toHaveCSS('animation-name', `zt-icon-motion-${keyframe}`);
    await expect(svg).toHaveCSS('animation-iteration-count', 'infinite');
  }
  await select(page, '图标动效', '描边绘制');
  await expect(svg.locator('path').first()).toHaveCSS('animation-name', 'zt-icon-motion-draw');
  await expect(svg.locator('path').first()).toHaveAttribute('pathLength', '100');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(svg.locator('path').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.zt-icon-glyph.is-spin').first()).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const rotated = page.locator('#example-basic .zt-icon-glyph--animation-shake');
  await rotated.hover();
  await expect(rotated.locator('svg')).toHaveCSS('animation-name', 'zt-icon-motion-shake');
  const angle = await rotated.evaluate(el => { const m = new DOMMatrix(getComputedStyle(el).transform); return Math.atan2(m.b, m.a) * 180 / Math.PI; });
  expect(angle).toBeCloseTo(15, 3);
  await select(page, '图标动效', '静止');
  await gallery.screenshot({ path: '/tmp/zt-icon-gallery-light.png' });
  await page.getByRole('button', { name: '深色主题', exact: true }).click();
  await gallery.screenshot({ path: '/tmp/zt-icon-gallery-dark.png' });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.getByRole('textbox', { name: '搜索图标', exact: true }).fill('warehouse');
  await expect(gallery.locator('[data-icon]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await gallery.screenshot({ path: '/tmp/zt-icon-gallery-mobile.png' });
});
