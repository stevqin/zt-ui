export function snapSliderValue(value: number, min: number, max: number, step: number) {
  if (!Number.isFinite(value)) value = min
  if (max <= min) return min
  if (!Number.isFinite(step) || step <= 0) step = 1
  if (value >= max) return max
  const units = (Math.max(min, value) - min) / step
  const snapped = min + Math.round(units + Number.EPSILON * Math.max(1, Math.abs(units)) * 4) * step
  return Math.max(min, Math.min(max, Number(snapped.toPrecision(12))))
}
