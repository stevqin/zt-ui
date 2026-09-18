import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from '../App.vue'
import { components, scenarios } from '../docs/catalog'
import { router as siteRouter } from '../router'
// @ts-expect-error Node-only audit script is shared with the build gate.
import { inspectExamples } from '../../scripts/audit-examples.mjs'

const audit = inspectExamples()

describe('shared component documentation reading flow', () => {
  it('covers every component page with one catalog route and example inventory', () => {
    const pages = readdirSync(resolve(process.cwd(), 'src/views'), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory() && entry.name !== 'feedback')
      .filter((entry) => {
        try {
          readFileSync(
            resolve(process.cwd(), 'src/views', entry.name, 'Index.vue'),
          )
          return true
        } catch {
          return false
        }
      })
      .map((entry) => '/' + entry.name)
      .sort()
    expect(components.map((component) => component.path).sort()).toEqual(pages)
    for (const component of components) {
      expect(
        siteRouter.getRoutes().filter((route) => route.path === component.path),
      ).toHaveLength(1)
      expect(component.page?.examples).toEqual(
        audit.pages
          .find(
            (page: { component: string }) =>
              page.component === component.path.slice(1),
          )
          .examples.map(
            ({
              title,
              kind,
              file,
              description,
            }: {
              title: string
              kind: string
              file: string | null
              description: string
            }) => ({ title, kind, file, description }),
          ),
      )
    }
    expect(siteRouter.resolve({ name: 'menu-demo' }).path).toBe('/menu')
  })

  it.each(components)(
    '$name renders one complete shell on its real route',
    async (component) => {
      const router = createRouter({
        history: createMemoryHistory(),
        routes: siteRouter.options.routes,
      })
      await router.push(component.path)
      await router.isReady()
      const warnings: string[] = []
      const wrapper = mount(App, {
        global: {
          plugins: [router],
          stubs: { ZtVTableGrid: true },
          config: { warnHandler: (message) => warnings.push(message) },
        },
      })
      try {
        await flushPromises()
        const shells = wrapper.findAll('.component-page-shell')
        expect(shells, component.path).toHaveLength(1)
        const shell = shells[0]!
        expect(shell.attributes('data-component')).toBe(component.path.slice(1))
        const headings = shell
          .findAll('h1')
          .filter((heading) => !heading.element.closest('.doc-demo'))
        expect(headings).toHaveLength(1)
        expect(headings[0]!.text()).toBe(`${component.name} ${component.title}`)
        expect(shell.get('[data-page-section="purpose"]').text()).toContain(
          component.page.purpose,
        )
        for (const section of ['guidance', 'examples', 'notes', 'related']) {
          expect(
            shell.findAll(`[data-page-section="${section}"]`),
          ).toHaveLength(1)
          expect(
            shell.get(`[data-page-section="${section}"]`).text().trim().length,
          ).toBeGreaterThan(8)
        }
        for (const note of [
          ...component.page.designNotes,
          ...component.page.accessibilityNotes,
        ])
          expect(shell.get('[data-page-section="notes"]').text()).toContain(
            note,
          )
        for (const point of component.page.guidance)
          expect(shell.get('[data-page-section="guidance"]').text()).toContain(
            point,
          )
        expect(shell.findAll('.api-reference')).toHaveLength(1)
        expect(wrapper.findAll('.api-reference')).toHaveLength(1)
        expect(shell.findAll('.doc-demo')).toHaveLength(
          component.page.examples.length,
        )
        expect(
          shell.findAll('[data-page-section="examples"] .doc-section'),
        ).toHaveLength(0)
        expect(
          shell
            .findAll('.component-examples h2')
            .filter((heading) => !heading.element.closest('.doc-demo')),
        ).toHaveLength(0)
        const related = shell.get('[data-page-section="related"]')
        expect(related.findAll('a').length).toBeGreaterThan(0)
        for (const scenario of scenarios.filter((item) =>
          item.components.includes(component.path.slice(1)),
        ))
          expect(
            related.find(`a[href="/scenarios/${scenario.id}"]`).exists(),
          ).toBe(true)
        expect(
          warnings.filter((message) =>
            /not defined|Failed to resolve|Invalid prop|injection .*not found/.test(
              message,
            ),
          ),
        ).toEqual([])
      } finally {
        wrapper.unmount()
      }
    },
  )

  it('keeps guides outside the component shell', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: siteRouter.options.routes,
    })
    await router.push('/feedback')
    const wrapper = mount(App, { global: { plugins: [router] } })
    try {
      await flushPromises()
      expect(wrapper.find('.component-page-shell').exists()).toBe(false)
      expect(wrapper.findAll('h1')).toHaveLength(1)
      expect(wrapper.find('.doc-demo').exists()).toBe(true)
    } finally {
      wrapper.unmount()
    }
  })
})
