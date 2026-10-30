import { test, expect } from "@playwright/test";
for (const theme of ["浅色主题", "深色主题"]) {
  test(`Canvas header/cell/actions slots draw and handle real pointer events in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/#/components/vtable-grid");
    await page.getByRole("button", { name: theme, exact: true }).click();
    const example = page.locator("#example-canvas");
    const grid = example.locator(".zt-vtable-grid");
    const canvas = grid.locator("canvas").first();
    await expect(canvas).toBeVisible();
    await canvas.scrollIntoViewIfNeeded();
    async function snapshot(field: string, row = 1) {
      return grid.evaluate(
        (element, { field, row }) => {
          let vm = (element as any).__vueParentComponent;
          while (vm && !vm.exposed?.getTableInstance) vm = vm.parent;
          const table = vm.exposed.getTableInstance();
          const col = Array.from({ length: table.colCount }, (_, i) => i).find(
            (i) => table.getHeaderField(i, 0) === field,
          )!;
          const rect = table.getCellRelativeRect(col, row);
          const texts: { text: string; fill: string }[] = [];
          function walk(graphic: any) {
            if (graphic.attribute?.text != null)
              texts.push({
                text: String(graphic.attribute.text),
                fill: graphic.attribute.fill,
              });
            for (const child of graphic.getChildren?.() ?? []) walk(child);
          }
          walk(table.scenegraph.getCell(col, row));
          return {
            position: { x: rect.left + 20, y: rect.top + rect.height / 2 },
            texts,
            stock: table.records[0].stock,
          };
        },
        { field, row },
      );
    }
    await expect
      .poll(async () =>
        (await snapshot("name", 0)).texts.map((text) => text.text).join(""),
      )
      .toContain("商品（点击查看）");
    await expect
      .poll(async () =>
        (await snapshot("name")).texts.map((text) => text.text).join(""),
      )
      .toContain("1. 无线键盘");
    const text = (await snapshot("name")).texts.find((text) =>
      text.text.includes("无线键盘"),
    )!;
    expect(text.fill).toBe(theme === "深色主题" ? "#e4eaf3" : "#202020");
    await canvas.click({ position: (await snapshot("name")).position });
    await expect(example.getByRole("status")).toContainText(
      "查看商品：无线键盘",
    );
    await canvas.click({
      position: (await snapshot("__zt_grid_actions__")).position,
    });
    await expect(example.getByRole("status")).toHaveText(
      "无线键盘 补货完成，库存 35",
    );
    await expect
      .poll(async () =>
        (await snapshot("stock")).texts.map((text) => text.text).join(""),
      )
      .toContain("有货 35");
    await example.getByText("禁用表格", { exact: true }).click();
    await expect(grid).toHaveClass(/is-disabled/);
    await canvas.click({
      position: (await snapshot("__zt_grid_actions__")).position,
    });
    expect((await snapshot("stock")).stock).toBe(35);
    await example.getByText("禁用表格", { exact: true }).click();
    await canvas.click({
      position: (await snapshot("__zt_grid_actions__")).position,
    });
    await expect(example.getByRole("status")).toHaveText(
      "无线键盘 补货完成，库存 45",
    );
    await page
      .getByRole("button", {
        name: theme === "深色主题" ? "浅色主题" : "深色主题",
        exact: true,
      })
      .click();
    await expect
      .poll(
        async () =>
          (await snapshot("name")).texts.find((text) =>
            text.text.includes("无线键盘"),
          )?.fill,
      )
      .toBe(theme === "深色主题" ? "#202020" : "#e4eaf3");
    expect((await snapshot("stock")).stock).toBe(45);
    await page.getByRole("button", { name: theme, exact: true }).click();
    await canvas.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `/tmp/zt-ui-canvas-slots-${theme === "深色主题" ? "dark" : "light"}.png`,
    });
  });
}

test("configured named field slots retain validation, reset and busy state", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/components/vtable-grid");
  const example = page.locator("#example-formfieldslots");
  const keyword = example.getByPlaceholder("输入商品关键词");
  const submit = example.locator('button[type="submit"]');
  await expect(example).toContainText("本次查询返回 2 件商品");
  await keyword.fill("");
  await submit.click();
  await expect(keyword).toHaveAttribute("aria-invalid", "true");
  await expect(
    page.getByRole("alert").filter({ hasText: "请输入商品关键词" }),
  ).toContainText("请输入商品关键词");
  await expect(example).toContainText("本次查询返回 2 件商品");
  await keyword.fill("长裤");
  await submit.click();
  await expect(submit).toBeDisabled();
  await expect(keyword).toBeDisabled();
  await expect(example).toContainText("本次查询返回 1 件商品");
  await example.getByRole("button", { name: "重置", exact: true }).click();
  await expect(keyword).toHaveValue("衬衫");
  await expect(example).toContainText("本次查询返回 2 件商品");
  await page.setViewportSize({ width: 320, height: 1000 });
  await example.scrollIntoViewIfNeeded();
  expect(
    (await example.locator("canvas").first().boundingBox())!.height,
  ).toBeGreaterThan(30);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
