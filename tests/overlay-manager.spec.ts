import { afterEach, describe, expect, it } from 'vitest'
import {
  enterOverlay,
  isTopOverlay,
  leaveOverlay,
  lockBody,
  resetOverlayManager,
  topOverlayId,
  unlockBody,
} from '../src/components/overlay/overlayManager'

afterEach(() => {
  resetOverlayManager()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})

describe('overlay manager', () => {
  it('tracks stable, increasing layers and the top overlay', () => {
    const first = Symbol('first')
    const second = Symbol('second')

    expect(enterOverlay(first, 1000)).toBe(1000)
    expect(enterOverlay(first, 1000)).toBe(1000)
    expect(enterOverlay(second, 1000)).toBe(1002)
    expect(topOverlayId.value).toBe(second)
    expect(isTopOverlay(first)).toBe(false)
    expect(isTopOverlay(second)).toBe(true)

    leaveOverlay(second)
    expect(topOverlayId.value).toBe(first)
  })

  it('keeps body locked until the last owner leaves and restores inline styles', () => {
    const first = Symbol('first')
    const second = Symbol('second')
    document.body.style.overflow = 'scroll'
    document.body.style.paddingRight = '7px'

    lockBody(first)
    lockBody(second)
    expect(document.body.style.overflow).toBe('hidden')

    unlockBody(first)
    expect(document.body.style.overflow).toBe('hidden')

    unlockBody(second)
    expect(document.body.style.overflow).toBe('scroll')
    expect(document.body.style.paddingRight).toBe('7px')
  })
})
