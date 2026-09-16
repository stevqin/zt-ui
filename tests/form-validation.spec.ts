import { describe, expect, it } from 'vitest'
import { getPathValue, setPathValue } from '../src/components/form/path'
import { validateValue } from '../src/components/form/validation'
import type { ZtFormRule } from '../src/components/form/types'

describe('form model paths', () => {
  it('reads and writes dot and bracket paths', () => {
    const model = { user: { profile: { name: 'Ada' } }, rows: [{ quantity: 2 }] }

    expect(getPathValue(model, 'user.profile.name')).toBe('Ada')
    expect(getPathValue(model, 'rows[0].quantity')).toBe(2)
    setPathValue(model, 'rows[0].quantity', 5)
    setPathValue(model, ['user', 'email'], 'ada@example.com')

    expect(model.rows[0].quantity).toBe(5)
    expect((model.user as Record<string, unknown>).email).toBe('ada@example.com')
  })
})

describe('validateValue', () => {
  it('validates required values without accepting whitespace', async () => {
    const rule: ZtFormRule = { required: true, whitespace: true, message: '请输入名称' }
    expect(await validateValue('   ', [rule], {})).toBe('请输入名称')
    expect(await validateValue('Zt UI', [rule], {})).toBeUndefined()
  })

  it('validates literal numeric and length constraints', async () => {
    expect(await validateValue(3, [{ min: 4, message: '至少为 4' }], {})).toBe('至少为 4')
    expect(await validateValue(8, [{ min: 4, max: 10 }], {})).toBeUndefined()
    expect(await validateValue('abcd', [{ len: 3, message: '长度为 3' }], {})).toBe('长度为 3')
    expect(await validateValue(['a'], [{ min: 2, message: '至少两项' }], {})).toBe('至少两项')
  })

  it('validates pattern and built-in types', async () => {
    expect(await validateValue('abc', [{ pattern: /^ZT-\d+$/, message: '编号格式错误' }], {})).toBe('编号格式错误')
    expect(await validateValue('bad', [{ type: 'email', message: '邮箱格式错误' }], {})).toBe('邮箱格式错误')
    expect(await validateValue('https://zt-ui.dev', [{ type: 'url' }], {})).toBeUndefined()
    expect(await validateValue('12', [{ type: 'number', message: '必须是数字' }], {})).toBe('必须是数字')
  })

  it('filters event-triggered rules but runs every rule for explicit validation', async () => {
    const rules: ZtFormRule[] = [
      { required: true, trigger: 'blur', message: '失焦校验' },
      { min: 3, trigger: 'change', message: '输入校验' },
    ]

    expect(await validateValue('a', rules, { trigger: 'change' })).toBe('输入校验')
    expect(await validateValue('', rules, { trigger: 'blur' })).toBe('失焦校验')
    expect(await validateValue('', rules, {})).toBe('失焦校验')
  })

  it('supports asynchronous custom validator results', async () => {
    const rules: ZtFormRule[] = [{
      validator: async (_rule, value) => value === 'taken' ? '名称已存在' : undefined,
    }]

    expect(await validateValue('taken', rules, { model: { name: 'taken' }, field: 'name' })).toBe('名称已存在')
    expect(await validateValue('available', rules, {})).toBeUndefined()
  })
})
