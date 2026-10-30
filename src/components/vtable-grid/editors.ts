import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors'
import type { ZtVTableGridEditor } from './types'

type EditorInput = ZtVTableGridEditor | 'image' | 'checkbox' | { type: 'image'; placeholder?: string }

/** Normalize only the editor's own scalar domain; select options retain their original values. */
export function normalizeGridEditorValue(editor: EditorInput, value: unknown): unknown {
  const type = typeof editor === 'object' ? editor.type : editor
  if (type === 'number') {
    if (value === '' || value == null) return value
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : value
  }
  if (type === 'checkbox') return value === true || value === 1 || value === '1' || value === 'true'
  if (type === 'image') return typeof value === 'string' ? value.trim() : value
  if (typeof editor === 'object' && editor.type === 'select') {
    const valueOf = (option: SelectOption) => typeof option === 'object' ? option.value : option
    const option = (editor.options ?? []).find(option => Object.is(valueOf(option), value))
      ?? (editor.options ?? []).find(option => String(valueOf(option)) === String(value))
    return option === undefined ? value : typeof option === 'object' ? option.value : option
  }
  return value
}

type RegisterEditor = (name: string, editor: unknown) => void
let registrar: RegisterEditor | undefined
let staticRegistered = false
const dynamicNames = new Set<string>()

class TypedInputEditor extends InputEditor {
  constructor(
    private readonly type: 'number' | 'email' | 'url',
    private readonly constraints: { min?: number; max?: number; step?: number } = {},
  ) { super() }

  override getValue(): any {
    const value = super.getValue()
    return this.type === 'number' ? normalizeGridEditorValue('number', value) : value
  }

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

  private optionKey(index: number) {
    const value = String(this.options[index].value)
    return this.options.filter(option => String(option.value) === value).length > 1 ? `__zt_option_${index}` : value
  }

  private selectedIndex(value: unknown) {
    const exact = this.options.findIndex(option => Object.is(option.value, value))
    return exact >= 0 ? exact : this.options.findIndex(option => String(option.value) === String(value))
  }

  override createElement(value: any) {
    const select = document.createElement('select')
    select.setAttribute('type', 'text')
    select.style.position = 'absolute'
    select.style.padding = '4px'
    select.style.width = '100%'
    select.style.boxSizing = 'border-box'
    select.style.backgroundColor = '#fff'
    select.style.border = '2px solid #d9d9d9'
    const selectedIndex = this.selectedIndex(value)
    this.options.forEach((item, index) => {
      const option = document.createElement('option')
      option.value = this.optionKey(index)
      option.textContent = item.label
      option.selected = index === selectedIndex
      select.appendChild(option)
    })
    this.element = select
    this.container?.appendChild(select)
  }

  override setValue(value: any) {
    const index = this.selectedIndex(value)
    if (this.element) this.element.value = index >= 0 ? this.optionKey(index) : String(value)
  }

  override getValue(): any {
    const selected = this.element?.value
    return this.options.find((_, index) => this.optionKey(index) === selected)?.value ?? selected
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

export function editorName(editor: EditorInput) {
  if (!editor) return undefined
  if (editor === true) return 'zt-vtable-text'
  if (editor === 'checkbox') return undefined
  if (editor === 'image' || (typeof editor === 'object' && editor.type === 'image')) return 'zt-vtable-url'
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
  const normalized = normalizedSelectOptions(editor.options ?? [])
  const signature = (editor.options ?? []).every(option => typeof option !== 'object')
    ? normalized.map(option => String(option.value)).join('|')
    : normalized.map(option => `${option.label}:${typeof option.value}:${String(option.value)}`).join('|')
  const name = `zt-vtable-select-${signature}`
  if (registrar && !dynamicNames.has(name)) {
    registrar(name, new ValueListEditor(editor.options ?? []))
    dynamicNames.add(name)
  }
  return name
}
