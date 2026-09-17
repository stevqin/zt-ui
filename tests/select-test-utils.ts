import { DOMWrapper, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'

export async function searchInput(wrapper: VueWrapper) {
  const trigger = wrapper.get<HTMLInputElement>('.zt-select__input')
  if (!wrapper.classes().includes('is-multiple') || !wrapper.classes().includes('is-searchable')) return trigger
  await trigger.trigger('click')
  await nextTick()
  const list = document.getElementById(trigger.attributes('aria-controls'))
  return new DOMWrapper(list!.parentElement!.querySelector<HTMLInputElement>('.zt-select__search-input')!)
}
