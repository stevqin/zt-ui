import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const legacyPanel = ['Select', 'Filter', 'Panel'].join('')
const legacyContext = ['filter', 'context'].join('-')

describe('ordinary Select architecture', () => {
  it('keeps Select independent from SelectBox modes and panels', () => {
    const source = readFileSync('src/components/select/ZtSelect.vue', 'utf8')
    const forbidden = ['SelectBox', legacyPanel, legacyContext, ['filter', 'Panel'].join('')]
    expect(source).not.toMatch(new RegExp(forbidden.join('|')))
    expect(source).toContain('useAnchoredDropdown')
  })

  it('removes the obsolete panel, mode context, stylesheet and experimental suite', () => {
    for (const path of [
      `src/components/select/${legacyPanel}.vue`,
      `src/components/select/${legacyContext}.ts`,
      'src/components/select/filter-panel.scss',
      'tests/select-filter-panel.spec.ts',
    ]) expect(existsSync(path), path).toBe(false)
  })

  it('keeps ordinary Select styles independent from the standalone panel', () => {
    const source = readFileSync('src/components/select/select.scss', 'utf8')
    expect(source).not.toMatch(/select-box|select--filter|is-filter|filter-panel/)
  })
})
