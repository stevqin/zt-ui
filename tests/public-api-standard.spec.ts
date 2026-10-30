import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const source = (file: string) => readFileSync(resolve(root, file), 'utf8')
function publicSiteFiles(directory: string): string[] {
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap(entry => {
    const file = `${directory}/${entry.name}`
    return entry.isDirectory() ? publicSiteFiles(file) : /\.(vue|ts|json|mjs)$/.test(file) ? [file] : []
  })
}

describe('public API standardization', () => {
  it('does not expose duplicate RadioGroup, Pagination, or Badge props in public types', () => {
    expect(source('src/components/radio/types.ts')).not.toMatch(/\bvariant\??\s*:/)
    expect(source('src/components/pagination/types.ts')).not.toMatch(/\bsmall\??\s*:/)
    expect(source('src/components/badge/types.ts')).not.toMatch(/\btype\??\s*:/)
  })

  it('does not retain removed runtime branches', () => {
    expect(source('src/components/radio/ZtRadioGroup.vue')).not.toMatch(/\bvariant\b/)
    expect(source('src/components/pagination/ZtPagination.vue')).not.toMatch(/\bsmall\b/)
    expect(source('src/components/badge/ZtBadge.vue')).not.toContain('props.type')
  })

  it('does not publish compatibility guidance or removed prop rows', () => {
    const api = JSON.parse(source('site/src/generated/api.json'))
    const components = Object.values(api).flatMap((page: any) => page.components)
    for (const [name, removed] of [['ZtRadioGroup', 'variant'], ['ZtPagination', 'small'], ['ZtBadge', 'type']]) {
      const component = components.find((item: any) => item.name === name) as any
      expect(component, `${name} must have generated metadata`).toBeDefined()
      expect(component.props.map((prop: any) => prop.name)).not.toContain(removed)
    }
    const publicSources = ['README.md', 'site/scripts/api-explanations.mjs', ...publicSiteFiles('site/src')].map(source).join('\n')

    expect(publicSources).not.toMatch(/@deprecated|兼容旧版|兼容的小尺寸/)
    expect(publicSources).not.toMatch(/ZtRadioGroupProps[\s\S]{0,500}\bvariant\??\s*:/)
    expect(publicSources).not.toMatch(/ZtPaginationProps[\s\S]{0,500}\bsmall\??\s*:/)
    expect(publicSources).not.toMatch(/ZtBadgeProps[\s\S]{0,500}\btype\??\s*:/)
    expect(publicSources).not.toContain('variant=segmented')
  })
})
