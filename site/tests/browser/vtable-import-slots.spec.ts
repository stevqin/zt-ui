import { expect, test } from "@playwright/test";

test("custom file slot keeps the picker, validation, template and retry workflow", async ({
  page,
}) => {
  await page.goto("/#/components/vtable-grid");
  const demo = page.locator("#example-importslots");
  await demo
    .getByRole("button", { name: "自定义文件信息", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const picker = dialog.locator("input[type=file]");
  const submit = dialog.getByRole("button", { name: "开始导入", exact: true });
  await expect(dialog.locator(".zt-vtable-grid-import__file-mark")).toHaveText(
    "CSV",
  );
  await expect(submit).toBeDisabled();

  const downloadPromise = page.waitForEvent("download");
  await dialog
    .getByRole("button", { name: "下载商品模板", exact: true })
    .click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "product-stock-template.csv",
  );
  await picker.setInputFiles({
    name: "products.xlsx",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("invalid"),
  });
  await expect(dialog.getByRole("alert")).toContainText("文件未被接收");
  await expect(submit).toBeDisabled();

  await picker.setInputFiles({
    name: "products.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,stock\n无线键盘,18\n桌面支架,0"),
  });
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await expect(
    dialog.getByRole("button", { name: "重新选择", exact: true }),
  ).toBeVisible();
  await dialog.getByText("模拟导入失败", { exact: true }).click();
  await submit.click();
  await expect(
    dialog.getByRole("button", { name: "取消导入", exact: true }),
  ).toBeDisabled();
  await expect(picker).toBeDisabled();
  await expect(dialog.getByRole("alert")).toContainText("取消“模拟导入失败”后");
  await expect(dialog.locator("strong")).toHaveText("products.csv");
  await dialog.getByText("模拟导入失败", { exact: true }).click();
  await dialog.getByRole("button", { name: "重试导入", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(demo).toContainText("已导入 1 行，跳过 1 行零库存商品");
});

test("custom upload slot supports selection, removal and drag/drop in the guarded container", async ({
  page,
}) => {
  await page.goto("/#/components/vtable-grid");
  const demo = page.locator("#example-importslots");
  await demo
    .getByRole("button", { name: "自定义上传区域", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const picker = dialog.locator("input[type=file]");
  const chooserPromise = page.waitForEvent("filechooser");
  await dialog
    .getByRole("button", { name: "选择 CSV 文件", exact: true })
    .click();
  await (
    await chooserPromise
  ).setFiles({
    name: "first.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,stock\n便携鼠标,8"),
  });
  await expect(dialog.locator("strong")).toHaveText("first.csv");
  await expect(
    dialog.getByRole("button", { name: "重新选择", exact: true }),
  ).toHaveCount(0);
  await dialog.getByRole("button", { name: "移除文件", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "开始导入", exact: true }),
  ).toBeDisabled();
  const transfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(
      new File(["name,stock\n桌面支架,7"], "dropped.csv", { type: "text/csv" }),
    );
    return data;
  });
  await dialog
    .locator("[data-dropzone]")
    .dispatchEvent("drop", { dataTransfer: transfer });
  await expect(dialog.locator("strong")).toHaveText("dropped.csv");
  await expect(picker).toHaveAttribute("accept", ".csv");
  await dialog.getByRole("button", { name: "开始导入", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(demo).toContainText("已导入 1 行，跳过 0 行零库存商品");
  await page.setViewportSize({ width: 320, height: 850 });
  await demo.getByRole('button', { name: '自定义文件信息', exact: true }).click();
  const templateButton = dialog.getByRole('button', { name: '下载商品模板', exact: true });
  expect(await templateButton.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    return range.getClientRects().length;
  })).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await dialog.getByRole('button', { name: '取消导入', exact: true }).click();
});
