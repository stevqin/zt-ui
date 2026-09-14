import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { sfc } from '../utils/exampleCode'

const pages = ['button', 'tag', 'radio', 'checkbox', 'switch', 'badge']

describe('site example coverage', () => {
  it('contains long code lines without widening the documentation page', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/style.scss'), 'utf8')
    expect(styles).toMatch(/\.doc-main\s*\{[\s\S]*?min-width:\s*0/)
    expect(styles).toMatch(/\.doc-demo\s*\{[\s\S]*?min-width:\s*0/)
  })

  it('builds complete Vue and TypeScript SFC source', () => {
    const result = sfc("import { ZtButton } from '@ztechjs/zt-ui'", '<ZtButton>保存</ZtButton>')
    expect(result).toContain('<script setup lang="ts">')
    expect(result).toContain("import { ZtButton } from '@ztechjs/zt-ui'")
    expect(result).toContain('<template>')
    expect(result).toContain('<ZtButton>保存</ZtButton>')
  })

  it.each(pages)('%s uses DemoBlock with code for every visual demo', page => {
    const source = readFileSync(resolve(process.cwd(), `src/views/${page}/Index.vue`), 'utf8')
    const demoCount = (source.match(/<DemoBlock\b/g) ?? []).length
    const codeCount = (source.match(/<DemoBlock\s+:code=/g) ?? []).length
    expect(source).toContain("import DemoBlock from '@/components/DemoBlock.vue'")
    expect(source).toContain("import { sfc } from '@/utils/exampleCode'")
    expect(source).not.toContain('<div class="doc-demo">')
    expect(demoCount).toBeGreaterThan(0)
    expect(codeCount).toBe(demoCount)
  })
})
