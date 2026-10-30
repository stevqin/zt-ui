import { test, expect } from "@playwright/test";
for (const id of ["popover", "popconfirm", "tooltip"]) {
  test(`${id}: anchor hugs its real button in a grid and follows page scroll`, async ({
    page,
  }) => {
    await page.goto(`/#/components/${id}`);
    const reference = page
        .locator(".example-preview .zt-popover__reference")
        .first(),
      button = reference.locator("button").first();
    await button.scrollIntoViewIfNeeded();
    const target = await button.boundingBox(),
      anchor = await reference.boundingBox();
    expect(Math.abs(anchor!.width - target!.width)).toBeLessThan(1);
    if (id === "tooltip") await button.hover();
    else await button.click();
    const popup = page.locator("body>.zt-popover").last();
    await expect(popup).toBeVisible();
    async function aligned() {
      const b = (await button.boundingBox())!,
        p = (await popup.boundingBox())!;
      return id === "popover"
        ? Math.abs(p.x - b.x)
        : Math.abs(p.x + p.width / 2 - b.x - b.width / 2);
    }
    await expect.poll(aligned).toBeLessThan(2);
    await page.evaluate(() => window.scrollBy(0, 65));
    await expect.poll(aligned).toBeLessThan(2);
    await expect.poll(async () => {
      const b = (await button.boundingBox())!, p = (await popup.boundingBox())!;
      return Math.abs((id === "popover" ? p.y - b.y - b.height : b.y - p.y - p.height) - 8);
    }).toBeLessThan(2);
  });
}
test("manual right popover stays beside the button rather than the empty grid track", async ({
  page,
}) => {
  await page.goto("/#/components/popover");
  const example = page.locator(".example-section").nth(1),
    button = example.getByRole("button", { name: "切换提示", exact: true });
  await button.click();
  const popup = page.locator("body>.zt-popover").last();
  await expect(popup).toBeVisible();
  await expect
    .poll(async () => {
      const b = (await button.boundingBox())!,
        p = (await popup.boundingBox())!;
      return Math.abs(p.x - b.x - b.width - 8);
    })
    .toBeLessThan(2);
});
test("slotted dropdown button has one control and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/#/components/dropdown");
  const preview = page.locator(".example-preview").first();
  await expect(preview.locator("button")).toHaveCount(1);
  const button = preview.getByRole("button", { name: "更多操作", exact: true });
  const arrow = button.locator('.zt-dropdown__arrow');
  await expect(arrow.locator('svg')).toHaveCount(1);
  const buttonBox = (await button.boundingBox())!, arrowBox = (await arrow.boundingBox())!;
  expect(Math.abs(buttonBox.y + buttonBox.height / 2 - arrowBox.y - arrowBox.height / 2)).toBeLessThan(1);
  await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await expect(button).toHaveAttribute("aria-haspopup", "menu");
  await button.focus();
  await button.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "操作菜单" });
  await expect(menu).toBeVisible();
  await expect(arrow).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
  await expect(menu.getByRole("menuitem").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(arrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await expect(button).toBeFocused();
  await button.click();
  await menu.getByRole("menuitem", { name: "复制", exact: true }).click();
  await expect(page.locator(".example-section").first()).toContainText(
    "命令：copy",
  );
  await expect(button).toBeFocused();
});

for (const [id, selector] of [
  ["autocomplete", ".zt-entry"],
  ["mention", ".zt-mention"],
  ["time-picker", ".zt-time-picker"],
] as const) {
  test(`${id}: field reference retains the full control width`, async ({
    page,
  }) => {
    await page.goto(`/#/components/${id}`);
    const field = page.locator(`.example-preview ${selector}`).first();
    const reference = field.locator(".zt-popover__reference").first();
    await expect(reference).toBeVisible();
    const outer = (await field.boundingBox())!;
    const inner = (await reference.boundingBox())!;
    expect(Math.abs(inner.width - outer.width)).toBeLessThan(1);
  });
}
