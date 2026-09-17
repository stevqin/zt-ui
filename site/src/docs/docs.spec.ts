import { describe, it, expect } from 'vitest'
import { components, scenarios } from './catalog'
import { api, descriptions } from './reference'
import { searchDocs } from './search'

describe('documentation coverage and search',()=>{
 it('documents all component pages with named APIs and descriptions',()=>{
  expect(Object.keys(api).sort()).toEqual(components.map(c=>c.path.slice(1)).sort())
  for(const doc of Object.values(api)) for(const c of doc.components){
   expect(c.props.length,c.name).toBeGreaterThan(0)
   for(const p of c.props){expect(p.type).toBeTruthy();expect(p.default).toBeDefined();expect(p.description||descriptions[p.name],c.name+'.'+p.name).toBeTruthy()}
  }
 })
 it('covers inherited props, combination components and date options',()=>{
  expect(api.modal!.components[0]!.props.map(p=>p.name)).toContain('beforeClose')
  expect(api.password!.components[0]!.props.map(p=>p.name)).toContain('maxlength')
  expect(api.password!.components[0]!.props.map(p=>p.name)).not.toContain('type')
  expect(api.checkbox!.components.map(c=>c.name)).toContain('ZtCheckboxGroup')
  expect(api['date-picker']!.components[0]!.props.find(p=>p.name==='showHolidays')!.default).toBe('true')
 })
 it('keeps component-specific descriptions and computed table defaults accurate',()=>{
  const form=api.form!.components.find(c=>c.name==='ZtForm')!
  expect(form.props.find(p=>p.name==='size')!.description).toContain('表单及其子控件')
  expect(form.props.find(p=>p.name==='disabled')!.description).not.toContain('整组')
  const group=api.checkbox!.components.find(c=>c.name==='ZtCheckboxGroup')!
  expect(group.props.find(p=>p.name==='modelValue')!.description).not.toBe('单独使用时的状态')
  expect(api['vtable-grid']!.components[0]!.props.find(p=>p.name==='pageSize')!.default).toBe('200')
  expect(api.modal!.types.find(t=>t.name==='ZtOverlayCommonProps')!.public).toBe(false)
  expect(api.select!.components[0]!.slots.find(s=>s.name==='tag')!.type).toContain('remove')
 })
 it('resolves all scenario component links',()=>{for(const s of scenarios)for(const id of s.components)expect(api[id],s.id+': '+id).toBeDefined()})
 it('finds Chinese scenarios and API names with direct anchors',()=>{
  expect(searchDocs('表单录入').some(r=>r.path==='/scenarios/form-entry')).toBe(true)
  expect(searchDocs('holidays')[0]!.path).toBe('/date-picker#ztdatepicker-props-holidays')
  expect(searchDocs('DatePicker holidays').some(r=>r.path.includes('ztdatepicker-props-holidays'))).toBe(true)
  expect(searchDocs('无法匹配的文档')).toEqual([])
  expect(searchDocs(' ')).toEqual([])
 })
})
