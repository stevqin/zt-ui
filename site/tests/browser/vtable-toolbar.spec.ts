import { test, expect } from "@playwright/test";
for (const theme of ["浅色主题", "深色主题"]) {
  test(`grid toolbar stays compact and usable in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/#/components/vtable-grid");
    await page.getByRole("button", { name: theme, exact: true }).click();
    const tools = page.getByRole("group", {
      name: "演示外观设置",
      exact: true,
    });
    const grid = page.locator("#example-basic .zt-vtable-grid");
    await expect(grid.locator("canvas").first()).toBeVisible();
    const settings = grid.getByRole("button", { name: "列设置", exact: true });
    const exportButton = grid.getByRole("button", {
      name: "导出",
      exact: true,
    });
    for (const size of ["mini", "small", "default", "medium", "large"]) {
      await tools.getByRole("combobox", { name: "组件尺寸" }).click();
      await page.getByRole("option", { name: size, exact: true }).click();
      const box = (await settings.boundingBox())!;
      expect(Math.abs(box.width - box.height)).toBeLessThan(1);
      await expect(settings).toHaveCSS("box-shadow", "none");
      await expect(exportButton).toHaveCSS("box-shadow", "none");
      await expect(exportButton).toHaveCSS("border-top-width", "0px");
      await settings.click();
      await expect(
        grid.getByRole("dialog", { name: "列设置", exact: true }),
      ).toBeVisible();
      await expect(settings).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Escape");
      await expect(settings).toHaveAttribute("aria-expanded", "false");
      await expect(settings).toBeFocused();
    }
    await grid.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `/tmp/zt-ui-grid-toolbar-${theme === "深色主题" ? "dark" : "light"}.png`,
    });
    const transfer = page
      .locator(".example-section")
      .filter({ hasText: "导入弹窗与外部导出" });
    const importButton = transfer.getByRole("button", {
      name: "导入",
      exact: true,
    });
    await importButton.click();
    const dialog = page.getByRole("dialog", {
      name: "导入库存 CSV",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "取消", exact: true }).click();
    const download = page.waitForEvent("download");
    await transfer.getByRole("button", { name: "导出", exact: true }).click();
    expect((await download).suggestedFilename()).toMatch(/\.json$/);
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await grid.scrollIntoViewIfNeeded();
      const bounds = (await grid.boundingBox())!;
      for (const button of await grid
        .locator(".zt-vtable-grid__toolbar button")
        .all()) {
        const box = (await button.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(bounds.x);
        expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width);
      }
      await page.screenshot({
        path: `/tmp/zt-ui-grid-toolbar-${theme === "深色主题" ? "dark" : "light"}-${width}.png`,
      });
    }
  });
}
