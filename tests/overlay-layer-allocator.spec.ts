import {afterEach, expect, it, vi} from 'vitest'
import * as manager from '../src/components/overlay/overlayManager'
afterEach(() => {manager.resetOverlayManager(); (manager as any).setOverlayZIndexAllocator?.(undefined)})
it('integrates an external layer allocator while respecting the shared overlay stack', () => {
 const allocate=vi.fn((minimum:number) => Math.max(minimum, 6000))
 expect(typeof (manager as any).setOverlayZIndexAllocator).toBe('function')
 ;(manager as any).setOverlayZIndexAllocator(allocate)
 expect(manager.enterOverlay(Symbol(),1000)).toBe(6000)
 expect(manager.enterOverlay(Symbol(),1000)).toBe(6002)
 expect(allocate.mock.calls.map(c=>c[0])).toEqual([1000,6002])
})
