import { expect, test } from '@playwright/test';

const fixturePath = `${process.env.GITHUB_ACTIONS ? '/zt-ui' : ''}/tests/fixtures/select-multiple.html`;

for (const virtual of [false, true]) {
  test(`multiple Select keeps scroll with recreated options (virtual: ${virtual})`, async ({ page }) => {
    await page.goto(`${fixturePath}?inline${virtual ? '&virtual' : ''}`);
    await page.getByRole('combobox', { name: '多选测试' }).click();

    const list = page.locator('.zt-select__list');
    await list.evaluate(element => { element.scrollTop = 350; });
    for (const [index, selected] of [[12, 'true'], [13, 'true'], [12, 'false']] as const) {
      const option = page.getByRole('option', { name: `测试选项编号 ${index}`, exact: true });
      await option.click();
      await expect(option).toHaveAttribute('aria-selected', selected);
      expect(await list.evaluate(element => element.scrollTop)).toBe(350);
    }
  });
}

test('multiple Select keeps the panel in place as selected tags wrap', async ({ page }) => {
  await page.goto(fixturePath);
  const field = page.getByRole('combobox', { name: '多选测试' });
  await field.click();
  const popup = page.getByRole('listbox');
  const top = (await popup.boundingBox())!.y;
  const fieldHeight = (await field.boundingBox())!.height;

  for (const index of [0, 1, 2]) {
    const option = popup.getByRole('option', { name: `测试选项编号 ${index}`, exact: true });
    await option.click();
    await expect(option).toHaveAttribute('aria-selected', 'true');
    const currentTop = await popup.evaluate(element => new Promise<number>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(element.getBoundingClientRect().top)));
    }));
    expect(currentTop).toBeCloseTo(top);
  }

  await field.press('Escape');
  await expect(popup).toHaveCount(0);
  expect((await field.boundingBox())!.height).toBeGreaterThan(fieldHeight);
});
