import { test, expect } from "@playwright/test";

test("custom form queries, resets, and shares the grid loading state", async ({
  page,
}) => {
  await page.goto("/#/components/vtable-grid");
  const demo = page.locator("#example-formslots");
  const status = demo.locator("[data-query-status]");
  const keyword = demo.getByRole("textbox", { name: "商品名称或编码" });
  const submit = demo.locator('button[type="submit"]');
  const reset = demo.getByRole("button", { name: "重置条件", exact: true });
  const refresh = demo.getByRole("button", { name: "刷新商品", exact: true });

  await expect(status).toHaveText("已完成第 1 次查询，共 12 件商品");
  await expect(
    demo.getByRole("button", { name: "生成盘点清单（0）" }),
  ).toBeDisabled();
  await keyword.fill("衬衫");
  const loading = await submit.evaluate(async (element) => {
    (element as HTMLButtonElement).click();
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
    const form = element.closest("form")!;
    return {
      submitDisabled: (element as HTMLButtonElement).disabled,
      inputDisabled: form.querySelector("input")!.disabled,
      spinner: !!element.querySelector(".zt-button__spinner"),
    };
  });
  expect(loading).toEqual({
    submitDisabled: true,
    inputDisabled: true,
    spinner: true,
  });
  await expect(status).toHaveText("已完成第 2 次查询，共 1 件商品");
  await expect(demo).toContainText("已选 0 件 / 共 1 件商品");

  await keyword.fill("不存在的商品");
  await keyword.press("Enter");
  await expect(status).toHaveText("已完成第 3 次查询，共 0 件商品");
  await expect(demo).toContainText(
    "没有符合条件的商品，请调整名称或品类后重新查询",
  );

  await reset.click();
  await expect(keyword).toHaveValue("");
  await expect(status).toHaveText("已完成第 4 次查询，共 12 件商品");
  await refresh.click();
  await expect(status).toHaveText("已完成第 5 次查询，共 12 件商品");
  await expect(refresh).toBeEnabled();
});

test("custom batch action uses the Canvas checkbox selection and category filter", async ({
  page,
}) => {
  await page.goto("/#/components/vtable-grid");
  const demo = page.locator("#example-formslots");
  const status = demo.locator("[data-query-status]");
  await expect(status).toHaveText("已完成第 1 次查询，共 12 件商品");
  const canvas = demo.locator("canvas").first();
  await canvas.scrollIntoViewIfNeeded();
  const checkboxCenter = await demo
    .locator(".zt-vtable-grid")
    .evaluate((element) => {
      let component = (element as any).__vueParentComponent;
      while (component && !component.exposed?.getTableInstance)
        component = component.parent;
      const rect = component.exposed
        .getTableInstance()
        .getCellRelativeRect(0, 1);
      return { x: rect.left + 16, y: rect.top + rect.height / 2 };
    });
  await canvas.click({ position: checkboxCenter });
  const batch = demo.getByRole("button", { name: "生成盘点清单（1）" });
  await expect(batch).toBeEnabled();
  await expect(demo).toContainText("已选 1 件 / 共 12 件商品");
  await expect(demo).toContainText("勾选库存合计：128 件");
  await batch.click();
  await expect(demo.locator("[data-action-status]")).toHaveText(
    "已生成盘点清单：纯棉圆领短袖（共 1 件）",
  );

  await demo.getByRole("combobox", { name: "商品品类" }).click();
  await page.getByRole("option", { name: "配饰", exact: true }).click();
  await demo.getByRole("button", { name: "查询商品", exact: true }).click();
  await expect(status).toHaveText("已完成第 2 次查询，共 4 件商品");
  await demo.getByRole("button", { name: "重置条件", exact: true }).click();
  await expect(status).toHaveText("已完成第 3 次查询，共 12 件商品");
});

test("edit-actions slot saves, retries after failure and cancels drafts", async ({
  page,
}) => {
  await page.goto("/#/components/vtable-grid");
  const demo = page.locator("#example-editing");
  await expect(demo.locator("canvas").first()).toBeVisible();
  await demo.getByRole("button", { name: "新增草稿", exact: true }).click();
  const submit = demo.getByRole("button", { name: "提交修改", exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(submit).toBeDisabled();
  await expect(demo.locator('p[role="status"]')).toHaveText("模拟保存失败，草稿仍保留");
  await expect(submit).toBeEnabled();
  await demo
    .getByText("模拟保存失败（取消后可成功保存）", { exact: true })
    .click();
  await submit.click();
  await expect(submit).toHaveCount(0);
  await expect(demo.locator('p[role="status"]')).toContainText("提交：新增 1");
  await demo.getByRole("button", { name: "新增草稿", exact: true }).click();
  await demo.getByRole("button", { name: "撤销修改", exact: true }).click();
  await expect(submit).toHaveCount(0);
  await expect(demo.locator('p[role="status"]')).toHaveText("已恢复保存基线");
});
