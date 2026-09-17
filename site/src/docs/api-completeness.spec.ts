import { describe, expect, it } from 'vitest'
import { api } from './reference'
import { components } from './catalog'

describe('generated API documentation completeness', () => {
  it('covers every stable component with precise public rows', () => {
    expect(Object.keys(api).sort()).toEqual(components.map(component => component.path.slice(1)).sort())
    for (const [id, document] of Object.entries(api)) {
      expect(document.components.length, id).toBeGreaterThan(0)
      for (const owner of document.components) {
        for (const section of ['props', 'events', 'slots', 'exposes'] as const) {
          for (const row of owner[section]) {
            const location = `${id}.${owner.name}.${section}.${row.name}`
            expect(row.description.trim(), location).not.toBe('')
            expect(row.type, location).not.toMatch(/^(Function|object|array)$/i)
            if (section === 'props') {
              expect(row.templateName, location).toBeTruthy()
              expect(row.default, location).toBeTruthy()
              expect(row.default, location).not.toBe('未设置')
            }
          }
        }
      }
    }
  })

  it('distinguishes methods from exposed properties', () => {
    const input = api.input.components.find(owner => owner.name === 'ZtInput')!
    expect(input.exposes.find(row => row.name === 'focus')?.kind).toBe('method')
    expect(input.exposes.find(row => row.name === 'input')?.kind).toBe('property')
  })
})
