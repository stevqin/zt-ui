import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function read(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('overlay documentation pages', () => {
  it('registers Modal and Drawer navigation and routes', () => {
    const app = read('src/App.vue')
    const router = read('src/router/index.ts')
    expect(app).toContain("path: '/modal'")
    expect(app).toContain("path: '/drawer'")
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
    expect(source).toContain("import { sfc } from '@/utils/exampleCode'")
    expect(source).toContain('<h2>API</h2>')
    expect(source).toContain('<h3>Props</h3>')
    expect(source).toContain('<h3>Events</h3>')
    expect(source).toContain('<h3>Slots</h3>')
  })

  it('documents the Modal fullscreen control and draggable header', () => {
    const source = read('src/views/modal/Index.vue')
    expect(source).toContain('show-fullscreen-button')
    expect(source).toContain('v-model:fullscreen')
    expect(source).toContain('draggable')
    expect(source).toContain('fullscreen-change')
  })
})
