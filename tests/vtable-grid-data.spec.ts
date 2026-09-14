import { describe, expect, it } from 'vitest'
import {
  createLatestQueryRunner,
  normalizePagination,
  normalizeQueryResult,
} from '../src/components/vtable-grid/data'

type Row = { id: number; name?: string }

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('vtable-grid data helpers', () => {
  it('normalizes pagination values to safe positive integers', () => {
    expect(normalizePagination({ currentPage: -2, pageSize: 0 })).toEqual({ currentPage: 1, pageSize: 1 })
    expect(normalizePagination({ currentPage: 2.8, pageSize: 20.9 })).toEqual({ currentPage: 2, pageSize: 20 })
    expect(normalizePagination({ currentPage: Number.NaN, pageSize: Number.POSITIVE_INFINITY })).toEqual({ currentPage: 1, pageSize: 200 })
  })

  it('accepts data and records query result aliases', () => {
    expect(normalizeQueryResult<Row>({ data: [{ id: 1 }], total: 8 })).toEqual({ data: [{ id: 1 }], total: 8, summaryData: null })
    expect(normalizeQueryResult<Row>({ records: [{ id: 2 }], total: -1, summary_data: { amount: 10 } })).toEqual({
      data: [{ id: 2 }],
      total: 0,
      summaryData: { amount: 10 },
    })
  })

  it('marks an older concurrent query as stale', async () => {
    const runner = createLatestQueryRunner()
    const first = deferred<{ data: Row[]; total: number }>()
    const second = deferred<{ data: Row[]; total: number }>()
    const firstRun = runner.run<Row>(() => first.promise)
    const secondRun = runner.run<Row>(() => second.promise)

    second.resolve({ data: [{ id: 2 }], total: 1 })
    expect(await secondRun).toEqual({ stale: false, data: [{ id: 2 }], total: 1, summaryData: null })

    first.resolve({ data: [{ id: 1 }], total: 1 })
    expect(await firstRun).toEqual({ stale: true, data: [{ id: 1 }], total: 1, summaryData: null })
  })

  it('invalidates an outstanding query', async () => {
    const runner = createLatestQueryRunner()
    const pending = deferred<{ data: Row[]; total: number }>()
    const run = runner.run<Row>(() => pending.promise)
    runner.invalidate()
    pending.resolve({ data: [{ id: 1 }], total: 1 })
    expect((await run).stale).toBe(true)
  })
})
