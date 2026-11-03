import { test, expect } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  test(`sticky group joins the header and fades menus without moving in ${theme}`, async ({ page }) => {
    await page.addInitScript(theme => localStorage.setItem('zt-ui-docs-appearance-v2', JSON.stringify({ size: 'default', borderRadius: 11, themePreference: theme })), theme);
    await page.goto('/#/components/form');
    const sidebar = page.getByRole('complementary', { name: '文档导航', exact: true });
    const group = sidebar.locator('.sidebar-group.is-current');
    await expect(group).toHaveClass(/is-pinned/);
    const geometry = await group.locator('.nav-group').evaluate(el => {
      const rect = el.getBoundingClientRect();
      const header = document.querySelector('.site-header')!.getBoundingClientRect();
      const sidebar = el.closest('.sidebar')!;
      const host = sidebar.getBoundingClientRect();
      const padding = parseFloat(getComputedStyle(sidebar).paddingTop);
      const glass = getComputedStyle(el, '::before');
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, headerBottom: header.bottom, hostTop: host.top, padding, glassTop: rect.top + parseFloat(glass.top), glassBottom: rect.bottom - parseFloat(glass.bottom), blur: glass.backdropFilter, mask: glass.maskImage, pointer: glass.pointerEvents, border: glass.borderTopWidth };
    });
    // Previously measured stable heading rectangle was x16,y88,w231,h42 at 1440px.
    expect(geometry.x).toBe(16);
    expect(geometry.height).toBe(42);
    expect(geometry.y).toBe(88);
    expect(geometry.y).toBe(geometry.hostTop + geometry.padding);
    expect(geometry.glassTop).toBe(geometry.headerBottom);
    expect(geometry.glassBottom).toBeGreaterThan(geometry.y + geometry.height);
    expect(geometry.blur).toContain('blur');
    expect(geometry.mask).toContain('linear-gradient');
    expect(geometry.pointer).toBe('none');
    expect(geometry.border).toBe('0px');
    const linkUnderFade = await group.locator('.nav-group').evaluate(el => {
      const box = el.getBoundingClientRect();
      return Boolean(document.elementFromPoint(box.x + 100, box.bottom + 12)?.closest('a'));
    });
    expect(linkUnderFade).toBe(true);
    await page.screenshot({ path: `/tmp/zt-sidebar-glass-${theme}.png` });
    await sidebar.evaluate(el => { el.scrollTop += 18; });
    await expect(group).toHaveClass(/is-pinned/);
    expect((await group.locator('.nav-group').boundingBox())!.y).toBe(geometry.y);
    await sidebar.evaluate(el => { el.scrollTop = 0; });
    await expect(sidebar.locator('.sidebar-group.is-pinned')).toHaveCount(0);
    await group.getByRole('button', { name: '表单组件', exact: true }).click();
    await expect(group.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });
}
