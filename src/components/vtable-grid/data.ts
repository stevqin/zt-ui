import type { ZtVTableGridQueryResult } from './types'

function positiveInteger(value: number | undefined, fallback: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value!)) : fallback
}

export function normalizePagination(input: { currentPage?: number; pageSize?: number }) {
  return {
    currentPage: positiveInteger(input.currentPage, 1),
    pageSize: positiveInteger(input.pageSize, 200),
  }
}

export function normalizeQueryResult<Row>(result: ZtVTableGridQueryResult<Row>) {
  const data = Array.isArray(result.data) ? result.data : Array.isArray(result.records) ? result.records : []
  const totalValue = Number(result.total ?? data.length)
  const summaryCandidate = result.summaryData ?? result.summary_data
  return {
    data,
    total: Number.isFinite(totalValue) ? Math.max(0, Math.floor(totalValue)) : data.length,
    summaryData: summaryCandidate && typeof summaryCandidate === 'object' && !Array.isArray(summaryCandidate)
      ? summaryCandidate
      : null,
  }
}

export function createLatestQueryRunner() {
  let sequence = 0
  return {
    async run<Row>(query: () => Promise<ZtVTableGridQueryResult<Row>>) {
      const current = ++sequence
      const result = normalizeQueryResult(await query())
      return { ...result, stale: current !== sequence }
    },
    invalidate() {
      sequence += 1
    },
  }
}
