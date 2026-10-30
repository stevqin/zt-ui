import { h, Fragment } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createGridCanvasRenderer } from '../src/components/vtable-grid/canvas-layout'
import { VTableTag, resolveVTableTagAttributes } from '../src/components/vtable-grid/canvas-tag'
import { bindGridImagePreview, createGridImageLoader } from '../src/components/vtable-grid/image'

class Graphic {
  children: any[] = []
  handlers: Record<string, Function> = {}
  constructor(public attribute: any) {}
  add(child: any) { this.children.push(child) }
  addEventListener(name: string, handler: Function) { this.handlers[name] = handler }
}
const renderer = () => createGridCanvasRenderer({ CustomLayout: { Group: Graphic, Text: Graphic, Image: Graphic, Tag: Graphic, CheckBox: Graphic, Radio: Graphic }, size: 'small' })

describe('grid Canvas adapters', () => {
  it('renders text, Vue fragments, styled span, ZtTag and wrapped tags', () => {
    const graphics = renderer().createSlotGraphics(h(Fragment, [h('span', { style: { color: 'red' } }, '你好'), h({ name: 'ZtTag' }, { status: 'success' }, () => '通过'), h(VTableTag, { text: '标签' })]))
    expect(graphics).toHaveLength(3)
    expect(graphics[0].attribute).toMatchObject({ text: '你好', fill: 'red' })
    expect(graphics[1].attribute).toMatchObject({ text: '通过', panel: { visible: true } })
    expect(graphics[2].attribute.text).toBe('标签')
    expect(resolveVTableTagAttributes({ text: 0, round: true }, 'small').panel.cornerRadius).toBe(999)
  })
  it('uses raw records for render and named/header slot scopes and skips summary rows', () => {
    const raw = { id: 2 }
    const render = vi.fn(() => '文本')
    const args = { col: 1, row: 4, rect: { width: 150, height: 32 }, table: { getCellOriginRecord: () => raw } }
    const canvas = renderer()
    expect(canvas.createRenderLayout(render, args, 'right').rootContainer.attribute.justifyContent).toBe('flex-end')
    expect(render.mock.calls[0][0]).toMatchObject({ row: raw, record: raw, rowIndex: 3 })
    canvas.createSlotLayout('head', { head: render }, args, true)
    expect(render.mock.calls[1][0].rowIndex).toBeUndefined()
    expect(canvas.createRenderLayout(render, { ...args, table: { getCellOriginRecord: () => ({ __zt_grid_summary__: true }) } })).toEqual({ renderDefault: true })
  })
  it('blocks disabled direct actions while dispatching enabled actions with their row', () => {
    const onAction = vi.fn()
    const row = { id: 1 }
    const layout = renderer().createActionLayout([{ type: 'edit', text: '编辑' }, { type: 'delete', text: '删除', disabled: true }], { col: 1, row: 1, rect: { width: 180, height: 36 }, table: { getCellOriginRecord: () => row } }, onAction)
    layout.rootContainer.children[0].handlers.pointertap({})
    layout.rootContainer.children[1].handlers.pointertap?.({})
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onAction.mock.calls[0][1]).toBe(row)
  })
  it('gates preview to actual image targets and releases listeners and overlays', () => {
    const handlers: Record<string, any> = {}
    const table = { on: vi.fn((name, handler) => { handlers[name] = handler }), off: vi.fn(), getCellOriginRecord: () => ({ image: 'https://test/a.png' }) }
    const onOpen = vi.fn(), onClose = vi.fn(), onRefresh = vi.fn()
    const preview = bindGridImagePreview(table, { getColumn: () => ({ field: 'image', cellType: 'image' }), onOpen, onClose, onRefresh })
    handlers.click_cell({ col: 0, row: 1, target: { type: 'group' } })
    expect(onOpen).not.toHaveBeenCalled()
    handlers.click_cell({ col: 0, row: 1, target: { type: 'image' } })
    expect(onOpen).toHaveBeenCalledWith('https://test/a.png')
    preview.release()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(table.off).toHaveBeenCalledWith('click_cell', handlers.click_cell)
  })
  it('respects disabled previews and disabled host state', () => {
    let click: any
    const onOpen = vi.fn()
    const table = { on: (_event: string, fn: any) => { click = fn }, off: vi.fn(), getCellOriginRecord: () => ({ image: 'https://test/a' }) }
    const column = { field: 'image', cellType: 'image', clickToPreview: false }
    let enabled = true
    const preview = bindGridImagePreview(table, { getColumn: () => column, onOpen, enabled: () => enabled })
    click({ target: { type: 'image' } })
    column.clickToPreview = true
    enabled = false
    click({ target: { type: 'image' } })
    expect(onOpen).not.toHaveBeenCalled()
    preview.release()
  })
  it('closes the native preview with Escape and releases pending image loads', async () => {
    let click: any
    const table = { on: (_event: string, fn: any) => { click = fn }, off: vi.fn(), getCellOriginRecord: () => ({ image: 'https://test/a' }) }
    const preview = bindGridImagePreview(table, { getColumn: () => ({ field: 'image', cellType: 'image' }) })
    click({ target: { type: 'image' } })
    expect(document.querySelector('[aria-label="图片预览"]')).not.toBeNull()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(document.querySelector('[aria-label="图片预览"]')).toBeNull()
    preview.release()
    const image = { src: '', onload: null, onerror: null }
    const loader = createGridImageLoader(() => image as any)
    const result = loader('https://test/pending')
    loader.release()
    expect(await result).toBe('__zt_grid_image_load_failed__')
    expect(image.onload).toBeNull()
    expect(image.onerror).toBeNull()
  })
  it('deduplicates image loads and clears load listeners after completion', async () => {
    const img = { src: '', onload: null as any, onerror: null as any }
    const create = vi.fn(() => img as any)
    const load = createGridImageLoader(create)
    const pending = load(' https://test/a.png ')
    expect(load('https://test/a.png')).toBe(pending)
    img.onload()
    expect(await pending).toBe(img)
    expect(img.onload).toBeNull()
    load.release()
    expect(create).toHaveBeenCalledTimes(1)
  })
})
