import { describe, expect, it } from 'vitest'
import { normalizeDefault, normalizeEventType, toTemplateName } from './normalize.mjs'
import { validateApiDocuments } from './validate.mjs'

describe('API documentation normalization', () => {
  it('converts Vue property names to template attribute names', () => {
    expect(toTemplateName('modelValue')).toBe('model-value')
    expect(toTemplateName('borderRadius')).toBe('border-radius')
    expect(toTemplateName('disabled')).toBe('disabled')
  })

  it('describes every supported default source explicitly', () => {
    expect(normalizeDefault({ required: true })).toBe('必填')
    expect(normalizeDefault({ required: false })).toBe('无默认值')
    expect(normalizeDefault({ required: false, defaultValue: 'false' })).toBe('false')
    expect(normalizeDefault({ required: false, inherit: 'default' })).toBe('继承 ConfigProvider（最终为 default）')
    expect(normalizeDefault({ required: false, runtimeDefault: '根据容器宽度决定' })).toBe('运行时计算：根据容器宽度决定')
    expect(normalizeDefault({ required: false, parentDefault: '由 Form 的 disabled 提供' })).toBe('受组合组件控制：由 Form 的 disabled 提供')
  })

  it('renders Vue emit tuples as callback signatures', () => {
    expect(normalizeEventType('[value: string, previous: string]')).toBe('(value: string, previous: string) => void')
    expect(normalizeEventType('[]')).toBe('() => void')
  })

  it('reports ambiguous public API rows with their full location', () => {
    const errors = validateApiDocuments({
      demo: {
        components: [{
          name: 'ZtDemo',
          props: [{ name: 'request', templateName: 'request', kind: 'prop', type: 'Function', description: '', default: '未设置', required: false }],
          events: [], slots: [], exposes: [],
        }],
        types: [], sections: [],
      },
    })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('demo.ZtDemo.props.request: 缺少说明'),
      expect.stringContaining('demo.ZtDemo.props.request: 类型必须使用具体签名或公共类型'),
      expect.stringContaining('demo.ZtDemo.props.request: 默认值不明确'),
    ]))
  })
})
