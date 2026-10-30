import { test, expect } from "@playwright/test";
for (const width of [1440, 1024, 768, 390, 320]) {
  test(`appearance toolbar fits at ${width}px and applies size and radius`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#/components/popconfirm");
    const tools = page.getByRole("group", {
      name: "演示外观设置",
      exact: true,
    });
    const sizes = tools.getByRole("combobox", { name: "组件尺寸" });
    const slider = tools.getByRole("slider", { name: "组件圆角" });
    await expect(tools.locator('input[type="number"]')).toHaveCount(0);
    await expect(tools.locator("select")).toHaveCount(0);
    await sizes.click();
    await expect(page.getByRole("option")).toHaveText([
      "mini",
      "small",
      "default",
      "medium",
      "large",
    ]);
    const dropdown = page.locator(".zt-select__dropdown").last();
    await expect(dropdown).toBeVisible();
    const anchor = (await tools.locator(".zt-select__control").boundingBox())!;
    await expect
      .poll(async () => Math.abs((await dropdown.boundingBox())!.x - anchor.x))
      .toBeLessThan(2);
    await sizes.press("Escape");
    for (const size of ["mini", "small", "default", "medium", "large"]) {
      await sizes.click();
      await page.getByRole("option", { name: size, exact: true }).click();
      await expect(sizes).toHaveValue(size);
      await expect(sizes).toHaveAttribute("aria-expanded", "false");
      if (size !== "default")
        await expect(
          page.locator(".example-preview .zt-button").first(),
        ).toHaveClass(new RegExp(`zt-button--${size}`));
    }
    await sizes.press("ArrowDown");
    await sizes.press("Enter");
    await expect(sizes).toHaveValue("mini");
    await sizes.click();
    await page.getByRole("option", { name: "large", exact: true }).click();
    await tools.getByRole("button", { name: "深色主题", exact: true }).click();
    await slider.press("Home");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
    await expect(page.locator(".docs-site")).toHaveCSS("--zt-radius", "0px");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("zt-ui-docs-appearance-v2")!),
      ),
    ).toEqual({ size: "large", borderRadius: 0, themePreference: "dark" });
    await page.reload();
    await expect(sizes).toHaveValue("large");
    await expect(slider).toHaveAttribute("aria-valuenow", "0");
    await expect(
      tools.getByRole("button", { name: "深色主题", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    for (const theme of ["浅色主题", "深色主题"]) {
      await tools.getByRole("button", { name: theme, exact: true }).click();
      await sizes.click();
      await expect(page.getByRole("listbox")).toBeVisible();
      await page.screenshot({
        path: `/tmp/zt-ui-own-select-${width}-${theme === "深色主题" ? "dark" : "light"}.png`,
      });
      await sizes.press("Escape");
      await slider.press("End");
      await expect(slider).toHaveAttribute("aria-valuenow", "24");
      await expect(page.locator(".docs-site")).toHaveCSS("--zt-radius", "24px");
      const track = (await tools.locator(".zt-slider__track").boundingBox())!;
      await page.mouse.move(track.x + track.width, track.y + track.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        track.x + track.width / 4,
        track.y + track.height / 2,
        { steps: 4 },
      );
      await page.mouse.up();
      await expect(slider).toHaveAttribute("aria-valuenow", "6");
      await expect(tools.locator("output")).toHaveText("6px");
      await expect(page.locator(".docs-site")).toHaveCSS("--zt-radius", "6px");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const control of [
        sizes,
        slider,
        tools.getByRole("button", { name: "深色主题", exact: true }),
      ]) {
        const box = (await control.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      await page.screenshot({
        path: `/tmp/zt-ui-toolbar-slider-${width}-${theme === "深色主题" ? "dark" : "light"}.png`,
      });
    }
  });
}
