import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors'
import type { ZtVTableGridEditor } from './types'

type RegisterEditor = (name: string, editor: unknown) => void
let registrar: RegisterEditor | undefined
let staticRegistered = false
const dynamicNames = new Set<string>()

class TypedInputEditor extends InputEditor {
  constructor(private readonly type: 'number' | 'email' | 'url') { super() }
  override createElement() {
    super.createElement()
    if (this.element) this.element.type = this.type
  }
}

function selectValues(editor: Extract<ZtVTableGridEditor, { type: 'select' }>) {
  return editor.options.map(option => typeof option === 'object' ? String(option.value) : String(option))
}

export function registerGridEditors(register: RegisterEditor) {
  registrar = register
  if (staticRegistered) return
  staticRegistered = true
  register('zt-vtable-text', new InputEditor())
  register('zt-vtable-textarea', new TextAreaEditor())
  register('zt-vtable-date', new DateInputEditor())
  register('zt-vtable-number', new TypedInputEditor('number'))
  register('zt-vtable-email', new TypedInputEditor('email'))
  register('zt-vtable-url', new TypedInputEditor('url'))
}

export function editorName(editor: ZtVTableGridEditor) {
  if (!editor) return undefined
  if (editor === true) return 'zt-vtable-text'
  if (typeof editor === 'string') return `zt-vtable-${editor}`
  if (editor.type === 'number') return 'zt-vtable-number'
  const values = selectValues(editor)
  const name = `zt-vtable-select-${values.join('|')}`
  if (registrar && !dynamicNames.has(name)) {
    registrar(name, new ListEditor({ values }))
    dynamicNames.add(name)
  }
  return name
}
