import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { compile } from 'sass'
import { parse } from 'postcss'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { ZtConfigProvider, ZtPopover, ZtPopconfirm, ZtTooltip, ZtText } from '../src'

const wrappers: VueWrapper[] = []
const style = document.createElement('style')
const backgrounds: { selector: string; value: string }[] = []
beforeAll(() => {
  style.textContent = ['text/text', 'button/button', 'popover/popover', 'popconfirm/popconfirm']
    .map(path => {
      const css = parse(compile(`src/components/${path}.scss`).css)
      // Happy DOM applies pseudo-element styles to their originating element.
      // The contrast calculation below includes the sheen's maximum white tint.
      css.walkRules(rule => {
        if (rule.selector.includes('::')) { rule.remove(); return }
        rule.walkDecls(decl => {
          if (['background', 'background-color'].includes(decl.prop)) backgrounds.push({ selector: rule.selector, value: decl.value })
        })
      })
      return css.toString()
    }).join('\n')
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})
function background(popup: HTMLElement) {
  const css = getComputedStyle(popup)
  if (css.backgroundColor) return css.backgroundColor
  // Happy DOM also rejects var() fallbacks containing rgba() in background
  // declarations. Resolve the same specified color when CSSOM omits it.
  const resolve = (value: string): string => {
    const match = value.trim().match(/^var\((--[\w-]+)(?:,\s*([\s\S]*))?\)$/)
    if (!match) return value.trim()
    const defined = css.getPropertyValue(match[1]!).trim()
    return resolve(defined && defined !== 'initial' ? defined : match[2] ?? '')
  }
  return resolve(backgrounds.filter(rule => popup.matches(rule.selector)).at(-1)?.value ?? '')
}
function color(value: string) {
  if (value.startsWith('#')) {
    const hex = value.length === 4 ? [...value.slice(1)].map(char => char + char).join('') : value.slice(1)
    return [...hex.matchAll(/../g)].map(part => parseInt(part[0], 16)).concat(1)
  }
  const channels = value.match(/[\d.]+/g)?.map(Number) ?? []
  return [...channels.slice(0, 3), channels[3] ?? 1]
}
function contrast(a: string, b: string) {
  const luminance = (value: string) => color(value).slice(0, 3).map(v => {
    const n = v! / 255
    return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4
  }).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i]!, 0)
  const channels = color(b), alpha = channels[3]!
  // Test black and white content behind the glass, including its faint sheen.
  return Math.min(...[0, 255].map(backdrop => {
    const composite = channels.slice(0, 3).map(v => ((v! * alpha + backdrop * (1 - alpha)) * .965 + 255 * .035))
    const values = [luminance(a), luminance(`rgb(${composite.join(',')})`)].sort((x, y) => y - x)
    return (values[0]! + .05) / (values[1]! + .05)
  }))
}
async function render(kind: 'popover' | 'popconfirm' | 'tooltip', theme: 'light' | 'dark') {
  wrappers.push(mount(ZtConfigProvider, {
    attachTo: document.body, props: { theme },
    slots: { default: () => kind === 'popover'
      ? h(ZtPopover, { visible: true }, { content: () => '订单摘要' })
      : kind === 'popconfirm'
        ? h(ZtPopconfirm, { visible: true, title: '确定删除这条记录？', description: '删除后无法恢复', buttonSize: 'mini' })
        : h(ZtTooltip, { visible: true }, { content: () => h(ZtText, {}, () => '完整说明') }) },
  }))
  await nextTick(); await nextTick()
  const popup = document.querySelector<HTMLElement>('.zt-popover')!
  // Happy DOM treats custom-property `initial` as a literal instead of the
  // guaranteed-invalid value browsers use to select var() fallbacks.
  for (let i = popup.style.length - 1; i >= 0; i--) {
    const name = popup.style.item(i)
    if (name.startsWith('--zt-') && popup.style.getPropertyValue(name) === 'initial') popup.style.removeProperty(name)
  }
  return popup
}

describe('Floating surface readability', () => {
  it.each(['light', 'dark'] as const)('keeps Popover and Popconfirm translucent but legible over black and white content in %s theme', async theme => {
    for (const kind of ['popover', 'popconfirm'] as const) {
      const popup = await render(kind, theme)
      const css = getComputedStyle(popup)
      expect(color(background(popup))[3]).toBeGreaterThanOrEqual(.94)
      expect(color(background(popup))[3]).toBeLessThan(1)
      expect(contrast(css.color, background(popup))).toBeGreaterThanOrEqual(4.5)
      expect(css.boxShadow).not.toBe('none')
      if (kind === 'popconfirm') {
        const description = popup.querySelector('p')!
        expect(contrast(getComputedStyle(description).color, background(popup))).toBeGreaterThanOrEqual(4.5)
        expect(popup.querySelectorAll('button.zt-button--mini')).toHaveLength(2)
      }
      wrappers.pop()!.unmount()
    }
  })

  it.each(['light', 'dark'] as const)('gives Tooltip and its default rich text strong contrast in %s theme', async theme => {
    const popup = await render('tooltip', theme)
    const css = getComputedStyle(popup)
    expect(color(background(popup))[3]).toBeGreaterThanOrEqual(.94)
      expect(color(background(popup))[3]).toBeLessThan(1)
    expect(contrast(css.color, background(popup))).toBeGreaterThanOrEqual(7)
    expect(contrast(getComputedStyle(popup.querySelector('.zt-text')!).color, background(popup))).toBeGreaterThanOrEqual(7)
  })

  it('does not turn a containing Popover dark when it contains a nested Tooltip', async () => {
    wrappers.push(mount(ZtPopover, {
      attachTo: document.body, props: { visible: true },
      slots: { content: () => h(ZtTooltip, { visible: true, content: '内部提示' }, () => '嵌套触发器') },
    }))
    await nextTick(); await nextTick()
    const popups = [...document.querySelectorAll<HTMLElement>('.zt-popover')]
    expect(popups).toHaveLength(2)
    const outer = popups.find(popup => [...popup.children].find(child => child.classList.contains('zt-popover__content'))?.firstElementChild?.getAttribute('role') !== 'tooltip')!
    expect(color(background(outer))).toEqual([255, 255, 255, .94])
  })
  it('keeps an inline Popover inside a Tooltip readable without inheriting its light text', async () => {
    wrappers.push(mount(ZtTooltip, {
      attachTo: document.body, props: { visible: true },
      slots: { content: () => h(ZtPopover, { visible: true, teleported: false }, {
        content: () => h(ZtText, {}, () => '嵌套面板正文'),
      }) },
    }))
    await nextTick(); await nextTick()
    const popup = document.querySelector<HTMLElement>('.zt-popover--default')!
    const css = getComputedStyle(popup)
    expect(contrast(getComputedStyle(popup.querySelector('.zt-text')!).color, background(popup))).toBeGreaterThanOrEqual(4.5)
  })

})
