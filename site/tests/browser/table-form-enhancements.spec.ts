import { expect, test, type Page } from '@playwright/test';

function example(page: Page, id: string) {
  return page.locator(`#example-${id} .example-preview`);
}

async function categoryOptions(page: Page) {
  const options = page.locator('.zt-table__filter-options[aria-label="类别筛选选项"]:visible');
  await expect(options).toBeVisible();
  return options;
}

test('Table local filters combine column criteria and restore rows when cleared', async ({ page }) => {
  await page.goto('/#/components/table');
  const preview = example(page, 'filter');
  const rows = preview.locator('tbody tr');
  await expect(rows).toHaveCount(3);
  await preview.getByRole('button', { name: '筛选类别', exact: true }).click();
  const categories = await categoryOptions(page);
  await categories.getByRole('checkbox', { name: '出行', exact: true }).check();
  await expect(rows).toHaveCount(2);
  await expect(rows).toContainText(['帆布提袋', '折叠雨伞']);
  await preview.getByRole('button', { name: '筛选类别', exact: true }).click();
  await preview.getByRole('button', { name: '筛选价格', exact: true }).click();
  const prices = page.locator('.zt-table__filter-options[aria-label="价格筛选选项"]:visible');
  await prices.getByRole('checkbox', { name: '50 元及以上', exact: true }).check();
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('折叠雨伞');
  await prices.getByRole('checkbox', { name: '50 元及以上', exact: true }).uncheck();
  await preview.getByRole('button', { name: '筛选价格', exact: true }).click();
  await preview.getByRole('button', { name: '筛选类别', exact: true }).click();
  await (await categoryOptions(page)).getByRole('checkbox', { name: '出行', exact: true }).uncheck();
  await expect(rows).toHaveCount(3);
});

test('Table merged cells and both summary modes render the expected DOM', async ({ page }) => {
  await page.goto('/#/components/table');
  const span = example(page, 'span');
  const rows = span.locator('tbody tr');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).locator('td')).toHaveCount(3);
  await expect(rows.nth(0).locator('td').first()).toHaveAttribute('rowspan', '2');
  await expect(rows.nth(0).locator('td').first()).toHaveText('出行');
  await expect(rows.nth(1).locator('td')).toHaveCount(2);
  await expect(rows.nth(1)).toContainText('折叠雨伞');
  const summaries = example(page, 'summary').locator('tfoot tr');
  await expect(summaries).toHaveCount(2);
  await expect(summaries.nth(0).locator('td')).toHaveText(['合计', '20', '1072']);
  await expect(summaries.nth(1).locator('td')).toHaveText(['统计', '2 项', '¥ 1072']);
});

test('Table current row responds to mouse, keyboard and external clear', async ({ page }) => {
  await page.goto('/#/components/table');
  const preview = example(page, 'currentrow');
  const rows = preview.locator('tbody tr');
  await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true');
  await rows.nth(0).click();
  await expect(preview).toContainText('当前行：1');
  await expect(rows.nth(0)).toHaveAttribute('aria-current', 'true');
  await rows.nth(1).focus();
  await rows.nth(1).press('Enter');
  await expect(preview).toContainText('当前行：2');
  await preview.getByRole('button', { name: '清除当前行', exact: true }).click();
  await expect(preview.locator('tbody tr[aria-current="true"]')).toHaveCount(0);
  await expect(preview).toContainText('当前行：未选择');
  await rows.nth(0).focus();
  await rows.nth(0).press('Space');
  await expect(rows.nth(0)).toHaveAttribute('aria-current', 'true');
});

