import { expect, test } from '@playwright/test';

test('avatar groups overlap, inherit all sizes and expose members by keyboard', async ({ page }) => {
  await page.goto('/#/components/avatar');
  const group = page.getByRole('group', { name: '项目成员', exact: true });
  await expect(group.locator('.zt-avatar')).toHaveCount(3);
  for (const status of ['primary', 'success', 'warning', 'danger', 'info']) {
    const avatar = page.locator(`.avatar-demo .zt-avatar--${status}`).first();
    await expect(avatar).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(avatar).not.toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  }
  const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
  for (const [size, pixels] of [['mini', 24], ['small', 30], ['default', 36], ['medium', 44], ['large', 54]] as const) {
    await tools.getByRole('combobox', { name: '组件尺寸' }).click();
    await page.getByRole('option', { name: size, exact: true }).click();
    const boxes = await group.locator('.zt-avatar,button').evaluateAll(nodes => nodes.map(node => { const rect = node.getBoundingClientRect(); return { width: rect.width, x: rect.x }; }));
    for (const box of boxes) expect(box.width).toBe(pixels);
    expect(boxes[1].x).toBeLessThan(boxes[0].x + boxes[0].width);
    expect(boxes[1].x - boxes[0].x).toBeGreaterThanOrEqual(pixels * .4 - .5);
    expect(boxes[1].x - boxes[0].x).toBeLessThanOrEqual(pixels * .4 + .5);
    expect(await group.evaluate(el => {
      const avatars = el.querySelectorAll('.zt-avatar');
      const box = avatars[1].getBoundingClientRect();
      return avatars[1].contains(document.elementFromPoint(box.x + box.width * .15, box.y + box.height / 2));
    })).toBe(true);
  }
  await group.screenshot({ path: '/tmp/zt-avatar-compact-group.png' });
  const button = group.getByRole('button', { name: '查看全部 5 位成员' });
  await button.focus(); await button.press('Enter');
  const popup = page.getByRole('dialog').filter({ has: page.locator('.zt-avatar-group__members') });
  await expect(popup).toBeVisible();
  await expect(popup).toHaveAccessibleName('项目成员，全部成员');
  await expect(popup.getByRole('list', { name: '项目成员，全部成员' })).toBeFocused();
  await expect(popup).toContainText('李言'); await expect(popup).toContainText('周可');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape'); await expect(popup).toHaveCount(0); await expect(button).toBeFocused();
  await page.screenshot({ path: '/tmp/zt-avatar-group-desktop-light.png', fullPage: true });
  await button.click(); await page.getByRole('link', { name: /图标/ }).first().click();
  await expect(page.locator('.zt-avatar-group__members')).toHaveCount(0);
});

