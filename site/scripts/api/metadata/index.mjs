import foundation from './foundation.mjs'
import layout from './layout.mjs'
import form from './form.mjs'
import data from './data.mjs'
import navigation from './navigation.mjs'
import feedback from './feedback.mjs'
import overlay from './overlay.mjs'
import media from './media.mjs'
import generatedProps from './generated-props.mjs'
import { eventDescriptions, exposeDescriptions, propDescriptions, slotDescriptions } from './shared.mjs'

export const metadata = Object.assign({}, generatedProps, foundation, layout, form, data, navigation, feedback, overlay, media)
export const metadataKeys = new Set(Object.keys(metadata))

export function rowMetadata(id, owner, section, name) {
  return metadata[`${id}.${owner}.${section}.${name}`] ?? {}
}

export function sharedDescription(section, name) {
  if (section === 'props') return propDescriptions[name]
  if (section === 'events') return name.startsWith('update:')
    ? `双向绑定更新事件，对应 v-model${name === 'update:modelValue' ? '' : ':' + name.slice(7)}。`
    : eventDescriptions[name]
  if (section === 'slots') return slotDescriptions[name]
  if (section === 'exposes') return exposeDescriptions[name]
}
