import { test, expect } from "@playwright/test";

for (const theme of ["浅色主题", "深色主题"]) {
  test(`Canvas links pass row/static parameters and block disabled clicks in ${theme}`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/#/components/vtable-grid");
    await page.getByRole("button", { name: theme, exact: true }).click();

    const example = page.locator("#example-links");
    const grid = example.locator(".zt-vtable-grid");
    const canvas = grid.locator("canvas").first();
    const status = example.getByRole("status");
    const disabledSwitch = example.getByRole("switch", { name: "禁用全部链接", exact: true });
    const actionField = "__zt_grid_actions__";
    await expect(canvas).toBeVisible();
    await canvas.scrollIntoViewIfNeeded();

    async function snapshot(field: string, row = 1) {
      return grid.evaluate(
        (element, { field, row }) => {
          let vm = (element as any).__vueParentComponent;
          while (vm && !vm.exposed?.getTableInstance) vm = vm.parent;
          const table = vm?.exposed.getTableInstance();
          if (!table) return null;
          const col = Array.from({ length: table.colCount }, (_, i) => i).find(
            (i) => table.getHeaderField(i, 0) === field,
          );
          if (col === undefined) return null;
          const rect = table.getCellRelativeRect(col, row);
          const texts: { text: string; fill: string; cursor?: string }[] = [];
          function walk(graphic: any) {
            if (graphic.attribute?.text != null)
              texts.push({
                text: String(graphic.attribute.text),
                fill: graphic.attribute.fill,
                cursor: graphic.attribute.cursor,
              });
            for (const child of graphic.getChildren?.() ?? []) walk(child);
          }
          walk(table.scenegraph.getCell(col, row));
          return {
            position: { x: rect.left + 22, y: rect.top + rect.height / 2 },
            texts,
          };
        },
        { field, row },
      );
    }

    async function clickCell(field: string, row = 1) {
      const cell = await snapshot(field, row);
      expect(
        cell,
        `Canvas cell ${field}, row ${row} must exist`,
      ).not.toBeNull();
      await canvas.click({ position: cell!.position });
    }

    await expect
      .poll(async () =>
        (await snapshot("name"))?.texts.map((text) => text.text).join(""),
      )
      .toContain("轻量背包");
    await expect
      .poll(async () =>
        (await snapshot("stock"))?.texts.map((text) => text.text).join(""),
      )
      .toContain("查看库存（18）");
    await expect
      .poll(async () =>
        (await snapshot(actionField))?.texts.map((text) => text.text).join(""),
      )
      .toContain("详情");
    expect(
      (await snapshot("name"))!.texts.find((text) => text.text === "轻量背包")
        ?.fill,
    ).toBe(theme === "深色主题" ? "#82abff" : "#245edb");

    await clickCell("name");
    await expect(status).toHaveText(
      '商品 P1001 · 字段 name · 第 1 行 · 参数 {"productCode":"P1001","source":"name"}',
    );
    await clickCell("stock");
    await expect(status).toHaveText(
      '商品 P1001 · 字段 stock · 第 1 行 · 参数 {"panel":"stock"}',
    );
    await clickCell(actionField, 3);
    const actionResult =
      '商品 P1003 · 字段 操作列 · 第 3 行 · 参数 {"id":"P1003","source":"action"}';
    await expect(status).toHaveText(actionResult);

    // The second row disables its name and action, while its stock link remains enabled.
    await clickCell("name", 2);
    await expect(status).toHaveText(actionResult);
    await clickCell(actionField, 2);
    await expect(status).toHaveText(actionResult);
    await clickCell("stock", 2);
    const stockResult =
      '商品 P1002 · 字段 stock · 第 2 行 · 参数 {"panel":"stock"}';
    await expect(status).toHaveText(stockResult);

    await expect(disabledSwitch).toHaveAttribute("aria-checked", "false");
    await disabledSwitch.click();
    await expect(disabledSwitch).toHaveAttribute("aria-checked", "true");
    await expect(grid).toHaveClass(/is-disabled/);
    await clickCell("name");
    await expect(status).toHaveText(stockResult);
    await clickCell("stock");
    await expect(status).toHaveText(stockResult);
    await clickCell(actionField, 3);
    await expect(status).toHaveText(stockResult);

    // Re-enabling must recreate interactive Canvas nodes, not just change the switch.
    await disabledSwitch.click();
    await expect(disabledSwitch).toHaveAttribute("aria-checked", "false");
    await expect(grid).not.toHaveClass(/is-disabled/);
    await clickCell("name", 3);
    await expect(status).toHaveText(
      '商品 P1003 · 字段 name · 第 3 行 · 参数 {"productCode":"P1003","source":"name"}',
    );
    await clickCell(actionField);
    await expect(status).toHaveText(
      '商品 P1001 · 字段 操作列 · 第 1 行 · 参数 {"id":"P1001","source":"action"}',
    );
    expect(errors).toEqual([]);
    await testInfo.attach(
      `canvas-links-${theme === "深色主题" ? "dark" : "light"}`,
      {
        body: await example.screenshot(),
        contentType: "image/png",
      },
    );
  });
}
