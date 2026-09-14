export type PagerItem = number | 'prev-more' | 'next-more'

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}

export function normalizePagerCount(value: number) {
  const clamped = Math.min(21, Math.max(5, Math.floor(value)))
  return clamped % 2 === 0 ? clamped - 1 : clamped
}

export function buildPagerItems(pageCount: number, currentPage: number, pagerCount: number): PagerItem[] {
  const total = Math.max(1, Math.floor(pageCount))
  const visible = normalizePagerCount(pagerCount)
  const current = Math.min(total, Math.max(1, Math.floor(currentPage)))
  if (total <= visible) return range(1, total)

  const edge = Math.floor(visible / 2) + 1
  if (current <= edge) {
    return [1, ...range(2, visible - 2), 'next-more', total]
  }
  if (current >= total - edge + 1) {
    return [1, 'prev-more', ...range(total - visible + 3, total)]
  }

  const side = Math.floor((visible - 5) / 2)
  return [1, 'prev-more', ...range(current - side, current + side), 'next-more', total]
}
