import type { ZtTimeSelectProps } from './types';
import type { ZtSelectOption } from '../select/types';
function minutes(value: string | undefined) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return NaN;
  const [h, m] = value.split(':').map(Number);
  return h! < 24 && m! < 60 ? h! * 60 + m! : NaN;
}
export function generateTimeOptions(
  props: ZtTimeSelectProps,
): ZtSelectOption[] {
  const start = minutes(props.start ?? '09:00'),
    end = minutes(props.end ?? '18:00'),
    step = minutes(props.step ?? '00:30'),
    min = minutes(props.minTime),
    max = minutes(props.maxTime);
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(step) ||
    step <= 0 ||
    start > end
  )
    return [];
  const ranges = (props.disabledRanges ?? []).map(([a, b]) => [
    minutes(a),
    minutes(b),
  ]);
  const result: ZtSelectOption[] = [];
  for (let n = start; n <= end; n += step) {
    const label = `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
    result.push({
      value: label,
      label,
      disabled:
        n <= min || n >= max || ranges.some(([a, b]) => n >= a! && n <= b!),
    });
  }
  return result;
}
