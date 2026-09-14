import { describe, expect, it } from 'vitest'
import { ZtVTableGrid, buildVTableGridSummary, createVTableGridCsv } from '../src'
import type { ZtVTableGridColumn, ZtVTableGridProps, ZtVTableGridQueryParams } from '../src'

interface Row { id: number; amount: number }
interface SearchForm { keyword: string }

describe('VTableGrid public entry', () => {
  it('exports the component, helpers and generic types without loading the Vue VTable adapter', () => {
    const columns: ZtVTableGridColumn<Row>[] = [{ field: 'amount', title: '金额', summary: 'sum' }]
    const params: ZtVTableGridQueryParams = { page: 1, pageSize: 20, sort: { order: 'normal' }, form: {} }
    const props: ZtVTableGridProps<Row, SearchForm> = { columns, formData: { keyword: 'coat' } }

    expect(ZtVTableGrid).toBeTruthy()
    expect(buildVTableGridSummary(columns, [{ id: 1, amount: 2 }])).toEqual({ amount: 2 })
    expect(createVTableGridCsv(columns, [{ id: 1, amount: 2 }])).toContain('金额')
    expect(params.pageSize).toBe(20)
    expect(props.formData?.keyword).toBe('coat')
  })
})
