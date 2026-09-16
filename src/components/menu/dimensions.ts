import type { ZtComponentSize } from '../types'
// Compact rails retain enough room for four-character module labels.
export const menuDimensions: Record<ZtComponentSize, { width:number; rail:number; collapsed:number; popup:number }> = {
 mini: {width:252,rail:64,collapsed:48,popup:184},
 small: {width:280,rail:68,collapsed:52,popup:208},
 default: {width:312,rail:68,collapsed:56,popup:232},
 medium: {width:340,rail:72,collapsed:60,popup:256},
 large: {width:368,rail:76,collapsed:64,popup:280},
}
