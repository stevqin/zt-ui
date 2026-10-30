import { test, expect } from "@playwright/test";
for (const theme of ["浅色主题", "深色主题"]) {
  test(`import dialog displays its format icon in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/#/components/vtable-grid");
    await page.getByRole("button", { name: theme, exact: true }).click();
    const demo = page.locator("#example-importformats");
    for (const format of ["csv", "xls", "xlsx"]) {
      await demo.getByRole("combobox", { name: "导入格式" }).click();
      await page
        .getByRole("option", { name: format.toUpperCase(), exact: true })
        .click();
      await demo
        .getByRole("button", { name: "预览导入对话框", exact: true })
        .click();
      const dialog = page.getByRole("dialog", {
        name: `导入 ${format.toUpperCase()} 文件`,
        exact: true,
      });
      await expect(dialog).toBeVisible();
      const icon = dialog.locator(".zt-vtable-grid-import__file-mark");
      const heading = dialog.getByRole("heading", {
        name: `导入 ${format.toUpperCase()} 文件`,
        exact: true,
      });
      await expect(icon).toHaveAttribute("data-format", format);
      await expect(icon.locator("svg")).toBeVisible();
      await expect(icon).toHaveText(format.toUpperCase());
      const i = (await icon.boundingBox())!,
        h = (await heading.boundingBox())!;
      expect(i.x).toBeGreaterThanOrEqual(h.x);
      expect(Math.abs(i.y + i.height / 2 - h.y - h.height / 2)).toBeLessThan(1);
      await dialog
        .locator("input[type=file]")
        .setInputFiles({
          name: `inventory.${format}`,
          mimeType: "application/octet-stream",
          buffer: Buffer.from("name,stock\n商品,1"),
        });
      await expect(dialog.locator("strong")).toHaveText(`inventory.${format}`);
      await expect(
        dialog.getByRole("button", { name: "开始导入", exact: true }),
      ).toBeEnabled();
      await dialog
        .getByRole("button", { name: "开始导入", exact: true })
        .click();
      await expect(dialog).toHaveCount(0);
      await expect(demo.getByRole("status")).toHaveText(
        `已收到文件：inventory.${format}`,
      );
    }
    await page.setViewportSize({ width: 320, height: 850 });
    await demo
      .getByRole("button", { name: "预览导入对话框", exact: true })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "导入 XLSX 文件",
      exact: true,
    });
    await expect(
      dialog.locator(".zt-vtable-grid-import__file-mark"),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/zt-ui-import-header-${theme === "深色主题" ? "dark" : "light"}-320.png`,
    });
    await dialog.getByRole("button", { name: "取消", exact: true }).click();
  });
}