test('avatars load local portraits and groups fit mobile dark and themed surfaces', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/components/avatar');
  const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
  await tools.getByRole('button', { name: '深色主题', exact: true }).click();
  const portrait = page.getByRole('group', { name: '创意团队肖像', exact: true });
  for (const img of await portrait.locator('img').all()) expect(await img.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await expect(page.getByRole('status').filter({ hasText: '图片失败，已显示后备姓名' })).toBeVisible();
  const button = page.getByRole('group', { name: '项目成员', exact: true }).getByRole('button');
  await button.click();
  const popup = page.getByRole('dialog').filter({ has: page.locator('.zt-avatar-group__members') });
  await expect(popup).toBeVisible();
  const box = (await popup.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/zt-avatar-group-mobile-dark.png', fullPage: true });
  await page.keyboard.press('Escape');
  await tools.getByRole('slider', { name: '组件圆角' }).press('Home');
  await expect(page.locator('.avatar-demo__samples .zt-avatar--square')).toHaveCSS('border-radius', '0px');
  await page.screenshot({ path: '/tmp/zt-avatar-group-mobile-dark-square.png', fullPage: true });
});


test('a long overflow list receives keyboard focus and scrolls without moving the page', async ({ page }) => {
  await page.goto('/#/components/avatar');
  const button = page.getByRole('group', { name: '门店团队', exact: true }).getByRole('button');
  await button.focus(); await button.press('Enter');
  const dialog = page.getByRole('dialog', { name: '门店团队，全部成员', exact: true });
  const list = dialog.getByRole('list', { name: '门店团队，全部成员', exact: true });
  await expect(list).toBeFocused();
  const geometry = await list.evaluate(node => ({ scroll: node.scrollHeight, client: node.clientHeight }));
  expect(geometry.scroll).toBeGreaterThan(geometry.client);
  const pageScroll = await page.evaluate(() => window.scrollY);
  await list.press('ArrowDown'); await list.press('ArrowDown'); await list.press('ArrowDown');
  await expect.poll(() => list.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0); await expect(button).toBeFocused();
});


for (const viewport of [{ width: 1440, height: 1000 }, { width: 320, height: 568 }, { width: 568, height: 320 }]) {
  test(`overflow panel has one contained scroller and a stable header at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/#/components/avatar');
    const button = page.getByRole('group', { name: '门店团队', exact: true }).getByRole('button');
    await button.click();
    const dialog = page.getByRole('dialog', { name: '门店团队，全部成员', exact: true });
    const list = dialog.getByRole('list', { name: '门店团队，全部成员', exact: true });
    await expect(list).toBeFocused();
    const box = (await dialog.boundingBox())!;
    await dialog.screenshot({ path: `/tmp/zt-avatar-overflow-${viewport.width}-before.png` });
    expect(box.width).toBeGreaterThanOrEqual(240);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    const header = dialog.locator('.zt-avatar-group__header');
    await expect(header).toContainText('门店团队');
    await expect(header).toContainText('15');
    const top = (await header.boundingBox())!.y;
    await expect(list).toHaveCSS('overscroll-behavior-y', 'contain');
    await expect(dialog.locator('.zt-popover__content')).toHaveCSS('overflow-y', 'hidden');
    expect(await list.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await list.press('End');
    await expect.poll(() => list.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    expect((await header.boundingBox())!.y).toBe(top);
    await expect(list.getByText('吴月', { exact: true })).toBeInViewport();
    const scroll = await page.evaluate(() => window.scrollY);
    await list.hover();
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.scrollY)).toBe(scroll);
    await dialog.screenshot({ path: `/tmp/zt-avatar-overflow-${viewport.width}.png` });
  });
}


test('hovered avatars rise and return smoothly without a name tooltip', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/components/avatar');
  const group = page.getByRole('group', { name: '项目成员', exact: true });
  const item = group.locator('.zt-avatar-group__item').first();
  const avatar = item.locator('.zt-avatar');
  const initial = (await group.boundingBox())!;
  const box = (await item.boundingBox())!;
  await page.mouse.move(box.x + box.width * .15, box.y + box.height / 2);
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await expect(item).toHaveCSS('z-index', '2');
  await expect.poll(() => avatar.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).f)).toBeLessThan(-3);
  expect(await avatar.evaluate(el => {
    const box = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(box.right - 5, box.y + box.height / 2));
  })).toBe(true);
  expect((await group.boundingBox())!.width).toBe(initial.width);
  await group.screenshot({ path: '/tmp/zt-avatar-hover-raised.png' });
  await page.mouse.move(initial.x - 20, initial.y - 20);
  const returnFrames = await avatar.evaluate(async el => {
    const samples: number[] = [];
    const start = performance.now();
    while (performance.now() - start < 220) {
      await new Promise(requestAnimationFrame);
      samples.push(new DOMMatrix(getComputedStyle(el).transform).f);
    }
    return samples;
  });
  expect(returnFrames.some(y => y < -.1 && y > -3.9)).toBe(true);
  await expect(page.getByRole('tooltip', { name: '林青', exact: true })).toHaveCount(0);
  await expect(item).toHaveCSS('z-index', '0');
  await expect.poll(() => avatar.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).f)).toBe(0);
  await item.locator('.zt-avatar-group__trigger').focus();
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await expect(item).toHaveCSS('z-index', '2');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(avatar).toHaveCSS('transition-duration', '0s');
});


test('sweeping both directions visits each exposed avatar without skipping covered neighbors', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/components/avatar');
  const group = page.getByRole('group', { name: '项目成员', exact: true });
  const items = group.locator('.zt-avatar-group__item');
  await expect(items).toHaveCount(3);
  const boxes = await items.evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
  for (const i of [0, 1, 2, 1, 0]) {
    const box = boxes[i];
    await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2);
    await expect(items.nth(i)).toHaveClass(/is-active/);
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await expect(items.nth(i)).toHaveCSS('z-index', '2');
    await expect.poll(() => items.nth(i).locator('.zt-avatar').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).f)).toBeLessThan(-3);
  }
  await page.mouse.move(boxes[0].x - 15, boxes[0].y);
  await expect(group.locator('.is-active')).toHaveCount(0);
  await expect(page.getByRole('tooltip')).toHaveCount(0);
});


test('overflow member clicks and keyboard activation expose the selected member to the demo', async ({ page }) => {
  await page.goto('/#/components/avatar');
  const group = page.getByRole('group', { name: '项目成员', exact: true });
  await group.getByRole('button').click();
  const dialog = page.getByRole('dialog', { name: '项目成员，全部成员', exact: true });
  await expect(dialog.getByRole('button')).toHaveCount(5);
  await expect(group.locator('.zt-avatar')).toHaveCount(3);
  await dialog.getByRole('button', { name: '林青', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '已点击：林青' })).toBeVisible();
  await dialog.getByRole('button', { name: '李言', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '已点击：李言' })).toBeVisible();
  const member = dialog.getByRole('button', { name: '周可', exact: true });
  await member.focus(); await member.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: '已点击：周可' })).toBeVisible();
  await member.press('Space');
  await expect(page.getByRole('status').filter({ hasText: '已点击：周可' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});
