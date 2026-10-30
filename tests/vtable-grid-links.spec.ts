import { describe, expect, it, vi } from 'vitest'
import { createGridCanvasRenderer } from '../src/components/vtable-grid/canvas-layout'
class Graphic {
  children: any[] = []; handlers: Record<string, Function> = {}
  constructor(public attribute: any) {}
  add(value: any) { this.children.push(value) }
  addEventListener(name: string, fn: Function) { this.handlers[name] = fn }
  setAttributes(value: any) { Object.assign(this.attribute, value) }
}
const args = { col: 0, row: 1, rect: { width: 180, height: 36 }, table: { getCellOriginRecord: () => ({ id: 'P01', name: '商品详情' }) } }
const renderer = (state = { disabled: false, loading: false, exportLoading: false }) => createGridCanvasRenderer({ CustomLayout: { Group: Graphic, Text: Graphic }, getState: () => state })
describe('Canvas link buttons', () => {
  it('draws action links without a button border and dispatches once', () => {
    const action = vi.fn()
    const result = renderer().createActionLayout([{ type: 'detail', text: '查看', mode: 'link' }], args, action)
    const node = result.rootContainer.children[0]
    expect(node.attribute.lineWidth).toBe(0)
    expect(node.attribute.fill).toBeUndefined()
    node.handlers.pointertap({ stopPropagation: vi.fn() })
    expect(action).toHaveBeenCalledTimes(1)
  })
  it('provides a text link layout with current row context and respects dynamic busy state', () => {
    const state = { disabled: false, loading: false, exportLoading: false }
    const click = vi.fn()
    const canvas = renderer(state)
    const result = canvas.createLinkLayout('商品详情', args, { disabled: false }, click)
    const node = result.rootContainer.children[0]
    node.handlers.pointertap({ stopPropagation: vi.fn() })
    expect(click.mock.calls[0][0]).toMatchObject({ row: { id: 'P01' }, rowIndex: 0 })
    state.disabled = true
    node.handlers.pointertap({})
    expect(click).toHaveBeenCalledTimes(1)
  })
  it('does not render clickable links or actions on native aggregation cells', () => {
    const sum = { ...args, table: { getCellOriginRecord: () => undefined, isAggregation: () => true } }
    expect(renderer().createLinkLayout('合计', sum, {}, vi.fn())).toEqual({ renderDefault: true })
    expect(renderer().createActionLayout([{ type: 'detail', mode: 'link' }], sum, vi.fn())).toEqual({ renderDefault: false })
  })

})
