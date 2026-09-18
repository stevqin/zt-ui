import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { expect, it } from 'vitest'
import type { Component } from 'vue'
import { components } from '../docs/catalog'
// @ts-expect-error Node-only audit module.
import { inspectExamples } from '../../scripts/audit-examples.mjs'
const modules = import.meta.glob<{ default: Component }>('./*/*.vue')
const audited = inspectExamples()
const examples = audited.pages
  .flatMap((page: { examples: { file: string | null }[] }) => page.examples)
  .filter((e: { file: string | null }) => e.file) as { file: string }[]
it.each(examples)(
  '$file mounts with its own declared state',
  async ({ file }) => {
    const load = modules[file.replace('src/views/', './')]
    expect(load).toBeDefined()
    const component = (await load!()).default
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/menu',
          name: 'menu-demo',
          component: { template: '<div />' },
        },
      ],
    })
    await router.push('/menu')
    const warnings: string[] = []
    const wrapper = mount(component, {
      global: {
        plugins: [router],
        stubs: { ZtVTableGrid: true },
        config: { warnHandler: (message) => warnings.push(message) },
      },
    })
    await flushPromises()
    expect(
      warnings.filter((message) =>
        /not defined|Failed to resolve|Invalid prop|injection .*not found/.test(
          message,
        ),
      ),
    ).toEqual([])
    expect(wrapper.html().length).toBeGreaterThan(0)
    wrapper.unmount()
  },
)

it('mount inventory includes all catalog-declared example files', () => {
  const catalogFiles = components
    .flatMap((component) => component.page?.examples ?? [])
    .filter((example) => example.file)
    .map((example) => example.file)
    .sort()
  const actualFiles = audited.pages
    .filter((page: { component: string }) => page.component !== 'feedback')
    .flatMap((page: { examples: { file: string | null }[] }) => page.examples)
    .filter((example: { file: string | null }) => example.file)
    .map((example: { file: string }) => example.file)
    .sort()
  expect(catalogFiles).toEqual(actualFiles)
})
