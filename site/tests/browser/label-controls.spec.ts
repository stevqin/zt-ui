import { expect, test, type Locator, type Page } from '@playwright/test';

const fixture = `${process.env.GITHUB_ACTIONS ? '/zt-ui' : ''}/tests/fixtures/label-controls.html`;
const selected = ['hangzhou', 'shanghai', 'ningbo'];

async function labelControls(label: Locator) {
  return label.evaluate((element: HTMLLabelElement) => element.control?.className);
}

async function captureClicks(page: Page) {
  return page.evaluateHandle(() => {
    const targets: string[] = [];
    document.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement) {
        targets.push(event.target.closest('button, input')?.className ?? event.target.className);
      }
    }, true);
    return targets;
  });
}

async function center(locator: Locator) {
  const box = (await locator.boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

for (const context of ['implicit', 'popover', 'form', 'explicit'] as const) {
  test(`multiple Select labels only activate the combobox (${context})`, async ({ page }) => {
    await page.goto(`${fixture}?context=${context}`);
    if (context === 'popover') await page.getByRole('button', { name: '打开字段弹层' }).click();

    const label = context === 'form' ? page.locator('.zt-form-item__label') : page.getByTestId('select-label');
    const title = label.getByText('多选字段', { exact: true });
    const field = page.locator('.zt-select__input');
    const value = page.getByTestId('selection');
    const events = page.getByTestId('select-events');
    const search = page.getByRole('combobox', { name: '搜索选项', exact: true });
    const firstRemove = page.getByRole('button', { name: '移除杭州', exact: true });
    const clicks = await captureClicks(page);

    await expect(firstRemove).toBeVisible();
    await expect(field).toHaveAccessibleName(/多选字段/);
    expect(await labelControls(label)).toBe('zt-select__input');

    await title.hover();
    expect(await firstRemove.evaluate(button => button.matches(':hover'))).toBe(false);
    await title.click();
    await expect(search).toBeFocused();
    expect((await clicks.jsonValue()).filter(target => target === 'zt-select__input')).toHaveLength(1);
    await expect(value).toHaveText(JSON.stringify(selected));
    await search.press('Escape');

    // The visible text is pointer-transparent to the tags container.
    const chipText = await center(page.locator('.zt-select__tag-label').first());
    await page.mouse.move(chipText.x, chipText.y);
    expect(await firstRemove.evaluate(button => button.matches(':hover'))).toBe(false);
    await page.mouse.click(chipText.x, chipText.y);
    await expect(search).toBeFocused();
    expect((await clicks.jsonValue()).filter(target => target === 'zt-select__input')).toHaveLength(1);
    await expect(value).toHaveText(JSON.stringify(selected));
    await search.press('Escape');

    const box = (await field.boundingBox())!;
    await page.mouse.click(box.x + box.width - 12, box.y + box.height / 2);
    await expect(search).toBeFocused();
    await expect(value).toHaveText(JSON.stringify(selected));
    expect(await clicks.jsonValue()).not.toContain('zt-select__tag-remove');
    await expect(events).toHaveText('[]');
    await search.press('Escape');

    const shanghai = page.getByRole('button', { name: '移除上海', exact: true });
    await shanghai.hover();
    expect(await shanghai.evaluate(button => button.matches(':hover'))).toBe(true);
    await shanghai.click();
    await expect(value).toHaveText('["hangzhou","ningbo"]');
    await firstRemove.press(context === 'popover' ? 'Enter' : 'Space');
    await expect(value).toHaveText('["ningbo"]');
    await expect(field).toBeFocused();
    await expect(events).toHaveText(JSON.stringify([
      ['remove-tag', 'shanghai'],
      ['update:modelValue', ['hangzhou', 'ningbo']],
      ['change', ['hangzhou', 'ningbo']],
      ['remove-tag', 'hangzhou'],
      ['update:modelValue', ['ningbo']],
      ['change', ['ningbo']],
    ]));
  });
}

test('a multiple Select inside an implicit label still supports search and keyboard selection', async ({ page }) => {
  await page.goto(fixture);
  await page.getByText('多选字段', { exact: true }).click();
  const search = page.getByRole('combobox', { name: '搜索选项', exact: true });
  await search.fill('苏');
  const option = page.getByRole('option', { name: '苏州', exact: true });
  await expect(option).toHaveAttribute('aria-selected', 'false');
  await search.press('ArrowDown');
  await search.press('Enter');
  await expect(option).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('selection')).toHaveText(JSON.stringify([...selected, 'suzhou']));
  await option.click();
  await expect(option).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByTestId('selection')).toHaveText(JSON.stringify(selected));
});

