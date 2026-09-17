import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { components } from '../docs/catalog'
import { api } from '../docs/reference'

function read(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('overlay documentation pages', () => {
  it('registers Modal and Drawer navigation and routes', () => {
    const router = read('src/router/index.ts')
    expect(components.some(item=>item.path==='/modal')).toBe(true)
    expect(components.some(item=>item.path==='/drawer')).toBe(true)
    expect(router).toContain("path: '/modal'")
    expect(router).toContain("path: '/drawer'")
  })

  it.each(['modal', 'drawer'])('%s page documents interactive, copyable examples and API', page => {
    const path = `src/views/${page}/Index.vue`
    expect(existsSync(resolve(process.cwd(), path))).toBe(true)
    if (!existsSync(resolve(process.cwd(), path))) return
    const source = read(path)
    const demos = (source.match(/<DemoBlock\b/g) ?? []).length
    const coded = (source.match(/<DemoBlock\s+:code=/g) ?? []).length
    expect(demos).toBeGreaterThanOrEqual(3)
    expect(coded).toBe(demos)
    expect(source).toContain('.vue?raw')
    const reference = api[page]!
    expect(reference.components[0]?.props.length).toBeGreaterThan(0)
    expect(reference.components[0]?.events.length).toBeGreaterThan(0)
    expect(reference.components[0]?.slots.length).toBeGreaterThan(0)
    expect(reference.types.length).toBeGreaterThan(0)
  })

  it('documents the Modal fullscreen control and draggable header', () => {
    const source = readdirSync(resolve(process.cwd(), 'src/views/modal')).filter(file=>file.endsWith('.vue')).map(file=>read('src/views/modal/'+file)).join('\n')
    expect(source).toContain('show-fullscreen-button')
    expect(source).toContain('v-model:fullscreen')
    expect(source).toContain('draggable')
    expect(source).toContain('fullscreen-change')
  })
})
