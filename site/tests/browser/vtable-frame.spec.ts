import { test, expect } from "@playwright/test";
test("VTable shares the grid frame across themes and global corner radii", async ({
  page,
}) => {
  await page.goto("/#/components/vtable-grid");
  const grid = page.locator("#example-basic .zt-vtable-grid");
  await expect(grid.locator("canvas").first()).toBeVisible();
  const radius = page.getByRole("slider", { name: "组件圆角" });
  async function nativeFrame() {
    return grid.evaluate((element) => {
      let component = (element as any).__vueParentComponent;
      while (component && !component.exposed?.getTableInstance)
        component = component.parent;
      const table = component?.exposed?.getTableInstance();
      return {
        frame: table?.theme?.frameStyle,
        records: table?.records?.filter(
          (record: any) => !record.__zt_grid_summary__,
        ).length,
        cellBorders: table?.theme?.bodyStyle?.borderLineWidth,
      };
    });
  }
  for (const theme of ["浅色主题", "深色主题"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    for (const key of ["Home", "End"]) {
      await radius.press(key);
      await expect.poll(nativeFrame).toMatchObject({
        frame: { cornerRadius: 0, borderLineWidth: 0, shadowBlur: 0 },
        records: 36,
        cellBorders: [1, 1, 1, 1],
      });
      const bounds = await grid.evaluate((element) => {
        const body = element
          .querySelector(".zt-vtable-grid__body")!
          .getBoundingClientRect();
        const toolbar = element
          .querySelector(".zt-vtable-grid__toolbar")!
          .getBoundingClientRect();
        const footer = element
          .querySelector(".zt-vtable-grid__footer")!
          .getBoundingClientRect();
        return {
          radius: parseFloat(getComputedStyle(element).borderRadius),
          toolbarGap: body.top - toolbar.bottom,
          footerGap: footer.top - body.bottom,
        };
      });
      expect(key === "Home" ? bounds.radius === 0 : bounds.radius > 24).toBe(
        true,
      );
      expect(Math.abs(bounds.toolbarGap)).toBeLessThan(1);
      expect(Math.abs(bounds.footerGap)).toBeLessThan(1);
    }
    await grid.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `/tmp/zt-ui-frame-${theme === "深色主题" ? "dark" : "light"}.png`,
    });
  }
});
