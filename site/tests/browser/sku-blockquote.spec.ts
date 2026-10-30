import { expect, test, type Locator, type Page } from '@playwright/test';

function exampleWithButton(page: Page, name: string) {
  return page.locator('.example-preview').filter({
    has: page.getByRole('button', { name, exact: true }),
  });
}

async function expectFitsViewport(page: Page, panel: Locator) {
  await expect(panel).toBeVisible();
  const bounds = await panel.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

for (const width of [1440, 390]) {
  test(`SKU basic selects one size, changes SKC images and resets across products at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/sku-select');
    const demo = page.locator('[data-demo="sku-basic"]');
    const panel = demo.locator('.zt-sku-select');
    await expect(demo).toContainText('SKU：尚未选择');
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);

    const sky = panel.getByRole('button', { name: '雾蓝', exact: true });
    await expect(sky).toHaveAttribute('aria-pressed', 'true');
    await expect(sky).toHaveAttribute('data-skc', 'TEE-SKY');
    await expect(panel.locator('[data-sku]')).toHaveCount(3);
    await sky.focus();
    await sky.press('Enter');
    await expect(sky).toHaveAttribute('aria-pressed', 'true');
    const image = panel.locator('.zt-sku-select__preview img');
    await expect(image).toHaveAttribute('alt', '日常短袖 雾蓝');
    if (width > 640) await expect(image).toBeVisible();
    else await expect(panel.locator('.zt-sku-select__preview')).toBeHidden();
    const thumbnail = sky.locator('.zt-sku-select__color-image');
    await expect(thumbnail).toBeVisible();
    await expect.poll(() => thumbnail.locator('img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    const skySource = await image.getAttribute('src');
    const small = panel.getByRole('button', { name: 'S', exact: true });
    await small.focus();
    await small.press('Space');
    await expect(small).toHaveAttribute('aria-pressed', 'true');
    await expect(demo).toContainText('SKU：TEE-SKY-S');
    await panel.screenshot({ path: `/tmp/zt-sku-panel-${width}.png` });
    await expect(demo).toContainText('规格事件：TEE-01 / TEE-SKY / TEE-SKY-S · 雾蓝 · S');

    await panel.getByRole('button', { name: '浅沙', exact: true }).click();
    await expect(demo).toContainText('SKU：尚未选择');
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await expect(image).toHaveAttribute('alt', '日常短袖 浅沙');
    await expect.poll(() => image.getAttribute('src')).not.toBe(skySource);
    await panel.getByRole('button', { name: 'M', exact: true }).click();
    await expect(demo).toContainText('SKU：TEE-SAND-M');

    await expect(panel.getByRole('button', { name: '切换商品', exact: true })).toHaveCount(0);
    await expect(panel.getByRole('combobox')).toHaveCount(0);
    await demo.getByRole('combobox', { name: '演示商品', exact: true }).click();
    await page.getByRole('option', { name: '轻薄上衣', exact: true }).click();
    await expect(panel.locator('[data-product-no]')).toHaveCount(0);
    await expect(panel.locator('.zt-sku-select__title')).toHaveText('轻薄上衣');
    await expect(demo).toContainText('SKU：尚未选择');
    await expect(panel.locator('[data-skc="TOP-SAGE"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('[data-sku]')).toHaveCount(2);
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await expect(image).toHaveAttribute('alt', '轻薄上衣 鼠尾草绿');
    await panel.getByRole('button', { name: '鼠尾草绿', exact: true }).click();
    await panel.getByRole('button', { name: 'M', exact: true }).click();
    await expect(demo).toContainText('SKU：TOP-SAGE-M');
    await expect(image).toHaveAttribute('alt', '轻薄上衣 鼠尾草绿');
    await panel.getByRole('button', { name: '清空选择', exact: true }).click();
    await expect(demo).toContainText('SKU：尚未选择');
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await expect(panel.locator('[data-skc="TOP-SAGE"]')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page, panel);
  });

  test(`SKU disabled colors, unavailable sizes and whole-panel disabled prevent changes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/sku-select');
    const demo = exampleWithButton(page, '浅灰（暂不可选）');
    const panel = demo.locator('.zt-sku-select');
    const grey = panel.getByRole('button', { name: '浅灰（暂不可选）', exact: true });
    const white = panel.getByRole('button', { name: '白色（尺码售罄）', exact: true });
    const small = panel.getByRole('button', { name: 'S', exact: true });
    const medium = panel.getByRole('button', { name: 'M', exact: true });
    const large = panel.getByRole('button', { name: 'L', exact: true });
    await expect(panel.getByRole('combobox')).toHaveCount(0);
    for (const button of [grey, white, small]) {
      await expect(button).toBeDisabled();
      await button.click({ force: true });
    }
    await expect(medium).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.getByRole('button', { name: '浅蓝', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(grey).toHaveAttribute('aria-pressed', 'false');
    await expect(white).toHaveAttribute('aria-pressed', 'false');
    await large.click();
    await expect(large).toHaveAttribute('aria-pressed', 'true');

    const disabled = demo.getByRole('switch', { name: '禁用整个选择面板', exact: true });
    await disabled.click();
    await expect(disabled).toHaveAttribute('aria-checked', 'true');
    for (const button of [medium, large, panel.getByRole('button', { name: '清空选择', exact: true })]) {
      await expect(button).toBeDisabled();
      await button.click({ force: true });
    }
    await expect(large).toHaveAttribute('aria-pressed', 'true');
    await disabled.click();
    await medium.click();
    await expect(medium).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page, panel);
  });

  test(`SKU controlled values echo without change events and unavailable selections clear at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/sku-select');
    const demo = exampleWithButton(page, '外部设为墨色 L');
    const panel = demo.locator('.zt-sku-select');
    await expect(demo).toContainText('受控值：KNIT-OAT-M；最近一次 change：等待操作');
    await expect(panel.locator('[data-sku="KNIT-OAT-M"]')).toHaveAttribute('aria-pressed', 'true');
    await demo.getByRole('button', { name: '外部设为墨色 L', exact: true }).click();
    await expect(panel.locator('[data-color="ink"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('[data-sku="KNIT-INK-L"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(demo).toContainText('受控值：KNIT-INK-L；最近一次 change：等待操作');
    await demo.getByRole('button', { name: '外部清空', exact: true }).click();
    await expect(demo).toContainText('受控值：null；最近一次 change：等待操作');
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);

    await panel.getByRole('button', { name: '燕麦色', exact: true }).click();
    await panel.getByRole('button', { name: 'M', exact: true }).click();
    await expect(demo).toContainText('受控值：KNIT-OAT-M；最近一次 change：针织上衣 · 燕麦色 · M');
    await expect(panel.locator('.zt-sku-select__summary')).toHaveText('当前规格：燕麦色 / M');
    await demo.getByRole('button', { name: '切换燕麦色 M 可用状态', exact: true }).click();
    await expect(demo).toContainText('受控值：null；最近一次 change：选择已清空');
    await expect(panel.locator('[data-sku="KNIT-OAT-M"]')).toBeDisabled();
    await expect(panel.locator('[data-sku][aria-pressed="true"]')).toHaveCount(0);
    await expect(panel.locator('.zt-sku-select__summary')).toHaveText('等待选择规格');
    await demo.getByRole('button', { name: '切换燕麦色 M 可用状态', exact: true }).click();
    await panel.getByRole('button', { name: 'M', exact: true }).click();
    await expect(demo).toContainText('受控值：KNIT-OAT-M');
    await expectFitsViewport(page, panel);
  });

  test(`Blockquote keeps native citation semantics, status variants and nested content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/components/blockquote');
    const basic = page.locator('.example-preview blockquote[cite="https://www.w3.org/TR/WCAG22/"]');
    await expect(basic).toBeVisible();
    await expect(basic.locator('.zt-blockquote__title')).toHaveText('阅读笔记');
    await expect(basic).toContainText('内容应当可以被感知、操作和理解');
    await expect(basic.locator('footer')).toHaveText('摘录整理：Web 内容无障碍指南阅读笔记');
    await expect(basic).toHaveCSS('border-inline-start-width', '4px');
    const variants = page.locator('.example-preview').filter({ hasText: '报表按订单完成时间统计' });
    for (const status of ['primary', 'success', 'warning', 'danger', 'info', 'default']) {
      const quote = variants.locator(`blockquote.zt-blockquote--status-${status}`);
      await expect(quote).toHaveCount(1);
      const expected = await quote.evaluate((element, variant) => {
        const probe = document.createElement('span');
        probe.style.backgroundColor = `var(--glass-${variant === 'primary' ? 'accent' : variant}-soft)`;
        probe.style.color = `var(--glass-${variant === 'primary' ? 'accent' : `${variant}-ink`})`;
        element.append(probe);
        const colors = {
          background: getComputedStyle(probe).backgroundColor,
          border: getComputedStyle(probe).color,
        };
        probe.remove();
        return colors;
      }, status);
      await expect(quote).toHaveCSS('background-color', expected.background);
      await expect(quote).toHaveCSS('border-inline-start-color', expected.border);
    }

    const outer = page.locator('.example-preview blockquote.zt-blockquote--large');
    const nested = outer.locator('blockquote');
    await expect(outer.locator(':scope > .zt-blockquote__title')).toHaveText('交付要求 第 2 版');
    await expect(nested).toHaveCount(1);
    await expect(nested).toHaveClass(/zt-blockquote--status-info/);
    await expect(nested).toHaveClass(/zt-blockquote--small/);
    await expect(nested.locator('.zt-blockquote__title')).toHaveText('附注');
    await expect(nested).toContainText('只记录与本次交付有关的修改');
    await expect(outer.locator(':scope > footer').getByRole('link', { name: '查看公开规范目录', exact: true })).toHaveAttribute('href', 'https://www.w3.org/TR/');
    await expectFitsViewport(page, outer);
    await expectFitsViewport(page, nested);
  });
}
