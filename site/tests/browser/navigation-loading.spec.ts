import { test, expect } from "@playwright/test";

test("loading uses complete SVG states, restores focus and supports a plain ring", async ({
  page,
}) => {
  await page.goto("/#/components/zt-alert-loading");
  const start = page.getByRole("button", { name: "准备下载", exact: true });
  await start.click();
  const loading = page.locator(".zt-loading");
  const icon = loading.locator(".zt-loading__icon svg");
  await expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
  expect(await icon.evaluate((svg) => getComputedStyle(svg).color)).toBe(
    await loading
      .locator(".zt-loading__text")
      .evaluate((text) => getComputedStyle(text).color),
  );
  const bounds = await icon.evaluate((svg) => {
    const slot = svg.parentElement!.getBoundingClientRect();
    const rect = svg.getBoundingClientRect();
    const drawing = (svg as SVGGraphicsElement).getBBox();
    return {
      fits: rect.width <= slot.width + 1 && rect.height <= slot.height + 1,
      inside:
        drawing.x >= 0 &&
        drawing.y >= 0 &&
        drawing.x + drawing.width <= 24 &&
        drawing.y + drawing.height <= 24,
    };
  });
  expect(bounds).toEqual({ fits: true, inside: true });
  await expect(icon.locator("path")).toHaveAttribute(
    "d",
    "M5 12.5 9.5 17 19 7",
  );
  await expect(loading).toHaveCount(0);
  await expect(start).toBeFocused();
  await page.getByRole("button", { name: "仅显示加载环", exact: true }).click();
  await expect(page.locator(".zt-loading__icon > *")).toHaveCount(0);
  await expect(page.locator(".zt-loading__spinner")).toBeVisible();
  await expect(page.locator(".zt-loading")).toHaveCount(0);
  await start.click();
  await page.evaluate(() => {
    location.hash = "/components/button";
  });
  await expect(page.locator(".zt-loading-layer")).toHaveCount(0);
});

for (const theme of ["light", "dark"]) {
  test(`grouped sidebar retains current link and keyboard focus in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript((theme) => {
      localStorage.setItem(
        "zt-ui-docs-appearance-v2",
        JSON.stringify({
          size: "default",
          borderRadius: 6,
          themePreference: theme,
        }),
      );
    }, theme);
    await page.goto("/#/components/button");
    const sidebar = page.getByRole("complementary", {
      name: "文档导航",
      exact: true,
    });
    const active = sidebar.locator('a[aria-current="page"]');
    await expect(active).toContainText("Button");
    const group = sidebar.locator(".sidebar-group.is-current");
    await expect(group).toHaveCount(1);
    await expect(group.getByRole("heading")).toBeVisible();
    await active.focus();
    await expect(active).toBeFocused();
    await expect(active).toHaveCSS("outline-style", "solid");
    await page.screenshot({ path: `/tmp/zt-docs-sidebar-${theme}.png` });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page).not.toHaveURL(/components\/button$/);
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .getByRole("button", { name: "打开文档导航", exact: true })
      .click();
    const mobile = page.locator(".mobile-navigation");
    await expect(mobile).toBeVisible();
    await mobile
      .getByRole("link", { name: "Button 按钮", exact: true })
      .click();
    await expect(mobile).not.toBeVisible();
    await expect(page).toHaveURL(/components\/button$/);
  });
}
