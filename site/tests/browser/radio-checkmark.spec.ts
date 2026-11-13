import { expect, test } from '@playwright/test';

test('the checkmark follows the selected radio without changing option widths', async ({ page }) => {
  await page.goto('/#/components/radio#example-segmented');
  const group = page.getByRole('radiogroup', { name: '对勾模式', exact: true });
  const week = group.getByRole('radio', { name: '周报' });
  const month = group.getByRole('radio', { name: '月报' });
  const marker = (name: string) => group.locator('.zt-radio__label').getByText(name, { exact: true })
    .evaluate(el => {
      const style = getComputedStyle(el, '::before');
      return [style.content, style.visibility];
    });
  const widths = () => group.locator('.zt-radio').evaluateAll(elements =>
    elements.map(el => el.getBoundingClientRect().width),
  );

  await expect(month).toBeChecked();
  await expect(page.getByRole('radiogroup', { name: '连体选项', exact: true }).getByRole('radio')).toHaveCount(5);
  await expect(group.getByRole('radio')).toHaveCount(5);
  const options = group.locator('.zt-radio');
  await expect(group).toHaveCSS('border-width', '1px');
  for (const option of await options.all()) {
    await expect(option).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(option).toHaveCSS('border-width', '0px');
  }
  await options.nth(1).hover();
  await expect(options.nth(1)).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(options.nth(1)).toHaveCSS('border-width', '0px');
  expect(await marker('月报')).toEqual(['""', 'visible']);
  expect(await marker('周报')).toEqual(['""', 'hidden']);
  const initialWidths = await widths();
  await month.press('ArrowLeft');
  await expect(week).toBeChecked();
  await expect(group.getByRole('radio', { name: '年报' })).toBeDisabled();
  expect(await marker('周报')).toEqual(['""', 'visible']);
  expect(await marker('月报')).toEqual(['""', 'hidden']);
  expect(await widths()).toEqual(initialWidths);
  await month.click();
  await expect(month).toBeChecked();
});

test('the checkmark group follows the configured corner radius', async ({ page }) => {
  await page.goto('/#/components/radio#example-segmented');
  const group = page.getByRole('radiogroup', { name: '对勾模式', exact: true });
  const slider = page.getByRole('slider', { name: '组件圆角' });

  await expect(group).toHaveCSS('border-top-left-radius', '11px');
  await slider.press('Home');
  await expect(group).toHaveCSS('border-top-left-radius', '0px');
  await slider.press('End');
  await expect(group).toHaveCSS('border-top-left-radius', '24px');
});

test('the borderless square style still selects exactly one of five options', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 740 });
  await page.goto('/#/components/radio#example-segmented');
  const group = page.getByRole('radiogroup', { name: '方框对勾模式' });
  const radios = group.getByRole('radio');
  await expect(radios).toHaveCount(5);
  await expect(group).toHaveCSS('border-width', '0px');
  await expect(group.getByRole('radio', { name: '月报' })).toBeChecked();
  await group.getByRole('radio', { name: '季报' }).click();
  await expect(group.getByRole('radio', { name: '季报' })).toBeChecked();
  await expect(group.getByRole('radio', { checked: true })).toHaveCount(1);
  const square = group.getByRole('radio', { name: '季报' }).locator('..').locator('.zt-radio__inner');
  await expect(square).toHaveCSS('border-top-left-radius', '4px');
  await expect(square).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(square).toHaveCSS('overflow', 'visible');
});
