import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const source = (file: string) => readFileSync(resolve(root, file), 'utf8')

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
    const publicSources = [
      'README.md',
      'site/scripts/api/metadata/shared.mjs',
      'site/scripts/api/metadata/form.mjs',
      'site/src/docs/reference.ts',
      'site/src/docs/api.generated.json',
      'site/src/views/radio/Index.vue',
      'site/src/views/radio/Example04.vue',
      'site/src/views/pagination/Index.vue',
      'site/src/views/badge/Index.vue',
    ].map(source).join('\n')

    expect(publicSources).not.toMatch(/@deprecated|兼容旧版|兼容的小尺寸/)
    expect(publicSources).not.toMatch(/ZtRadioGroupProps[\s\S]{0,500}\bvariant\??\s*:/)
    expect(publicSources).not.toMatch(/ZtPaginationProps[\s\S]{0,500}\bsmall\??\s*:/)
    expect(publicSources).not.toMatch(/ZtBadgeProps[\s\S]{0,500}\btype\??\s*:/)
    expect(publicSources).not.toContain('variant=segmented')
  })
})
