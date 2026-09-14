import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
  resolve(process.cwd(), 'src/components/button/button.scss'),
  'utf8',
)

describe('dialog close icon animation', () => {
  it('uses global descendant selectors for the close icon hover animation', () => {
    expect(source).not.toContain(':deep(')
    expect(source).toMatch(
      /&\.zt-button--close:not\(:disabled\):hover\s*\{[\s\S]*?svg[\s\S]*?transform:\s*rotate\(90deg\)/,
    )
    expect(source).toMatch(
      /&--circle[\s\S]*?svg[\s\S]*?transition:\s*transform\s+180ms/,
    )
  })
})
