import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
  resolve(process.cwd(), 'src/components/checkbox/checkbox.scss'),
  'utf8',
)

describe('checkbox mark alignment', () => {
  it('keeps the box and marks centered at every size', () => {
    expect(source).toMatch(/&__inner\s*\{[\s\S]*?box-sizing:\s*border-box/)
    expect(source).toMatch(/&::after\s*\{[\s\S]*?top:\s*50%[\s\S]*?left:\s*50%/)
    expect(source).not.toMatch(/&--mini[\s\S]*?&::after\s*\{[^}]*left:\s*3px/)
    expect(source).not.toMatch(/&--large[\s\S]*?&::after\s*\{[^}]*left:\s*5px/)
  })
})

describe('checkbox focus rings', () => {
  it('shows focus rings only for keyboard focus, not pointer clicks', () => {
    expect(source).toMatch(/&:has\(input:focus-visible\)\s*\{[^}]*outline:/)
    expect(source).toMatch(
      /&:has\(input:focus-visible\)\s+\.zt-checkbox__inner/,
    )
    expect(source).not.toMatch(/&:focus-within\s*\{[^}]*outline:/)
    expect(source).not.toMatch(/&:focus-within\s+\.zt-checkbox__inner/)
  })
})
