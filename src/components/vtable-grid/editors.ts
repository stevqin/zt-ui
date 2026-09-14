import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors'
import type { ZtVTableGridEditor } from './types'

type RegisterEditor = (name: string, editor: unknown) => void
let registrar: RegisterEditor | undefined
let staticRegistered = false
const dynamicNames = new Set<string>()

class TypedInputEditor extends InputEditor {
  constructor(
    private readonly type: 'number' | 'email' | 'url',
    private readonly constraints: { min?: number; max?: number; step?: number } = {},
  ) { super() }

  override createElement() {
    super.createElement()
    if (!this.element) return
    this.element.type = this.type
    if (this.constraints.min !== undefined) this.element.min = String(this.constraints.min)
    if (this.constraints.max !== undefined) this.element.max = String(this.constraints.max)
    if (this.constraints.step !== undefined) this.element.step = String(this.constraints.step)
  }
}

type SelectOption = { label: string; value: string | number } | string | number

function normalizedSelectOptions(options: SelectOption[]) {
  return options.map(option => typeof option === 'object'
    ? { label: option.label, value: option.value }
    : { label: String(option), value: option })
}

class ValueListEditor extends ListEditor {
  private readonly options: Array<{ label: string; value: string | number }>

  constructor(options: SelectOption[]) {
    const normalized = normalizedSelectOptions(options)
    super({ values: normalized.map(option => String(option.value)) })
    this.options = normalized
  }

  override createElement(value: string) {
    const select = document.createElement('select')
    select.setAttribute('type', 'text')
    select.style.position = 'absolute'
    select.style.padding = '4px'
    select.style.width = '100%'
    select.style.boxSizing = 'border-box'
    select.style.backgroundColor = '#fff'
    select.style.border = '2px solid #d9d9d9'
    this.options.forEach((item) => {
      const option = document.createElement('option')
      option.value = String(item.value)
      option.textContent = item.label
      option.selected = option.value === String(value)
      select.appendChild(option)
    })
    this.element = select
    this.container?.appendChild(select)
  }

  override setValue(value: string) {
    if (this.element) this.element.value = String(value)
  }

  override getValue(): any {
    const selected = this.element?.value
    return this.options.find(option => String(option.value) === selected)?.value ?? selected
  }
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
  if (editor.type === 'number') {
    if (editor.min === undefined && editor.max === undefined && editor.step === undefined) return 'zt-vtable-number'
    const name = `zt-vtable-number-${editor.min ?? ''}:${editor.max ?? ''}:${editor.step ?? ''}`
    if (registrar && !dynamicNames.has(name)) {
      registrar(name, new TypedInputEditor('number', editor))
      dynamicNames.add(name)
    }
    return name
  }
  const normalized = normalizedSelectOptions(editor.options)
  const signature = editor.options.every(option => typeof option !== 'object')
    ? normalized.map(option => String(option.value)).join('|')
    : normalized.map(option => `${option.label}:${typeof option.value}:${String(option.value)}`).join('|')
  const name = `zt-vtable-select-${signature}`
  if (registrar && !dynamicNames.has(name)) {
    registrar(name, new ValueListEditor(editor.options))
    dynamicNames.add(name)
  }
  return name
}
