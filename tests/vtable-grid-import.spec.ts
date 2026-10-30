import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ImportDialog from '../src/components/vtable-grid/ZtVTableGridImportDialog.vue'
const modal = { props: ['modelValue', 'loading'], template: '<div><slot/><slot name="footer"/><button class="close" @click="$emit(\'update:modelValue\', false)">关闭</button></div>' }
describe('grid import dialog', () => {
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
