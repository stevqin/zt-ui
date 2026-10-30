import { expect, test } from '@playwright/test';

test('API keeps compact Props names and independent business contracts', async ({ page }) => {
  for (const [route, component, alias, retained] of [
    ['sku-select', 'ZtSkuSelect', 'ZtSkuSelectProps', 'ZtSkuProduct'],
    ['vtable-grid', 'ZtVTableGrid', 'ZtVTableGridProps', 'ZtVTableGridEventProps'],
    ['zt-alert-message-box', 'ZtMessageBox', 'MessageBoxOptions', 'MessageBoxButtonOptions'],
  ]) {
    await page.goto(`/#/components/${route}#api`);
    await expect(page.locator('#api table table')).toHaveCount(0);
    const props = page.locator(`#api-${component}-props`);
    await expect(props.locator('h4 code')).toHaveText(alias);
    const types = page.locator(`#api-${component}-types`);
    await expect(types.locator(':scope > .api-table-wrap > table > tbody > tr > td:first-child > code').filter({ hasText: new RegExp(`^${alias}$`) })).toHaveCount(0);
    if (route === 'sku-select') {
      await expect(page.locator(`#api-${component}-data-structures`).getByRole('heading', { name: retained, exact: true })).toHaveCount(1);
    } else {
      await expect(types.locator(':scope > .api-table-wrap > table > tbody > tr > td:first-child > code').filter({ hasText: new RegExp(`^${retained}$`) })).toHaveCount(1);
    }
  }
  await page.goto('/#/components/loading#api');
  await expect(page.locator('#api-ZtLoading-props h4 code')).toHaveText('ZtLoadingProps');
  await expect(page.locator('#api-ZtLoading-types')).toHaveCount(0);
});
