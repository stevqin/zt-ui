import { describe, expect, it } from 'vitest'
import { filterSelectOptions, multipleValues, singleValue } from '../src/components/select/options'

describe('select option helpers', () => {
  it('filters labels case-insensitively without mutating options', () => {
    const options = [{ label: 'Hangzhou', value: 1 }, { label: 'Shanghai', value: 2 }]
    expect(filterSelectOptions(options, 'HANGZ')).toEqual([options[0]])
    expect(options).toHaveLength(2)
  })

  it('normalizes model values for the active mode', () => {
    expect(singleValue(['a'])).toBeNull()
    expect(singleValue('a')).toBe('a')
    expect(multipleValues('a')).toEqual([])
    expect(multipleValues(['a', 'b'])).toEqual(['a', 'b'])
    expect(multipleValues(['a', 'a', 'b'])).toEqual(['a', 'b'])
  })
})
