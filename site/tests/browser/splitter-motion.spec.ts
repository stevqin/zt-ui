import { test, expect } from '@playwright/test';

for (const direction of ['horizontal', 'vertical'] as const) {
  test(`Splitter ${direction} uses a slim divider and animates collapse without delaying dragging`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#/components/splitter');
    const split = page.locator(`.zt-splitter--${direction}`).first();
    const pane = split.locator('.zt-splitter__pane').first();
    const handle = split.locator('.zt-splitter__handle');
    const button = split.getByRole('button', { name: '收起第一栏', exact: true });
    await expect(button).toBeVisible();
    const line = (await handle.boundingBox())!;
    const thumb = (await button.boundingBox())!;
    expect(direction === 'horizontal' ? line.width : line.height).toBeLessThanOrEqual(3);
    expect(direction === 'horizontal' ? thumb.width : thumb.height).toBeGreaterThanOrEqual(12);
    const motion = await split.evaluate(async (el, direction) => {
      const pane = el.querySelector('.zt-splitter__pane')!;
      const size = () => direction === 'horizontal' ? pane.getBoundingClientRect().width : pane.getBoundingClientRect().height;
      const before = size();
      (el.querySelector('button') as HTMLButtonElement).click();
      const samples: number[] = [];
      const start = performance.now();
      while (performance.now() - start < 400) { await new Promise(requestAnimationFrame); samples.push(size()); }
      return { before, samples };
    }, direction);
    expect(motion.samples.some(value => value > 1 && value < motion.before - 1)).toBe(true);
    expect(motion.samples.at(-1)).toBeLessThanOrEqual(1);
    await expect(pane).toHaveAttribute('inert', '');
    const expand = split.getByRole('button', { name: '展开第一栏', exact: true });
    const outer = (await split.boundingBox())!;
    const collapsedThumb = (await expand.boundingBox())!;
    expect(collapsedThumb.x).toBeGreaterThanOrEqual(outer.x);
    expect(collapsedThumb.y).toBeGreaterThanOrEqual(outer.y);
    expect(collapsedThumb.x + collapsedThumb.width).toBeLessThanOrEqual(outer.x + outer.width);
    expect(collapsedThumb.y + collapsedThumb.height).toBeLessThanOrEqual(outer.y + outer.height);
    await expand.click();
    await expect.poll(async () => {
      const rect = (await pane.boundingBox())!;
      return Math.abs((direction === 'horizontal' ? rect.width : rect.height) - motion.before);
    }).toBeLessThan(1);
    const separator = split.getByRole('separator');
    const bar = (await separator.boundingBox())!;
    const root = (await split.boundingBox())!;
    const x = direction === 'horizontal' ? bar.x + bar.width / 2 : root.x + 30;
    const y = direction === 'horizontal' ? root.y + 30 : bar.y + bar.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await expect(split).toHaveClass(/is-dragging/);
    await page.mouse.move(direction === 'horizontal' ? root.x + root.width * .6 : x, direction === 'vertical' ? root.y + root.height * .6 : y, { steps: 4 });
    await expect(pane).toHaveCSS('transition-duration', '0s');
    const dragged = (await pane.boundingBox())!;
    expect(Math.abs((direction === 'horizontal' ? dragged.width : dragged.height) - (direction === 'horizontal' ? root.width : root.height) * .6)).toBeLessThan(3);
    await page.mouse.up();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await separator.press('Enter');
    await expect(pane).toHaveCSS('transition-duration', '0s');
    await expect.poll(async () => { const r = (await pane.boundingBox())!; return direction === 'horizontal' ? r.width : r.height; }).toBeLessThanOrEqual(1);
    await expect(separator).toBeFocused();
    await split.screenshot({ path: `/tmp/zt-splitter-${direction}-collapsed.png` });
  });
}
