import { test, expect } from "@playwright/test";
for (const theme of ["浅色主题", "深色主题"]) {
  test(`toolbar reflects refresh/export jobs and recovers after failure in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#/components/vtable-grid");
    await page.getByRole("button", { name: theme, exact: true }).click();
    const remote = page.locator("#example-remote");
    const refresh = remote.getByRole("button", { name: "刷新", exact: true });
    await expect(refresh).toBeEnabled();
    await refresh.scrollIntoViewIfNeeded();
    const refreshing = await refresh.evaluate(async (element) => {
      (element as HTMLButtonElement).click();
      await Promise.resolve();
      return {
        disabled: (element as HTMLButtonElement).disabled,
        animation: getComputedStyle(element.querySelector(".zt-icon-glyph")!)
          .animationName,
        exportDisabled: element
          .closest(".zt-vtable-grid")!
          .querySelector<HTMLButtonElement>('[aria-label="导出"]')!.disabled,
      };
    });
    expect(refreshing).toEqual({
      disabled: true,
      animation: "zt-icon-glyph-spin",
      exportDisabled: true,
    });
    await expect(refresh).toBeEnabled();
    await expect(refresh.locator(".zt-icon-glyph")).not.toHaveClass(/is-spin/);
    const transfer = page.locator("#example-importexport");
    const exportButton = transfer.getByRole("button", {
      name: "导出",
      exact: true,
    });
    const importButton = transfer.getByRole("button", {
      name: "导入",
      exact: true,
    });
    await transfer.getByText("模拟导出失败", { exact: true }).click();
    let downloads = 0;
    page.on("download", () => downloads++);
    await exportButton.scrollIntoViewIfNeeded();
    const exporting = await exportButton.evaluate(async (element) => {
      (element as HTMLButtonElement).click();
      await Promise.resolve();
      return {
        disabled: (element as HTMLButtonElement).disabled,
        busy: element.getAttribute("aria-busy"),
        text: element.textContent,
        spinner: !!element.querySelector(".zt-button__spinner"),
        importDisabled: element
          .closest(".zt-vtable-grid")!
          .querySelector<HTMLButtonElement>('[aria-label="导入"]')!.disabled,
      };
    });
    expect(exporting).toMatchObject({
      disabled: true,
      busy: "true",
      spinner: true,
      importDisabled: true,
    });
    expect(exporting.text).toContain("导出中");
    await exportButton.evaluate((button) =>
      button.dispatchEvent(new MouseEvent("click", { bubbles: true })),
    );
    await expect(transfer).toContainText("模拟导出失败，请重试");
    await expect(exportButton).toBeEnabled();
    await expect(importButton).toBeEnabled();
    expect(downloads).toBe(0);
    await transfer.getByText("模拟导出失败", { exact: true }).click();
    const download = page.waitForEvent("download");
    const retryDisabled = await exportButton.evaluate(async (element) => {
      (element as HTMLButtonElement).click();
      await Promise.resolve();
      return (element as HTMLButtonElement).disabled;
    });
    expect(retryDisabled).toBe(true);
    expect((await download).suggestedFilename()).toBe("inventory.json");
    await expect(exportButton).toBeEnabled();
    await expect(transfer).toContainText("已导出 JSON");
    expect(downloads).toBe(1);
  });
}
