// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Input from '../src/examples/input/Basic.vue'
import Form from '../src/examples/form/Basic.vue'
import Upload from '../src/examples/upload/Basic.vue'
import Modal from '../src/examples/modal/Async.vue'
import Drawer from '../src/examples/drawer/Async.vue'
import ImportExport from '../src/examples/vtable-grid/ImportExport.vue'

describe('表单和浮层示例的真实交互', () => {
  it('导入弹窗将真实 CSV 行追加为库存数据', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ImportExport, { global: { stubs: { ZtVTableGrid: true, ZtVTableGridImportDialog: true } } })
    const dialog = wrapper.findComponent({ name: 'ZtVTableGridImportDialog' })
    const file = new File(['name,brand,stock\n无线键盘,品牌B,10\n桌面支架,品牌A,30'], 'inventory.csv', { type: 'text/csv' })
    dialog.vm.$emit('confirm', file)
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(wrapper.text()).toContain('已导入 2 行')
    const rows = wrapper.findComponent({ name: 'ZtVTableGrid' }).props('records')
    expect(rows).toHaveLength(3)
    expect(rows[2]).toMatchObject({ name: '桌面支架', brand: '品牌A', stock: 30 })
    wrapper.unmount()
    vi.useRealTimers()
  })
  it('输入内容同步到可见结果', async () => {
    const wrapper = mount(Input)
    await wrapper.find('input').setValue('秋季上新')
    expect(wrapper.text()).toContain('秋季上新')
    wrapper.unmount()
  })
  it('表单校验失败后修正字段可提交', async () => {
    const wrapper = mount(Form, { attachTo: document.body })
    await wrapper.find('[data-submit]').trigger('click')
    await flushPromises()
    expect(document.body.textContent).toContain('请输入姓名')
    await wrapper.find('input').setValue('张三')
    await wrapper.findAll('input')[1]!.setValue('zhang@example.com')
    await wrapper.find('[data-submit]').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('已提交')
    wrapper.unmount()
  })
  it('自定义上传首次失败后可重试', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Upload)
    const input = wrapper.find('input[type=file]')
    Object.defineProperty(input.element, 'files', { value: [new File(['库存'], 'stock.csv', { type: 'text/csv' })] })
    await input.trigger('change')
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(wrapper.text()).toContain('模拟网络中断')
    const retry = wrapper.findAll('button').find(button => button.text().includes('重试'))
    expect(retry).toBeTruthy()
    await retry!.trigger('click')
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(wrapper.text()).toContain('上传完成')
    wrapper.unmount()
    vi.useRealTimers()
  })
  it.each([{ name: 'Modal', component: Modal }, { name: 'Drawer', component: Drawer }])('$name 拦截关闭，异步保存后结束编辑', async ({ component }) => {
    vi.useFakeTimers()
    const wrapper = mount(component, { attachTo: document.body })
    await wrapper.find('button').trigger('click')
    await flushPromises()
    const cancel = Array.from(document.body.querySelectorAll('button')).find(button => button.textContent?.trim() === '取消')
    expect(cancel).toBeTruthy()
    cancel!.click()
    await flushPromises()
    expect(document.body.textContent).toContain('未保存内容受到保护')
    const confirm = Array.from(document.body.querySelectorAll('button')).find(button => button.textContent?.trim() === '确定')
    confirm!.click()
    await flushPromises()
    expect(confirm!.disabled).toBe(true)
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(wrapper.text()).toContain('保存成功')
    wrapper.unmount()
    vi.useRealTimers()
  })
})
