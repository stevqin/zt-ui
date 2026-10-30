import { expect, test } from '@playwright/test';

for (const width of [1440, 375]) {
  test(`API explanations describe behavior at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const [route, component, section, name, expected] of [
      ['badge', 'ZtBadge', 'Props', 'offset', '水平和垂直像素值'],
      ['select', 'ZtSelect', 'Events', 'update:modelValue', '单选返回选项 value 或 null'],
      ['vtable-grid', 'ZtVTableGrid', 'Slots', 'form', 'query(true) 从第一页查询'],
      ['zt-alert-loading', 'ZtLoading', 'Types', 'LoadingInstance', '关闭加载遮罩'],
    ]) {
      await page.goto(`/#/components/${route}#api`);
      const api = page.locator('#api');
      const table = page.locator(`[aria-label="${component} ${section}"]`);
      await expect(table.getByRole('row').filter({ has: page.getByRole('cell', { name, exact: true }) })).toContainText(expected);
      await expect(api).not.toContainText('组件配置属性；具体行为参见上方用法示例。');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
}
