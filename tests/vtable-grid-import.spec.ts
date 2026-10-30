import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import ImportDialog from '../src/components/vtable-grid/ZtVTableGridImportDialog.vue'
const modal = { props: ['modelValue', 'loading'], template: '<div><slot name="title"/><slot/><slot name="footer"/><button class="close" @click="$emit(\'update:modelValue\', false)">关闭</button></div>' }
describe('grid import dialog', () => {
  it.each(['csv', 'xls', 'xlsx'])('shows the %s format icon beside the title', format => {
    const wrapper = mount(ImportDialog, { props: { modelValue: true, title: '导入库存', allowedExtensions: [format], fileTypeLabel: format.toUpperCase() }, global: { stubs: { ZtModal: modal } } })
    try {
      expect(wrapper.get('.zt-vtable-grid-import__title').text()).toContain('导入库存')
      const icon = wrapper.get('.zt-vtable-grid-import__file-mark')
      expect(icon.attributes('data-format')).toBe(format)
      expect(icon.text()).toBe(format.toUpperCase())
      expect(icon.find('svg').exists()).toBe(true)
      expect(icon.attributes('aria-hidden')).toBe('true')
    } finally { wrapper.unmount() }
  })
  it('updates the title icon when the selected file format changes or is cleared', async () => {
    const wrapper = mount(ImportDialog, { props: { modelValue: true, allowedExtensions: ['csv', 'xls', 'xlsx'] }, global: { stubs: { ZtModal: modal } } })
    try {
      await wrapper.setProps({ file: new File(['a'], 'INVENTORY.XLSX') })
      expect(wrapper.get('.zt-vtable-grid-import__file-mark').attributes('data-format')).toBe('xlsx')
      await wrapper.setProps({ file: new File(['a'], 'inventory.xls') })
      expect(wrapper.get('.zt-vtable-grid-import__file-mark').text()).toBe('XLS')
      await wrapper.setProps({ file: new File(['a'], 'inventory') })
      expect(wrapper.get('.zt-vtable-grid-import__file-mark').text()).toBe('FILE')
      await wrapper.setProps({ file: null })
      expect(wrapper.get('.zt-vtable-grid-import__file-mark').text()).toBe('CSV')
    } finally { wrapper.unmount() }
  })
  it('renders custom regions with a common guarded scope and keeps the native picker', async () => {
    let scope: any
    const wrapper = mount(ImportDialog, {
      props: { modelValue: true, title: '导入库存', description: '原说明', templateDownload: true, allowedExtensions: ['csv'] },
      global: { stubs: { ZtModal: modal } },
      slots: {
        title: (state: any) => h('span', `自定义${state.title}`),
        description: () => h('p', '自定义说明'),
        options: (state: any) => { scope = state; return h('span', `选项:${state.format}`) },
        upload: (state: any) => h('button', { class: 'choose', onClick: state.openFileDialog }, '自定义选择'),
        error: (state: any) => h('p', { class: 'custom-error' }, state.error),
        footer: (state: any) => h('button', { class: 'submit', disabled: !state.canConfirm, onClick: state.confirm }, '提交文件'),
      },
    })
    try {
      expect(wrapper.text()).toContain('自定义导入库存')
      expect(wrapper.text()).toContain('自定义说明')
      expect(wrapper.text()).not.toContain('原说明')
      const picker = vi.spyOn(wrapper.get('input[type=file]').element as HTMLInputElement, 'click').mockImplementation(() => {})
      await wrapper.get('.choose').trigger('click')
      expect(picker).toHaveBeenCalledTimes(1)
      expect(scope.selectFile(new File(['a'], 'bad.xlsx'))).toBe(false)
      await flushPromises()
      expect(wrapper.get('.custom-error').text()).toContain('.csv')
      const file = new File(['a'], 'inventory.csv')
      expect(scope.selectFile(file)).toBe(true)
      expect(wrapper.emitted('update:file')?.at(-1)).toEqual([file])
      await wrapper.setProps({ file })
      expect(scope.canConfirm).toBe(true)
      scope.downloadTemplate()
      expect(wrapper.emitted('template')).toHaveLength(1)
      const first = scope.confirm()
      const second = scope.confirm()
      await Promise.all([first, second])
      expect(wrapper.emitted('confirm')).toHaveLength(1)
      await wrapper.setProps({ loading: true })
      scope.cancel(); scope.removeFile(); scope.openFileDialog(); scope.downloadTemplate(); await scope.confirm()
      expect(scope.selectFile(file)).toBe(false)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('update:file')).toHaveLength(1)
      expect(wrapper.emitted('template')).toHaveLength(1)
      expect(wrapper.emitted('confirm')).toHaveLength(1)
      expect(picker).toHaveBeenCalledTimes(1)
    } finally { wrapper.unmount() }
  })
  it('customizes selected file and template content without replacing drop validation', async () => {
    const file = new File(['a'], 'inventory.csv')
    const wrapper = mount(ImportDialog, { props: { modelValue: true, file, allowedExtensions: ['csv'] }, global: { stubs: { ZtModal: modal } }, slots: { file: ({ file, removeFile }: any) => h('button', { class: 'custom-file', onClick: removeFile }, file.name), template: () => h('span', '模板说明'), instructions: () => h('p', '业务步骤') } })
    try {
      expect(wrapper.get('.custom-file').text()).toBe(file.name)
      expect(wrapper.text()).toContain('模板说明')
      expect(wrapper.text()).toContain('业务步骤')
      await wrapper.get('[data-dropzone]').trigger('drop', { dataTransfer: { files: [new File([], 'bad.xlsx')] } })
      expect(wrapper.emitted('invalid-file')).toHaveLength(1)
      await wrapper.get('.custom-file').trigger('click')
      expect(wrapper.emitted('update:file')?.at(-1)).toEqual([null])
    } finally { wrapper.unmount() }
  })
  it('validates drops and emits the selected file on confirm', async () => {
    const wrapper = mount(ImportDialog, { props: { modelValue: true, file: null, loading: false }, global: { stubs: { ZtModal: modal } } })
    const invalid = new File(['a'], 'a.csv')
    await wrapper.get('[data-dropzone]').trigger('drop', { dataTransfer: { files: [invalid] } })
    expect(wrapper.emitted('update:file')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toContain('.xlsx')
    const file = new File(['a'], 'A.XLSX')
    await wrapper.get('[data-dropzone]').trigger('drop', { dataTransfer: { files: [file] } })
    expect(wrapper.emitted('update:file')?.[0]).toEqual([file])
    await wrapper.setProps({ file })
    await wrapper.get('[data-confirm]').trigger('click')
    expect(wrapper.emitted('confirm')?.[0]).toEqual([file])
  })
  it('blocks close, replacement and confirm while busy', async () => {
    const wrapper = mount(ImportDialog, { props: { modelValue: true, file: new File(['a'], 'a.xlsx'), loading: true }, global: { stubs: { ZtModal: modal } } })
    await wrapper.get('.close').trigger('click')
    await wrapper.get('[data-dropzone]').trigger('drop', { dataTransfer: { files: [new File([], 'b.xlsx')] } })
    await wrapper.get('[data-confirm]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:file')).toBeUndefined()
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })
})
