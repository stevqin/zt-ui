import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { expect, it, vi } from 'vitest'
import type { Component } from 'vue'
// @ts-expect-error Node-only audit module.
import { inspectExamples } from '../../scripts/audit-examples.mjs'
const modules = import.meta.glob<{ default: Component }>('./*/*.vue')
const examples = inspectExamples()
  .pages.flatMap((page: { examples: { file: string | null }[] }) => page.examples)
  .filter((e: { file: string | null }) => e.file) as { file: string }[]
it.each(examples)('$file mounts with its own declared state', async ({ file }) => {
  const load = modules[file.replace('src/views/', './')]
  expect(load).toBeDefined()
  const component = (await load!()).default
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/menu', name: 'menu-demo', component: { template: '<div />' } }],
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
      /not defined|Failed to resolve|Invalid prop|injection .*not found/.test(message),
    ),
  ).toEqual([])
  expect(wrapper.html().length).toBeGreaterThan(0)
  wrapper.unmount()
})
