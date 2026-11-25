import { expect, test, type Locator } from '@playwright/test';

async function expectAligned(table: Locator) {
  const differences = await table.evaluate((element) => {
    const cells = Array.from(element.querySelectorAll('tbody tr:first-child td'));
    return Array.from(element.querySelectorAll('thead th'), (header, index) => {
      const a = header.getBoundingClientRect();
      const b = cells[index].getBoundingClientRect();
      return Math.max(Math.abs(a.left - b.left), Math.abs(a.right - b.right));
    });
  });
  expect(differences).toHaveLength(9);
  expect(Math.max(...differences)).toBeLessThan(1);
}

test('Table scroll track starts below the header and follows the available height', async ({ page }) => {
  await page.goto('/#/components/table', { waitUntil: 'domcontentloaded' });
  const preview = page.locator('#example-fixed .example-preview');
  const table = preview.locator('.zt-table');
  const viewport = preview.locator('.table-demo__viewport');
  const scroll = table.locator('.zt-table__scroll');
  const header = table.getByRole('columnheader', { name: '编号' });
  const firstRow = table.locator('tbody tr').first();
  const track = table.locator('.zt-scrollbar__bar--vertical');

  await expect(table.locator('tbody tr')).toHaveCount(60);
  await preview.getByRole('checkbox', { name: '加宽列' }).uncheck();
  await table.scrollIntoViewIfNeeded();
  const initial = await scroll.evaluate((element) => ({
    height: element.clientHeight,
    overflow: element.scrollHeight - element.clientHeight,
  }));
  expect(initial.overflow).toBeGreaterThan(0);
  await expect(track).toBeVisible();
  const headerBox = (await header.boundingBox())!;
  const trackBox = (await track.boundingBox())!;
  expect(trackBox.y).toBeCloseTo(headerBox.y + headerBox.height, 0);
  expect(trackBox.y + trackBox.height).toBeCloseTo((await scroll.boundingBox())!.y + (await scroll.boundingBox())!.height, 0);
  expect((await table.boundingBox())!.width).toBeCloseTo((await viewport.boundingBox())!.width, 0);
  await expectAligned(table);

  const rowY = (await firstRow.boundingBox())!.y;
  await firstRow.hover();
  await page.mouse.wheel(0, 120);
  await expect.poll(() => scroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect((await header.boundingBox())!.y).toBeCloseTo(headerBox.y, 0);
  expect((await firstRow.boundingBox())!.y).toBeLessThan(rowY);

  const thumb = track.locator('.zt-scrollbar__thumb');
  const beforeDrag = await scroll.evaluate((element) => element.scrollTop);
  const thumbBox = (await thumb.boundingBox())!;
  await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2 + 50);
  await page.mouse.up();
  await expect.poll(() => scroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(beforeDrag);
  expect((await header.boundingBox())!.y).toBeCloseTo(headerBox.y, 0);

  await preview.getByRole('checkbox', { name: '少量行' }).check();
  await expect(track).toHaveCount(0);
  expect(await scroll.evaluate((element) => element.scrollHeight - element.clientHeight)).toBe(0);
  await expectAligned(table);

  await preview.getByRole('checkbox', { name: '少量行' }).uncheck();
  await preview.getByRole('checkbox', { name: '加宽列' }).check();
  await expect(track).toBeVisible();
  const horizontalTrack = table.locator('.zt-scrollbar__bar--horizontal');
  await expect(horizontalTrack).toBeVisible();
  const categoryHeader = table.getByRole('columnheader', { name: '分类' });
  const fixedHeaders = ['编号', '商品', '库存', '库存状态'].map((name) =>
    table.getByRole('columnheader', { name, exact: true }),
  );
  const headerX = (await categoryHeader.boundingBox())!.x;
  const fixedPositions = await Promise.all(fixedHeaders.map(async (header) => (await header.boundingBox())!.x));
  await scroll.hover();
  await page.mouse.wheel(140, 120);
  await expect.poll(() => scroll.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  const left = await scroll.evaluate((element) => element.scrollLeft);
  expect((await categoryHeader.boundingBox())!.x).toBeCloseTo(headerX - left, 0);
  for (const [index, header] of fixedHeaders.entries()) {
    expect((await header.boundingBox())!.x).toBeCloseTo(fixedPositions[index], 0);
  }
  await expectAligned(table);

  const { width } = page.viewportSize()!;
  await page.setViewportSize({ width, height: 700 });
  await expect.poll(() => scroll.evaluate((element) => element.clientHeight)).toBeLessThan(initial.height);
  expect((await track.boundingBox())!.height).toBeLessThan(trackBox.height);
  expect((await table.boundingBox())!.height).toBeCloseTo((await viewport.boundingBox())!.height, 0);
  await expectAligned(table);

  await preview.getByRole('checkbox', { name: '少量行' }).check();
  await expect(track).toHaveCount(0);
  await expect(horizontalTrack).toBeVisible();
  await expectAligned(table);

  await preview.getByRole('checkbox', { name: '少量行' }).uncheck();
  await preview.getByRole('checkbox', { name: '限制高度' }).uncheck();
  await expect(track).toHaveCount(0);
  expect(await scroll.evaluate((element) => element.scrollHeight - element.clientHeight)).toBe(0);
  expect((await table.boundingBox())!.height).toBeGreaterThan(initial.height);
  await expectAligned(table);
});

test('Table scrolls in a height-constrained flex column', async ({ page }) => {
  await page.goto('/#/components/table', { waitUntil: 'domcontentloaded' });
  const preview = page.locator('#example-fixed .example-preview');
  const scrollingRegion = preview.getByRole('region', { name: '表格滚动区域' });
  await expect(scrollingRegion).toBeVisible();
  await page.addStyleTag({ content: `
    #example-fixed .table-demo__viewport { display: flex; flex-direction: column; }
    #example-fixed .zt-table, #example-fixed .zt-table__scroll { flex: 1 1 0; }
  ` });
  const dimensions = await scrollingRegion.evaluate((region) => ({
    visible: region.clientHeight,
    total: region.scrollHeight,
  }));
  expect(dimensions.visible).toBeGreaterThan(0);
  expect(dimensions.total).toBeGreaterThan(dimensions.visible);
  await expect(preview.locator('.zt-scrollbar__bar--vertical')).toBeVisible();
});

test('Table separates the fixed columns from the scrollable columns only during horizontal overflow', async ({ page }) => {
  await page.goto('/#/components/table', { waitUntil: 'domcontentloaded' });
  const preview = page.locator('#example-fixed .example-preview');
  const table = preview.locator('.zt-table');
  const scroll = table.locator('.zt-table__scroll');
  const wideColumns = preview.getByRole('checkbox', { name: '加宽列' });
  const row = table.locator('tbody tr').first().locator('td');
  const left = [table.getByRole('columnheader', { name: '商品' }), row.nth(1)];
  const right = [table.getByRole('columnheader', { name: '库存', exact: true }), row.nth(7)];
  const unmarked = [
    table.getByRole('columnheader', { name: '编号' }),
    table.getByRole('columnheader', { name: '分类' }),
    table.getByRole('columnheader', { name: '库存状态' }),
    row.nth(0), row.nth(2), row.nth(8),
  ];
  const separator = (cell: Locator) => cell.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return style.content === '""' ? style.backgroundImage : 'none';
  });

  await expect(wideColumns).toBeChecked();
  await expect.poll(() => scroll.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeGreaterThan(0);
  for (const cell of left) await expect.poll(() => separator(cell)).toContain('linear-gradient(to left');
  for (const cell of right) await expect.poll(() => separator(cell)).toContain('linear-gradient(to right');
  for (const cell of unmarked) expect(await separator(cell)).toBe('none');
  await scroll.evaluate((element) => { element.scrollLeft = element.scrollWidth / 4; });
  for (const cell of [...left, ...right]) expect(await separator(cell)).toContain('linear-gradient');
  await expectAligned(table);

  await preview.getByRole('checkbox', { name: '单元格边框' }).check();
  for (const cell of left) {
    await expect(cell).toHaveCSS('border-right-width', '1px');
  }
  for (const cell of [...left, ...right]) expect(await separator(cell)).toContain('linear-gradient');

  await preview.getByRole('checkbox', { name: '单元格边框' }).uncheck();
  await preview.getByRole('checkbox', { name: '限制高度' }).uncheck();
  await expect(table.locator('.zt-scrollbar__wrap')).toHaveClass(/is-native/);
  for (const cell of [...left, ...right]) await expect.poll(() => separator(cell)).toContain('linear-gradient');
  await wideColumns.uncheck();
  for (const cell of [...left, ...right]) await expect.poll(() => separator(cell)).toBe('none');
});