test('clicking tag text only toggles a non-filterable Select once', async ({ page }) => {
  await page.goto(`${fixture}?plain`);
  const field = page.getByRole('combobox', { name: /多选字段/ });
  await expect(field).toBeVisible();
  const text = await center(page.locator('.zt-select__tag-label').first());
  await page.mouse.click(text.x, text.y);
  await expect(field).toHaveAttribute('aria-expanded', 'true');
  await page.mouse.click(text.x, text.y);
  await expect(field).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('selection')).toHaveText(JSON.stringify(selected));
  await expect(page.getByTestId('select-events')).toHaveText('[]');
  await field.press('Tab');
  await expect(page.getByRole('button', { name: '移除杭州', exact: true })).toBeFocused();
});

for (const position of ['default', 'left', 'right'] as const) {
  test(`InputNumber's implicit label activates the input and preserves the ${position} stepper layout`, async ({ page }) => {
    await page.goto(`${fixture}?context=number&position=${position}`);
    const label = page.getByTestId('number-label');
    const title = label.getByText('补货数量', { exact: true });
    const input = page.getByRole('spinbutton');
    const decrease = page.getByRole('button', { name: '减少数值', exact: true });
    const increase = page.getByRole('button', { name: '增加数值', exact: true });
    const quantity = page.getByTestId('quantity');
    const clicks = await captureClicks(page);

    await expect(input).toBeVisible();
    expect(await labelControls(label)).toBe('zt-input-number__inner');
    await expect(input).toHaveAccessibleName(/补货数量/);
    await title.hover();
    expect(await decrease.evaluate(button => button.matches(':hover'))).toBe(false);
    await title.click();
    await expect(input).toBeFocused();
    await expect(quantity).toHaveText('5');
    expect(await clicks.jsonValue()).toEqual(['', 'zt-input-number__inner']);

    const [field, minus, plus] = await Promise.all([input, decrease, increase].map(center));
    if (position === 'default') {
      expect(minus.x).toBeLessThan(field.x);
      expect(plus.x).toBeGreaterThan(field.x);
    } else {
      expect(minus.x).toBeCloseTo(plus.x, 0);
      expect(minus.y).toBeGreaterThan(plus.y);
      if (position === 'left') expect(minus.x).toBeLessThan(field.x);
      else expect(minus.x).toBeGreaterThan(field.x);
    }

    await decrease.click();
    await expect(quantity).toHaveText('4');
    await increase.click();
    await expect(quantity).toHaveText('5');
    await input.press('ArrowDown');
    await expect(quantity).toHaveText('4');
  });
}

test('InputNumber without steppers still fits its input across the control', async ({ page }) => {
  await page.goto(`${fixture}?context=number&no-controls&position=left`);
  const label = page.getByTestId('number-label');
  const input = page.getByRole('spinbutton', { name: '补货数量' });
  await expect(input).toBeVisible();
  expect(await labelControls(label)).toBe('zt-input-number__inner');
  const control = (await label.locator('.zt-input-number').boundingBox())!;
  const field = (await input.boundingBox())!;
  expect(field.width).toBeCloseTo(control.width - 2, 0);
  await label.getByText('补货数量', { exact: true }).click();
  await expect(input).toBeFocused();
  await expect(page.getByTestId('quantity')).toHaveText('5');
});
