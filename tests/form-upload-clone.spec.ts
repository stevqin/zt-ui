import { reactive } from 'vue'
import { describe,it,expect } from 'vitest'
import { cloneFormValue } from '../src/components/form/path'
describe('upload form snapshots',()=>{
 it('clones reactive arrays and nested proxies while retaining File objects',()=>{
  const file=new File(['hello'],'hello.txt',{type:'text/plain'})
  const nested=reactive({raw:file,name:'hello.txt'})
  const model=reactive({files:[nested],date:new Date('2026-01-01')})
  const copy=cloneFormValue(model)
  expect(copy).not.toBe(model);expect(copy.files).not.toBe(model.files)
  expect(copy.files[0]!.raw).toBe(file);expect(copy.date.getTime()).toBe(model.date.getTime())
  model.files[0]!.name='changed';expect(copy.files[0]!.name).toBe('hello.txt')
 })
 it('preserves cycles in reactive form values',()=>{
  const value=reactive<Record<string,unknown>>({});value.self=value
  const copy=cloneFormValue(value);expect(copy.self).toBe(copy)
 })
})
