export function calendarDate(year: number, month: number, day: number) {
  const date = new Date(0)
  date.setFullYear(year, month, day)
  date.setHours(0, 0, 0, 0)
  return date
}
export function dateKey(date: Date) {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function parseDate(value: string | undefined, datetime = false): Date | null {
  const pattern = datetime ? /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/ : /^(\d{4})-(\d{2})-(\d{2})$/
  const match = value?.match(pattern)
  if (!match) return null
  const [, y, m, d, h = '0', min = '0', sec = '0'] = match
  const date = calendarDate(+y, +m - 1, +d)
  if (+y < 1 || dateKey(date) !== value!.slice(0, 10) || +h > 23 || +min > 59 || +sec > 59) return null
  date.setHours(+h, +min, +sec)
  return date
}
export function addDays(date: Date, days: number) {
  return calendarDate(date.getFullYear(), date.getMonth(), date.getDate() + days)
}
export function monthDays(month: Date) {
  const first = calendarDate(month.getFullYear(), month.getMonth(), 1)
  const start = addDays(first, -((first.getDay() + 6) % 7))
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}
export function normalizeTime(value: string) {
  return /^\d{2}:\d{2}$/.test(value) ? `${value}:00` : value
}
