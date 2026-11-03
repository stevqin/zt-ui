import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectAligned(page: Page, target: Locator) {
  const spotlight = page.locator('.zt-tour__spotlight');
  await expect.poll(async () => {
    const box = (await target.boundingBox())!;
    const hole = (await spotlight.boundingBox())!;
    return Math.max(Math.abs(hole.x - box.x + 4), Math.abs(hole.y - box.y + 4), Math.abs(hole.width - box.width - 8), Math.abs(hole.height - box.height - 8));
  }).toBeLessThan(1);
  expect(await target.evaluate(el => {
    const r = el.getBoundingClientRect();
    return [r.left + 2, r.right - 2].every(x => el.contains(document.elementFromPoint(x, r.top + r.height / 2)));
  })).toBe(true);
}

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`spotlight fits target buttons through sizes, steps and scrolling at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/#/components/tour');
    const example = page.locator('#example-basic');
    const start = example.getByRole('button', { name: '开始导览', exact: true });
    const target = example.getByRole('button', { name: '筛选', exact: true });
    const tools = page.getByRole('group', { name: '演示外观设置', exact: true });
    for (const size of ['mini', 'small', 'default', 'medium', 'large']) {
      await tools.getByRole('combobox', { name: '组件尺寸', exact: true }).click();
      await page.getByRole('option', { name: size, exact: true }).click();
      await start.click();
      await expect(page.getByRole('dialog', { name: '筛选订单', exact: true })).toBeVisible();
      await expectAligned(page, target);
      await target.click();
      await expect(example.getByRole('status')).toHaveText('筛选面板已打开');
      await page.getByRole('button', { name: '下一步', exact: true }).click();
      await expect(page.getByRole('dialog', { name: '导出结果', exact: true })).toBeVisible();
      const next = example.getByRole('button', { name: '导出', exact: true });
      await expectAligned(page, next);
      await page.evaluate(() => window.scrollBy(0, 60));
      await expectAligned(page, next);
      await next.click();
      await expect(example.getByRole('status')).toHaveText('导出任务已创建');
      await page.getByRole('button', { name: '完成', exact: true }).click();
      await expect(page.locator('.zt-tour')).toHaveCount(0);
      await expect(start).toBeFocused();
    }
    await start.click();
    await expectAligned(page, target);
    await page.screenshot({ path: `/tmp/zt-tour-spotlight-${viewport.width}.png` });
    await page.keyboard.press('Escape');
    await expect(start).toBeFocused();
  });
}