test('Table remote pagination preserves selection and resets page for filters and sorting', async ({ page }) => {
  await page.goto('/#/components/table');
  const preview = example(page, 'remote');
  const table = preview.locator('.zt-table');
  const rows = preview.locator('tbody tr');
  const pager = preview.getByRole('navigation', { name: '分页', exact: true });
  await expect(table).toHaveAttribute('aria-busy', 'false');
  await expect(rows).toHaveCount(6);
  await rows.first().locator('label.zt-checkbox').click();
  await expect(rows.first().getByRole('checkbox', { name: '选择行 1', exact: true })).toBeChecked();
  await pager.getByRole('button', { name: '下一页', exact: true }).click();
  await expect(table).toHaveAttribute('aria-busy', 'false');
  await expect(rows.first()).toContainText('商品 07');
  await expect(preview).toContainText('跨页已选：[ 1 ]');
  await preview.getByRole('button', { name: '筛选类别', exact: true }).click();
  await (await categoryOptions(page)).getByRole('checkbox', { name: '出行', exact: true }).check();
  await expect(table).toHaveAttribute('aria-busy', 'false');
  await expect(pager.locator('[aria-current="page"]')).toHaveText('1');
  await expect(pager).toContainText('共 18 条');
  await expect(rows.first()).toContainText('商品 02');
  await expect(rows).toHaveCount(6);
  for (let index = 0; index < 6; index++) await expect(rows.nth(index)).toContainText('出行');
  await preview.getByRole('button', { name: '筛选类别', exact: true }).click();
  await pager.getByRole('button', { name: '下一页', exact: true }).click();
  await expect(table).toHaveAttribute('aria-busy', 'false');
  await expect(pager.locator('[aria-current="page"]')).toHaveText('2');
  await preview.locator('button[data-sort="stock"]').click();
  await expect(table).toHaveAttribute('aria-busy', 'false');
  await expect(pager.locator('[aria-current="page"]')).toHaveText('1');
  await expect(preview.locator('th[data-column="stock"]')).toHaveAttribute('aria-sort', 'ascending');
  await expect.poll(async () => {
    const stocks = await rows.evaluateAll(elements => elements.map(row => Number(row.querySelector('td:last-child')?.textContent?.trim())));
    return stocks.length === 6 && stocks.every((value, index) => index === 0 || value >= stocks[index - 1]!);
  }).toBe(true);
  await expect(preview).toContainText('跨页已选：[ 1 ]');
});

test('Table overflow tooltip opens for actual clipping and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto('/#/components/table');
  const preview = example(page, 'overflow');
  const text = preview.locator('.zt-table__overflow');
  await expect(text).toBeVisible();
  await expect.poll(() => text.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  const trigger = preview.locator('.zt-tooltip__trigger');
  await trigger.hover();
  const tooltip = page.getByRole('tooltip').filter({ hasText: '采用耐用的帆布材质' });
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText('采用耐用的帆布材质，适用于日常通勤、周末短途旅行与书籍收纳。');
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await trigger.focus();
  await expect(tooltip).toBeVisible();
  await trigger.press('Escape');
  await expect(tooltip).toBeHidden();
});

test('Form dynamically adds, removes and validates independent nested contacts', async ({ page }) => {
  await page.goto('/#/components/form');
  const preview = example(page, 'dynamic');
  await expect(preview.getByRole('textbox')).toHaveCount(2);
  await preview.getByRole('button', { name: '添加联系人', exact: true }).click();
  await expect(preview.getByRole('textbox')).toHaveCount(3);
  await preview.getByRole('textbox', { name: '联系人 1 邮箱', exact: true }).fill('invalid');
  await preview.getByRole('textbox', { name: '联系人 2 邮箱', exact: true }).fill('reader@example.com');
  await preview.getByRole('button', { name: '校验所有字段', exact: true }).click();
  await expect(preview.getByRole('status')).toHaveText('请检查城市与联系人邮箱');
  await preview.getByRole('button', { name: '删除联系人 1', exact: true }).click();
  await expect(preview.getByRole('textbox')).toHaveCount(2);
  await expect(preview.getByRole('textbox', { name: '联系人 1 邮箱', exact: true })).toHaveValue('reader@example.com');
  await preview.getByRole('button', { name: '校验所有字段', exact: true }).click();
  await expect(preview.getByRole('status')).toHaveText('所有字段验证通过');
});

test('Form server errors clear on edit and a corrected retry succeeds after busy state', async ({ page }) => {
  await page.goto('/#/components/form');
  const preview = example(page, 'servererrors');
  const input = preview.getByRole('textbox', { name: '账户名', exact: true });
  const submit = preview.getByRole('button', { name: '保存', exact: true });
  await input.fill('demo');
  await submit.click();
  await expect(preview.getByRole('button', { name: '正在提交', exact: true })).toBeDisabled();
  await expect(input).toBeDisabled();
  await expect(preview.getByRole('status')).toHaveText('服务器拒绝了本次提交');
  await expect(submit).toBeEnabled();
  await expect(preview.locator('.zt-form-item.is-error')).toHaveCount(1);
  await input.fill('reader');
  await expect(preview.locator('.zt-form-item.is-error')).toHaveCount(0);
  await submit.click();
  await expect(preview.getByRole('button', { name: '正在提交', exact: true })).toBeDisabled();
  await expect(preview.getByRole('status')).toHaveText('账户 reader 已保存（模拟请求）');
  await expect(input).toBeEnabled();
  await expect(submit).toBeEnabled();
});
