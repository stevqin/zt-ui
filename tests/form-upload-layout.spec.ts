import { h, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ZtForm, ZtFormItem, ZtUpload } from '../src'
import type { ZtUploadFile } from '../src'

function mountUpload(props: Record<string, unknown> = {}) {
  const model = reactive({ attachments: [] as ZtUploadFile[] })
  return mount(ZtForm, {
    props: {
      model,
      rules: { attachments: { required: true, message: '请选择附件' } },
    },
    slots: {
      default: () => h(ZtFormItem, { prop: 'attachments' }, () => h(ZtUpload, {
        fileList: model.attachments,
        autoUpload: false,
        ...props,
      })),
    },
  })
}

describe('ZtUpload form feedback layout', () => {
  it('marks an empty button upload as compact so feedback can follow its trigger', () => {
    const wrapper = mountUpload()

    expect(wrapper.get('.zt-upload').classes()).toContain('is-form-feedback-compact')
  })

  it('keeps full-width upload variants fluid', () => {
    expect(mountUpload({ drag: true }).get('.zt-upload').classes()).not.toContain('is-form-feedback-compact')
    expect(mountUpload({ listType: 'picture-card' }).get('.zt-upload').classes()).not.toContain('is-form-feedback-compact')
  })
})
