import { API_SECTIONS } from './model.mjs'

const broadType = /^(Function|object|array)$/i

export function validateApiDocuments(documents) {
  const errors = []
  for (const [id, document] of Object.entries(documents)) {
    if (!document.components?.length) errors.push(`${id}: 缺少组件 API`)
    for (const owner of document.components ?? []) {
      for (const section of API_SECTIONS) {
        for (const row of owner[section] ?? []) {
          const location = `${id}.${owner.name}.${section}.${row.name}`
          if (!row.description?.trim()) errors.push(`${location}: 缺少说明`)
          if (!row.type?.trim() || broadType.test(row.type.trim())) errors.push(`${location}: 类型必须使用具体签名或公共类型`)
          if (section === 'props' && (!row.default?.trim() || row.default === '未设置')) errors.push(`${location}: 默认值不明确`)
        }
      }
    }
  }
  return errors
}
